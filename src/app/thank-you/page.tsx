import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thanks for signing up',
  robots: { index: false },
};

const nextSteps = [
  {
    title: 'Check your email',
    body: "We've sent a confirmation to the address you gave us. If you don't see it in a few minutes, check your spam or promotions folder. You can reply to it with any questions.",
  },
  {
    title: 'Pay the management fee',
    body: 'After we review your video and confirm your exact ad budget with you, we email you a secure payment link for the management fee. It is collected before your campaign launches.',
  },
  {
    title: 'Link your Google Ads account',
    body: "We send a manager access request to your Google Ads account. Approve it in Google Ads under Admin, then Access and security, then Managers. If you don't have a Google Ads account yet, create one at ads.google.com and send us your Customer ID. Ad spend is billed by Google to the card on that account.",
  },
];

export default function ThankYouPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page max-w-3xl">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent-strong" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12.5 10 17.5 19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Thanks, you&apos;re in.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          We&apos;ve received your signup. Here&apos;s what happens next.
        </p>

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

        <Link href="/" className="mt-10 inline-block font-semibold text-accent-strong underline-offset-4 hover:underline">
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
