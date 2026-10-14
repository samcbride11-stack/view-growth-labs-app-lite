// Airtable "Signups" table: field IDs and the budget map.
// Field IDs (not names) are used so renaming a field in Airtable doesn't break the integration.
// Never write ID (fldagXOvvTLN0TdWJ, auto number) or Assignee (fldQmzuBpugjgkTKI, set manually).

export const SIGNUP_FIELDS = {
  name: 'fldyrfsJS1oOM2lX2', // Name: single line text
  email: 'fldPmdnS5UcGU1EF2', // Email: email
  videoUrl: 'fldEMa6HYnWHE6cC7', // YouTube Video Link: URL
  budget: 'fldoeOVLEvsInitm7', // Budget: currency (ad spend paid to Google, not the management fee)
  googleAdsId: 'fldgoRsNzrvHTk2Em', // Google Ads ID: single line text, digits only
  notes: 'fldQgCWMG7OYAwB1d', // Notes: long text
  signupDate: 'fld4HyKRwIiB8Ksj3', // Signup Date: date, YYYY-MM-DD (UTC)
} as const;

// Form tier -> value sent to Budget. `value` is the submitted form value.
export const BUDGET_TIERS = [
  { value: '100', label: '$100', amount: 100 },
  { value: '250', label: '$250', amount: 250 },
  { value: '500', label: '$500', amount: 500 },
  { value: '1000', label: '$1,000+', amount: 1000 },
] as const;

export type BudgetTierValue = (typeof BUDGET_TIERS)[number]['value'];

export const BUDGET_TIER_VALUES = BUDGET_TIERS.map((t) => t.value) as [BudgetTierValue, ...BudgetTierValue[]];

export function getBudgetTier(value: BudgetTierValue) {
  return BUDGET_TIERS.find((t) => t.value === value)!;
}

// Airtable "Intake Info" table (AIRTABLE_TABLE_INTAKE): extra details from signed clients.
// Never write ID (fldai6CeQZWvg9Dby, auto number). Signup (fld56zDrsgaDuljgD, link to Signups)
// is left for the owner to set, since linking by email would need a token with read access.
export const INTAKE_FIELDS = {
  email: 'fldfP9UCPfwXBsuVR', // Email: email
  googleAdsId: 'fldkfiDSIQza9z8un', // Google Ads ID: number
} as const;
