# View Growth Labs (lite)

Static marketing site for viewgrowthlabs.com. One server endpoint (`/api/signup`) writes the signup to Airtable and sends two emails via SendGrid.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Where things live

| What | File |
| --- | --- |
| Pricing, budget tiers, contact email | `src/config/site.ts` |
| Home page copy and FAQ | `src/app/page.tsx` |
| Thank-you page | `src/app/thank-you/page.tsx` |
| Privacy / Terms (placeholders, need review) | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` |
| Airtable field IDs and budget map | `src/lib/airtable-fields.ts` |
| Form validation (client and server) | `src/lib/signup-schema.ts` |
| Signup endpoint | `src/app/api/signup/route.ts` |
| Email content | `src/lib/email.ts` |

## Airtable setup

The endpoint writes to the `Signups` table by **field ID**, so fields can be renamed in Airtable freely. Field IDs and the budget tier map are in `src/lib/airtable-fields.ts`. If a field is deleted and recreated, update its ID there.

Written on each signup: Name, Email, YouTube Video Link, Budget (number), Google Ads ID and Notes (omitted when blank), Signup Date (UTC, set by the server). ID and Assignee are never written.

Create a personal access token with only the `data.records:write` scope, restricted to this one base.

If the Airtable write fails, the visitor sees an error, no confirmation email is sent, and the owner gets an "AIRTABLE WRITE FAILED" email with the full submission.

## SendGrid setup

API key with Mail Send permission. `FROM_EMAIL` must be a verified single sender, or on a domain authenticated in SendGrid (recommended for deliverability).

## Deploy (Vercel)

Import the folder as a project, add the env vars from `.env.example`, and deploy. Use the preview URL for review; do not attach viewgrowthlabs.com until approved.

## Notes

- Spam: honeypot field plus an in-memory rate limit (5 submissions per IP per 10 minutes). The limit is per server instance, so it's best-effort on serverless.
