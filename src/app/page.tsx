import { SignupForm } from '@/components/signup-form';
import { formatUsd, pricing } from '@/config/site';

const minSpend = formatUsd(pricing.minAdSpend);

const steps = [
  {
    title: 'Submit your video',
    body: `Complete the signup form with your YouTube video link and an estimated ad budget (${minSpend} minimum). We confirm the exact amount with you before launch.`,
  },
  {
    title: 'We build your campaign',
    body: 'Link your Google Ads account and approve our manager access. We build the campaign inside your account, so you can review everything we do. You keep full ownership and can remove our access at any time.',
  },
  {
    title: 'Track your results',
    body: "Your campaign runs on YouTube's official ad platform. We optimize for cost per public view, and you can monitor spend and views, including views added to your public count, in your own Google Ads account. A summary report is emailed when the campaign ends.",
  },
];

const approach = [
  {
    title: 'Formats where every play counts',
    body: 'We run your video as in-stream and Shorts ads, where an ad play adds to its public view count. We skip formats that charge for a thumbnail being seen.',
  },
  {
    title: 'Budget follows results',
    body: 'We start with a broad mix of lower-cost regions, then shift spend toward the ones delivering the cheapest views.',
  },
  {
    title: 'Decisions based on data',
    body: 'Every campaign we run adds to our cost benchmarks, so our recommendations come from real results, not guesses.',
  },
];

const timeline = [
  { when: 'Before launch', what: "Video checked against Google's ad requirements" },
  { when: 'Launch', what: 'Budget paced over 5–14 days, depending on its size' },
  { when: '48 hours', what: 'First performance check and bid adjustment' },
  { when: 'Day 3', what: 'Costly regions paused on budgets of $500+' },
  { when: 'After the end', what: "Final report once YouTube's numbers settle (about 72 hours)" },
];

const audiences = [
  { title: 'Creators', body: "Give a new video early momentum so it doesn't launch to an empty view count." },
  { title: 'Brands and businesses', body: 'Add visible traction to ads, product videos, and explainers.' },
  { title: 'Musicians and filmmakers', body: 'Put a music video, trailer, or short film in front of a wider audience.' },
];

const reasons = [
  {
    title: 'You own the account',
    body: 'Campaigns run in your own Google Ads account. You pay Google directly, see everything we do, and can revoke access at any time.',
  },
  {
    title: 'Transparent pricing',
    body: 'Ad spend goes to Google. Our management fee is separate, stated upfront, and has no hidden charges.',
  },
  {
    title: 'Policy-safe by design',
    body: "Every view comes through Google Ads. No bots, view panels or incentivized views, the shortcuts that put channels at risk under YouTube's fake engagement policy.",
  },
];

const faqs = [
  {
    q: 'What are paid views?',
    a: 'Paid views come from people who watch your video after seeing it as an ad on YouTube. We run these ads through Google Ads, YouTube\'s official ad platform. They\'re real people on YouTube. Nothing is automated or simulated.',
  },
  {
    q: 'Who pays for the ads?',
    a: `You do, directly to Google. Ad spend is billed by Google to the card on your own Google Ads account, so you only pay for what is actually spent. Campaigns start at ${minSpend} in ad spend. Our management fee is billed separately.`,
  },
  {
    q: 'How long does a campaign run?',
    a: 'It depends on your budget: about 5 to 7 days for $250–499, 7 to 10 days for $500–999, and 10 to 14 days for $1,000 or more. We agree the exact dates with you before launch.',
  },
  {
    q: 'How do I see results?',
    a: 'Everything is visible in your own Google Ads account, including spend, views, and views added to your public count. We also email you a summary report when the campaign ends.',
  },
  {
    q: "Will the ad views show on my video's view count?",
    a: "On the formats we use, YouTube adds an ad play to your video's public count when it starts playing. YouTube runs its own checks, so the number under the video can lag or adjust; Google Ads reporting is what you're billed on.",
  },
  {
    q: 'How do I pay the management fee?',
    a: 'After you sign up, we email you a secure payment link. The management fee is collected before your campaign launches.',
  },
  {
    q: 'Can I stop anytime?',
    a: 'Yes. You can pause the campaign in your Google Ads account or remove our manager access at any time. Google bills only for ad spend already used.',
  },
  {
    q: "Is this against YouTube's rules?",
    a: "No. Google Ads is YouTube's own advertising system, and promoting videos with it is how YouTube expects advertisers to do it. Your video does need to meet Google's advertising policies, and we'll let you know if anything needs attention.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-accent-soft blur-3xl"
        />
        <div className="container-page relative grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">YOUTUBE ADS, MANAGED FOR YOU</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              {/* Affordable YouTube views, run through <span className="text-accent-strong">Google&nbsp;Ads</span> */}
              More views for your video, powered by <span className="text-accent-strong">real YouTube&nbsp;Ads</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              We promote your video through Google Ads, YouTube&apos;s official ad platform. Each campaign is built and monitored by hand for a low cost per view, 
              and you see every result in your own Google Ads account. Campaigns start at {minSpend} in ad spend.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#signup" className="btn-primary">
                Get started
                <span aria-hidden="true">→</span>
              </a>
              <a href="#how-it-works" className="text-base font-semibold text-ink underline-offset-4 hover:underline">
                See how it works
              </a>
            </div>
          </div>

          <div className="card p-7 shadow-[0_24px_60px_-30px_rgba(45,57,85,0.35)] sm:p-8">
            <p className="eyebrow">BUILT FOR EFFICIENT REACH </p>
            <p className="mt-3 text-base leading-relaxed text-muted">
              We target lower-cost regions to get the most views per ad dollar. 
              It’s a simple way to boost the public view count on a new or existing video.
              {' '}<i>Want viewers in your own market? Ask about a targeted campaign.</i>
            </p>
            <dl className="mt-6 divide-y divide-line/50 border-t border-line/50">
              {[
                ['Ad platform', "Google Ads (YouTube's own)"],
                ['Ad spend', `From ${minSpend}, billed by Google`],
                ['Our fee', '20% of first $1,000 of ad spend, 15% of next $1,000, then 10%'],
                ['Account', 'Yours, with full visibility'],
              ].map(([term, detail]) => (
                <div key={term} className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="text-sm text-muted">{term}</dt>
                  <dd className="text-right text-sm font-semibold text-ink">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-line/40 bg-white py-20 sm:py-24">
        <div className="container-page">
          <p className="eyebrow">How it works</p>
          <h2 className="h2 mt-3 max-w-2xl">From signup to a live campaign in three steps.</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="font-display text-5xl font-extrabold text-accent-light/40" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Our approach */}
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <p className="eyebrow">Our approach</p>
          <h2 className="h2 mt-3 max-w-2xl">Built around the number under your video.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Google Ads reports several kinds of views. We build every campaign around the one most people care about:
            views added to your video&apos;s public count.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {approach.map((item) => (
              <div key={item.title} className="card p-7">
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-14 font-display text-lg font-bold">Your campaign, start to finish</h3>
          <ol className="mt-6 grid gap-6 border-l-2 border-accent-soft pl-6 md:grid-cols-5 md:gap-4 md:border-l-0 md:border-t-2 md:pl-0 md:pt-6">
            {timeline.map((step) => (
              <li key={step.when} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-strong md:-top-[30px] md:left-0"
                />
                <p className="text-sm font-semibold text-accent-strong">{step.when}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.what}</p>
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
            YouTube verifies public views on its own schedule, so the count under your video can lag or adjust. Google
            Ads figures are what you&apos;re billed on.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-t border-line/40 py-20 sm:py-24">
        <div className="container-page">
          <p className="eyebrow">Who it&apos;s for</p>
          <h2 className="h2 mt-3 max-w-2xl">For anyone with a video worth seeing.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {audiences.map((item) => (
              <div key={item.title} className="card p-7">
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
            Campaigns target lower-cost regions by default. If you need a specific country, include it in the notes field
            of the signup form and we&apos;ll confirm availability and pricing.
          </p>
        </div>
      </section>

      {/* Why View Growth Labs */}
      <section className="bg-ink py-20 text-white sm:py-24">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-light">Why View Growth Labs</p>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {reasons.map((item) => (
              <div key={item.title} className="border-t border-white/20 pt-6">
                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-white/80">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2 className="h2 mt-3">Two separate costs. No hidden ones.</h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Google bills your ad spend directly to your card, so you pay only for what is spent. Our management fee is{' '}
              {pricing.managementFee.inline}, billed separately and collected before launch. No hidden costs.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="card p-7">
              <p className="text-sm font-semibold text-muted">Ad spend</p>
              <p className="mt-3 font-display text-4xl font-extrabold">{minSpend}+</p>
              <p className="mt-1 text-sm text-muted">minimum</p>
              <ul className="mt-6 space-y-2 border-t border-line/50 pt-5 text-sm leading-relaxed text-muted">
                <li>Paid to Google directly</li>
                <li>Billed to the card on your Google Ads account</li>
                <li>You pay only for what is spent</li>
              </ul>
            </div>
            <div className="card border-accent-strong/50 p-7 ring-1 ring-accent-strong/20">
              <p className="text-sm font-semibold text-accent-strong">Management fee</p>
              <p className="mt-3 font-display text-4xl font-extrabold">{pricing.managementFee.headline}</p>
              <p className="mt-1 text-sm text-muted">{pricing.managementFee.summary}</p>
              <ul className="mt-6 space-y-2 border-t border-line/50 pt-5 text-sm leading-relaxed text-muted">
                <li>Paid to View Growth Labs</li>
                <li>Stated upfront, collected before launch</li>
                <li>Campaign setup, optimization, and end-of-campaign report</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-y border-line/40 bg-white py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="h2 mt-3">Common questions</h2>
          </div>
          <div className="divide-y divide-line/50 border-y border-line/50">
            {faqs.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Signup */}
      <section id="signup" className="py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">Get started</p>
            <h2 className="h2 mt-3">Start your YouTube campaign</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Tell us about your video and roughly what you’d like to spend. Nothing is charged yet.
               We’ll reply by email within one business day with a payment link for the management fee and steps for linking your Google Ads account.
            </p>
          </div>
          <div className="card p-6 sm:p-10">
            <SignupForm />
          </div>
        </div>
      </section>
    </>
  );
}
