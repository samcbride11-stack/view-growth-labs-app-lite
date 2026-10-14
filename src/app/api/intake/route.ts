import { NextResponse, type NextRequest } from 'next/server';
import { AirtableWriteError, createIntakeRecord } from '@/lib/airtable';
import { sendIntakeAlert } from '@/lib/email';
import { getEnv, getIntakeTable } from '@/lib/env';
import { intakeSchema, type IntakeField } from '@/lib/intake-schema';
import { isRateLimited } from '@/lib/rate-limit';
import { HONEYPOT_FIELD, toFieldErrors } from '@/lib/signup-schema';

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

  // 2. Rate limit, counted separately from signups.
  if (isRateLimited(`intake:${clientIp(req)}`)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait a few minutes and try again.' },
      { status: 429 },
    );
  }

  // 3. Validate. Never trust client-side validation.
  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please fix the highlighted fields.', fieldErrors: toFieldErrors<IntakeField>(parsed.error) },
      { status: 400 },
    );
  }

  const input = parsed.data;

  let env: ReturnType<typeof getEnv>;
  let table: string;
  try {
    env = getEnv();
    table = getIntakeTable();
  } catch (err) {
    console.error('[intake] config error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Something went wrong. Please try again in a moment.' }, { status: 500 });
  }
  const emailConfig = { apiKey: env.SENDGRID_API_KEY, fromEmail: env.FROM_EMAIL, ownerEmail: env.OWNER_EMAIL };

  // 4. Write to Airtable (one attempt).
  let recordId: string;
  try {
    recordId = await createIntakeRecord({ token: env.AIRTABLE_TOKEN, baseId: env.AIRTABLE_BASE_ID, table }, input);
  } catch (err) {
    const error =
      err instanceof AirtableWriteError ? `${err.status ?? 'no response'} ${err.type}` : 'UNEXPECTED_ERROR';
    console.error(`[intake] Airtable write failed: ${error}`);

    // Alert the owner with the submission so the ID isn't lost.
    try {
      await sendIntakeAlert(emailConfig, input, { ok: false, error });
    } catch (emailErr) {
      console.error('[intake] owner failure alert failed:', emailErr instanceof Error ? emailErr.message : emailErr);
    }

    return NextResponse.json(
      { error: `Something went wrong. Please try again, or email us at ${env.OWNER_EMAIL}.` },
      { status: 500 },
    );
  }

  // 5. Owner alert. The record is saved, so a failure here is logged but not shown to the client.
  try {
    await sendIntakeAlert(emailConfig, input, { ok: true, recordId });
  } catch (err) {
    console.error('[intake] email failed:', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true });
}
