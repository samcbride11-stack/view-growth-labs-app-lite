# View Growth Labs: Minimal Marketing Site Build Brief

## Goal

Build a small, fast, static marketing site for viewgrowthlabs.com. The only logic is: visitor submits a signup form, a row is created in Airtable, the visitor gets a confirmation email, and the owner gets an alert email. Everything else (campaign setup, billing, reporting) is handled manually by the owner for now.

This is a NEW project. Do not import or depend on the existing full app (kept separately for a future rebuild).

## Hard constraints

- No database, no auth, no user accounts, no admin or client portal, no dashboard.
- No Stripe code. Payment is a Stripe Payment Link the owner sends by email.
- Free-tier hosting (Vercel or Netlify). Stack: Next.js (App Router) + TypeScript + Tailwind, or Astro. Pick one and keep dependencies minimal.
- Every page is static. The only server code is one form-submission endpoint.
- Do not add features not listed here. If something seems needed, list it under "Questions" instead of building it.

## Offer (what the site must say, and nothing more)

- Paid YouTube views, run through Google Ads (YouTube's official ad platform).
- A campaign manager builds and optimizes the campaign for low cost per view.
- Client links their Google Ads account to our manager account (MCC). Google bills the client directly for ad spend. We bill a separate management fee.
- Results are visible in the client's own Google Ads account, plus an email report at campaign end.
- Do NOT promise: a live dashboard, guaranteed view counts, subscribers, rankings, or organic growth.

## Pages

1. **Home (single page, anchored sections):**
    - Hero: headline + subhead + CTA button scrolling to the form
    - How it works (3 steps: submit video, we build and run the campaign, you get results)
    - Pricing
    - FAQ
    - Signup form
2. **Thank-you page** shown after submit (what happens next: check email, payment link, Google Ads account linking)
3. **Privacy policy and Terms** (simple placeholder pages, flagged for owner review)

## Copy (use as the starting point; the owner will refine)

### **Headline:** Affordable YouTube views, run through Google Ads

**Subhead:** We promote your video using YouTube's official ad platform. A campaign manager builds and optimizes it for low cost per view, and you see results in your own Google Ads account. Campaigns start at $100 in ad spend.

### **Built for efficient reach**

We target lower-cost regions to maximize views per ad dollar. Well suited to launching a new video, adding visible traction to a campaign, or building early momentum.

### **How it works**

From signup to a live campaign in three steps.

**1. Submit your video**

Complete the signup form with your YouTube video link and your ad budget [($100 minimum)].

**2. We build your campaign**

Link your Google Ads account and approve our manager access. We build the campaign inside your account, so you can review everything we do. You keep full ownership and can remove our access at any time.

**3. Track your results**

Your campaign runs on YouTube’s official ad platform. We optimize for cost per view, and you can monitor views, view rate, and watch time in your own Google Ads account. A summary report is emailed when the campaign ends.

**Pricing**

Google bills your ad spend directly to your card, so you pay only for what is spent. Our management fee is [flat fee / percentage TBD], billed separately and collected before launch. No hidden costs.

**Who it’s for**

*Creators*

Give a new video early momentum so it doesn’t launch to an empty view count.

*Brands and businesses*

Add visible traction to ads, product videos, and explainers.

*Musicians and filmmakers*

Put a music video, trailer, or short film in front of a wider audience.

Campaigns target lower-cost regions by default. If you need a specific country, include it in the notes field of the signup form and we’ll confirm availability and pricing.

**Why View Growth Labs**

*You own the account*

Campaigns run in your own Google Ads account. You pay Google directly, see everything we do, and can revoke access at any time.

*Transparent pricing*

Ad spend goes to Google. Our management fee is separate, stated upfront, and has no hidden charges.

*Built for efficiency*

We optimize for low cost per view and monitor view rate and watch time throughout the campaign.

**Pricing (DECISION PENDING; use placeholders in a single config file so they are easy to change):**

- Minimum ad spend: $100 (paid to Google directly)
- Management fee: flat fee TBD, in the range of $25-50, or the greater of 20% of spend or a floor. Collected upfront before launch.

**FAQ topics:** What are paid views? Who pays for ads (Google bills you directly)? How long does a campaign run? How do I see results? How do I pay the management fee? Can I stop anytime? Is this against YouTube's rules? (Explain it's YouTube's official ad system.)

Design direction: clean, modern, trustworthy. Mobile-first. Avoid generic template look. Strong typography, generous spacing, one accent color.

## Signup form fields

- Name (required)
- Email (required, validated)
- YouTube video URL (required, validated as a youtube.com / youtu.be link)
- Budget tier (required): $100 / $250 / $500 / $1,000+
- Google Ads Customer ID (optional; helper text: "You can add this later")
- Anything else we should know (optional)

Include a honeypot field and basic server-side rate limiting for spam.

## Integrations

**Airtable** (one base, one table "Signups"). Fields: Name, Email, Video URL, Budget Tier, Google Ads ID, Notes, Status (single select: New, Contacted, Paid, Running, Done), Submitted At. Use the Airtable REST API from the server endpoint with a personal access token in env vars.

**Postmark** (existing account):

- Confirmation email to the visitor: thanks, what happens next, reply-to is the owner's address.
- Alert email to the owner with the submission details.

**Env vars:** AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE, POSTMARK_TOKEN, FROM_EMAIL, OWNER_EMAIL. Provide a `.env.example`.

## Acceptance checks

1. `next build` (or equivalent) passes cleanly with zero errors.
2. A test submission creates one Airtable row with all fields correctly filled.
3. The visitor confirmation and the owner alert both arrive within a minute.
4. Invalid input (bad email, non-YouTube URL, empty required fields) shows clear inline errors and creates no row.
5. Honeypot submissions are silently dropped.
6. Lighthouse mobile score of 90+ for performance and accessibility.
7. No page claims a dashboard, guaranteed results, or anything not in the Offer section.
8. Pricing values live in one config file.
9. Deployed to a preview URL; production domain is NOT switched until the owner approves.

## Out of scope (do not build)

Auth, roles, portal, admin, reporting, billing, Stripe webhooks, scheduling or call booking, business-hours routing, analytics beyond basic privacy-friendly page analytics.

## Suggested session order

1. Scaffold, config, and design system (typography, colors, layout)
2. Home page sections and copy
3. Form, validation, and server endpoint with Airtable write
4. Postmark emails and thank-you page
5. Policy pages, QA against the acceptance checks, preview deploy

## Other notes

- Final management fee structure
- Target audience wording (creators vs small businesses)
    - Creators first off with
- Logo and brand colors, if any
    - #2D3955, #B6BAC2, #208ADE, #FAFBFC, #359BEA
- Contact and reply-to email address