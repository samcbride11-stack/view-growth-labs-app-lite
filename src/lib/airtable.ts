// Server only: imported solely by API routes, so the token never reaches the browser.
import { INTAKE_FIELDS, SIGNUP_FIELDS, getBudgetTier } from '@/lib/airtable-fields';
import type { IntakeInput } from '@/lib/intake-schema';
import { describeTargeting, type SignupInput } from '@/lib/signup-schema';

interface AirtableConfig {
  token: string;
  baseId: string;
  table: string;
}

const TIMEOUT_MS = 10_000;

export class AirtableWriteError extends Error {
  constructor(
    // HTTP status, or null for network errors and timeouts.
    readonly status: number | null,
    // Airtable error type (e.g. INVALID_VALUE_FOR_COLUMN), or the local failure kind.
    readonly type: string,
  ) {
    super(`Airtable write failed: ${status ?? 'no response'} ${type}`);
    this.name = 'AirtableWriteError';
  }
}

function buildFields(input: SignupInput, signupDate: string): Record<string, string | number> {
  const fields: Record<string, string | number> = {
    [SIGNUP_FIELDS.name]: input.name,
    [SIGNUP_FIELDS.email]: input.email,
    [SIGNUP_FIELDS.videoUrl]: input.videoUrl,
    [SIGNUP_FIELDS.budget]: getBudgetTier(input.budgetTier).amount,
    [SIGNUP_FIELDS.signupDate]: signupDate,
  };
  // Blank optional fields are omitted, never sent as empty strings. Notes always carries the targeting choice.
  if (input.googleAdsId) fields[SIGNUP_FIELDS.googleAdsId] = input.googleAdsId;
  fields[SIGNUP_FIELDS.notes] = [`Targeting: ${describeTargeting(input)}`, input.notes].filter(Boolean).join('\n\n');
  return fields;
}

export function createSignupRecord(config: AirtableConfig, input: SignupInput, signupDate: string) {
  return createRecord(config, buildFields(input, signupDate));
}

export function createIntakeRecord(config: AirtableConfig, input: IntakeInput) {
  return createRecord(config, {
    [INTAKE_FIELDS.email]: input.email,
    // Number field; customer IDs are 10 digits, well within safe integer range.
    [INTAKE_FIELDS.googleAdsId]: Number(input.googleAdsId),
  });
}

// Creates exactly one record. One attempt, no retries, no typecast. Returns the new record ID.
async function createRecord(config: AirtableConfig, fields: Record<string, string | number>): Promise<string> {
  const url = `https://api.airtable.com/v0/${encodeURIComponent(config.baseId)}/${encodeURIComponent(config.table)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }] }),
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    throw new AirtableWriteError(null, timedOut ? 'TIMEOUT' : 'NETWORK_ERROR');
  }

  const body = (await res.json().catch(() => null)) as {
    records?: { id?: string }[];
    error?: string | { type?: string };
  } | null;

  if (!res.ok) {
    const type = typeof body?.error === 'string' ? body.error : (body?.error?.type ?? 'UNKNOWN');
    throw new AirtableWriteError(res.status, type);
  }

  const id = body?.records?.[0]?.id;
  if (!id) throw new AirtableWriteError(res.status, 'NO_RECORD_ID');
  return id;
}
