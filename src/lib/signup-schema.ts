import { z } from 'zod';
import { BUDGET_TIER_VALUES } from '@/lib/airtable-fields';

// Shared by the signup form (client) and the API route (server).
// Output values are normalized and ready to write to Airtable.

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']);

// Returns the URL normalized to https, or null if it isn't a YouTube video link.
export function normalizeYouTubeUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol === 'http:') url.protocol = 'https:';
  if (url.protocol !== 'https:') return null;

  const host = url.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) return null;

  // Require a link to a specific video, not a channel or the homepage.
  const isVideo =
    host === 'youtu.be'
      ? url.pathname.length > 1
      : (url.pathname === '/watch' && Boolean(url.searchParams.get('v'))) ||
        /^\/(shorts|live|embed)\/[\w-]+/.test(url.pathname);
  return isVideo ? url.toString() : null;
}

const VIDEO_URL_ERROR = 'Please enter a YouTube video link (youtube.com or youtu.be)';

// Shared with the intake form.
export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Please enter your email')
  .max(254, 'Please enter a valid email address')
  .email('Please enter a valid email address');

export const GOOGLE_ADS_ID_ERROR = 'Customer IDs are 10 digits, like 123-456-7890';

// Strips the spaces and dashes people copy from Google Ads ("123-456-7890" -> "1234567890").
export function normalizeGoogleAdsId(value: string): string {
  return value.replace(/[\s-]/g, '');
}

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name').max(200, 'Please keep this under 200 characters'),
  email: emailField,
  videoUrl: z
    .string()
    .trim()
    .min(1, 'Please enter your YouTube video link')
    .transform((v, ctx) => {
      const normalized = normalizeYouTubeUrl(v);
      if (!normalized) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: VIDEO_URL_ERROR });
        return z.NEVER;
      }
      return normalized;
    }),
  budgetTier: z.enum(BUDGET_TIER_VALUES, {
    errorMap: () => ({ message: 'Please choose an estimated budget' }),
  }),
  // Optional: blank becomes undefined so it is omitted from the Airtable payload.
  googleAdsId: z
    .string()
    .optional()
    .transform((v) => (v ? normalizeGoogleAdsId(v) : '') || undefined)
    .refine((v) => v === undefined || /^\d{10}$/.test(v), GOOGLE_ADS_ID_ERROR),
  notes: z
    .string()
    .trim()
    .max(2000, 'Please keep this under 2,000 characters')
    .optional()
    .transform((v) => v || undefined),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SignupField = keyof SignupInput;
export type FieldErrors = Partial<Record<SignupField, string>>;

// Honeypot field name. Real visitors never see or fill it.
export const HONEYPOT_FIELD = 'website';

// Also used by the intake form, with its own field names as `K`.
export function toFieldErrors<K extends string = SignupField>(error: z.ZodError): Partial<Record<K, string>> {
  const errors: Partial<Record<K, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as K | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
