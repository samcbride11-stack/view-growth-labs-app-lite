import type { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from '@/components/signup-form';
import { formatUsd, pricing } from '@/config/site';

export const metadata: Metadata = {
  title: 'Get started',
  description:
    "Submit your YouTube video for a Google Ads campaign. A campaign manager builds it in your own Google Ads account and optimizes for low cost per view.",
};

const points = [
  `Ad spend is billed by Google directly to you, from ${formatUsd(pricing.minAdSpend)}.`,
  'Your campaign runs in your own Google Ads account. You see everything we do.',
  'Our management fee is stated upfront and collected before launch.',
  'Only Google Ads traffic. No bots or view panels.',
];

// Standalone signup page for sharing a direct link. Same form as the homepage.
export default function SignupPage() {
  return (
    <section className="py-14 sm:py-20">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow">Get started</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Start your YouTube campaign
          </h1>
          <p className="mt-5 leading-relaxed text-muted">
             Tell us about your video and roughly what you’d like to spend. Nothing is charged yet. 
             We’ll reply by email within one business day with a payment link for the management fee and steps for linking your Google Ads account.


          </p>

          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path d="M5 12.5 10 17.5 19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-muted">
            Want the details first? See{' '}
            <Link href="/#how-it-works" className="font-semibold text-accent-strong underline-offset-4 hover:underline">
              how it works
            </Link>{' '}
            or the{' '}
            <Link href="/#faq" className="font-semibold text-accent-strong underline-offset-4 hover:underline">
              FAQ
            </Link>
            .
          </p>
        </div>
        <div className="card p-6 sm:p-10">
          <SignupForm />
        </div>
      </div>
    </section>
  );
}
