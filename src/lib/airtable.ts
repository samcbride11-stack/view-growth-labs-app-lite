// Server only: imported solely by the signup API route, so the token never reaches the browser.
import { SIGNUP_FIELDS, getBudgetTier } from '@/lib/airtable-fields';
import type { SignupInput } from '@/lib/signup-schema';

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
  // Blank optional fields are omitted, never sent as empty strings.
  if (input.googleAdsId) fields[SIGNUP_FIELDS.googleAdsId] = input.googleAdsId;
  if (input.notes) fields[SIGNUP_FIELDS.notes] = input.notes;
  return fields;
}

// Creates exactly one record. One attempt, no retries, no typecast. Returns the new record ID.
export async function createSignupRecord(
  config: AirtableConfig,
  input: SignupInput,
  signupDate: string,
): Promise<string> {
  const url = `https://api.airtable.com/v0/${encodeURIComponent(config.baseId)}/${encodeURIComponent(config.table)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields: buildFields(input, signupDate) }] }),
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
