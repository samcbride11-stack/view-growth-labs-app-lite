const REQUIRED = [
  'AIRTABLE_TOKEN',
  'AIRTABLE_BASE_ID',
  'AIRTABLE_TABLE',
  'SENDGRID_API_KEY',
  'FROM_EMAIL',
  'OWNER_EMAIL',
] as const;

type EnvKey = (typeof REQUIRED)[number];

// Read at request time so a missing variable fails the request loudly, not the build.
export function getEnv(): Record<EnvKey, string> {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  return Object.fromEntries(REQUIRED.map((key) => [key, process.env[key] as string])) as Record<EnvKey, string>;
}

// Only the intake form needs this, so it's checked separately: a missing value
// must not break signups.
export function getIntakeTable(): string {
  const table = process.env.AIRTABLE_TABLE_INTAKE;
  if (!table) throw new Error('Missing environment variables: AIRTABLE_TABLE_INTAKE');
  return table;
}
