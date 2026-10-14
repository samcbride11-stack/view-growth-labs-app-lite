import { z } from 'zod';
import { GOOGLE_ADS_ID_ERROR, emailField, normalizeGoogleAdsId } from '@/lib/signup-schema';

// Shared by the intake form (client) and the API route (server).
export const intakeSchema = z.object({
  email: emailField,
  googleAdsId: z
    .string()
    .trim()
    .min(1, 'Please enter your Google Ads Customer ID')
    .transform(normalizeGoogleAdsId)
    .refine((v) => /^\d{10}$/.test(v), GOOGLE_ADS_ID_ERROR),
});

export type IntakeInput = z.infer<typeof intakeSchema>;
export type IntakeField = keyof IntakeInput;
export type IntakeFieldErrors = Partial<Record<IntakeField, string>>;
