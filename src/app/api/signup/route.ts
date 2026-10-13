import { NextResponse, type NextRequest } from 'next/server';
import { AirtableWriteError, createSignupRecord } from '@/lib/airtable';
import { sendOwnerAlert, sendVisitorConfirmation } from '@/lib/email';
import { getEnv } from '@/lib/env';
import { isRateLimited } from '@/lib/rate-limit';
import { HONEYPOT_FIELD, signupSchema, toFieldErrors } from '@/lib/signup-schema';

// Only POST is exported, so Next.js answers other methods with 405.
export const runtime = 'nodejs';

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // 1. Honeypot filled: pretend success and do nothing.
  if (typeof body[HONEYPOT_FIELD] === 'string' && body[HONEYPOT_FIELD].trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  // 2. Rate limit.
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait a few minutes and try again.' },
      { status: 429 },
    );
  }

  // 3. Validate. Never trust client-side validation.
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please fix the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const signupDate = new Date().toISOString().slice(0, 10);

  let env: ReturnType<typeof getEnv>;
  try {
    env = getEnv();
  } catch (err) {
    console.error('[signup] config error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Something went wrong. Please try again in a moment.' }, { status: 500 });
  }
  const emailConfig = { apiKey: env.SENDGRID_API_KEY, fromEmail: env.FROM_EMAIL, ownerEmail: env.OWNER_EMAIL };

  // 4. Write to Airtable (one attempt).
  let recordId: string;
  try {
    recordId = await createSignupRecord(
      { token: env.AIRTABLE_TOKEN, baseId: env.AIRTABLE_BASE_ID, table: env.AIRTABLE_TABLE },
      input,
      signupDate,
    );
  } catch (err) {
    const error =
      err instanceof AirtableWriteError ? `${err.status ?? 'no response'} ${err.type}` : 'UNEXPECTED_ERROR';
    console.error(`[signup] Airtable write failed: ${error}`);

    // No visitor confirmation. Alert the owner with the full submission so the lead isn't lost.
    try {
      await sendOwnerAlert(emailConfig, input, signupDate, { ok: false, error });
    } catch (emailErr) {
      console.error('[signup] owner failure alert failed:', emailErr instanceof Error ? emailErr.message : emailErr);
    }

    return NextResponse.json(
      { error: `Something went wrong. Please try again, or email us at ${env.OWNER_EMAIL}.` },
      { status: 500 },
    );
  }

  // 5. Emails. The record is saved, so a failure here is logged but not shown to the visitor.
  const results = await Promise.allSettled([
    sendVisitorConfirmation(emailConfig, input),
    sendOwnerAlert(emailConfig, input, signupDate, { ok: true, recordId }),
  ]);
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[signup] email failed:', result.reason instanceof Error ? result.reason.message : result.reason);
    }
  }

  return NextResponse.json({ ok: true });
}
