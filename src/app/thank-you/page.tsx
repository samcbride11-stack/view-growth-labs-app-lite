import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Thanks for signing up',
  robots: { index: false },
};

const nextSteps = [
  {
    title: 'We review your video and budget.',
    body: 'We check that your video can run as an ad, then email you a recommended budget, campaign length, and what to realistically expect. A confirmation of your signup is already on its way. If you don’t see it, check spam or promotions.',
  },
  {
    title: 'You pay the management fee.',
    body: 'Once you’re happy with the plan, we send a Stripe payment link for our fee. Your ad spend isn’t included. Google bills that directly to your own card.',
  },
  {
    title: 'You link your Google Ads account.',
    body: 'We send a manager access request. Approve it in Google Ads under Admin → Access and security → Managers. No account yet? Create one at ads.google.com, skip creating a campaign, add your billing details, and reply with your 10-digit Customer ID.',
  },
];

export default function ThankYouPage() {
  return (
    <section className="py-16 sm:py-24">
      {/* Event snippet for VGL-signup conversion page */}
      <Script id="vgl-signup-conversion" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('event', 'conversion', {'send_to': 'AW-18513992719/2XIsCOnfhKMdEI-4lPxE'});
          gtag('event', 'sign_up', {'send_to': 'G-EV37XPVECY', 'method': 'signup_form'});
        `}
      </Script>
      <div className="container-page max-w-3xl">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent-strong" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12.5 10 17.5 19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Got it. We&rsquo;re reviewing your video.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          You&rsquo;ll hear from us by email within 1 business day. Here&rsquo;s how it goes from there.
        </p>

        <div role="note" className="mt-8 rounded-xl border border-accent-strong/30 bg-accent-soft p-5 leading-relaxed sm:p-6">
          <p>
            <strong className="font-bold">Don&rsquo;t see our email?</strong> Check your spam, junk, or promotions folder
            for a message from{' '}
            <a href="mailto:support@viewgrowthlabs.com" className="font-semibold text-accent-strong underline underline-offset-4">
              support@viewgrowthlabs.com
            </a>
            . If it&rsquo;s there, mark it &ldquo;Not spam&rdquo; so our campaign updates reach your inbox.
          </p>
        </div>

        <ol className="mt-12 space-y-5">
          {nextSteps.map((step, i) => (
            <li key={step.title} className="card flex gap-5 p-6 sm:p-7">
              <span className="font-display text-2xl font-extrabold text-accent-strong" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h2 className="font-display text-lg font-bold">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div role="note" className="mt-5 rounded-xl border border-accent-strong/30 bg-accent-soft p-5 leading-relaxed sm:p-6">
          <p>
            <strong className="font-bold">New to Google Ads?</strong> Create a free account at{' '}
            <a
              href="https://ads.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent-strong underline underline-offset-4"
            >
              ads.google.com
            </a>
            . It stays in your name, and Google bills ad spend directly to you. Don&rsquo;t create a campaign; we build it.
            Google may place a small hold or ask for a prepayment when you add your card, which is normal.
          </p>
          <Link
            href="/support/ads-account-setup-guide"
            className="mt-3 inline-block font-semibold text-accent-strong underline-offset-4 hover:underline"
          >
            Setup guide &rarr;
          </Link>
        </div>

        <p className="mt-8 text-lg leading-relaxed">
          <span className="font-display font-bold">Then we launch.</span>{' '}
          <span className="text-muted">
            You&rsquo;ll get updates by email during the campaign and a final report about 3 days after it ends.
          </span>
        </p>

        <Link href="/" className="mt-10 inline-block font-semibold text-accent-strong underline-offset-4 hover:underline">
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
