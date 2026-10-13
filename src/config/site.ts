// Single source of truth for pricing and site details.
// Values marked PLACEHOLDER are pending owner decisions; change them here only.

export const site = {
  name: 'View Growth Labs',
  url: 'https://viewgrowthlabs.com',
  // PLACEHOLDER: public contact address shown in the footer and policy pages.
  contactEmail: 'support@viewgrowthlabs.com',
  // Logo shown in the header. Put the file in `public/brand/` and set `src` to match
  // (e.g. '/brand/logo.png'). Until the file exists, a built-in placeholder mark is shown.
  logo: {
    src: '/brand/logo.png',
    // Intrinsic aspect ratio of the file (3000x600 = 5:1). Displayed 40px tall on mobile, 48px on larger screens.
    width: 240,
    height: 48,
    // Set to false if the logo file already contains the "View Growth Labs" name.
    showName: false,
  },
} as const;

export const pricing = {
  // Minimum ad spend, paid to Google directly.
  // The signup form only offers budget tiers at or above this amount.
  minAdSpend: 250,

  // Budget tiers offered in the signup form live in `src/lib/airtable-fields.ts`.

  // PLACEHOLDER: management fee. Pending decision between a flat fee ($25-50)
  // or the greater of a percentage of spend and a floor.
  managementFee: {
    // Large figure shown on the pricing card.
    headline: '$TBD',
    // Short line under the figure.
    summary: 'Flat management fee per campaign',
    // Sentence used in body copy, e.g. "Our management fee is ___, billed separately".
    inline: 'a flat fee per campaign',
  },
} as const;

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}
