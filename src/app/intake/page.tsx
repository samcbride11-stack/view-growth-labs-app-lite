import type { Metadata } from 'next';
import { IntakeForm } from '@/components/intake-form';

// For signed clients, reached from a link we send them, so it's kept out of search results.
export const metadata: Metadata = {
  title: 'Submit your Google Ads ID',
  robots: { index: false },
};

export default function IntakePage() {
  return (
    <section className="py-14 sm:py-20">
      <div className="container-page max-w-2xl">
        <p className="eyebrow">Clients</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight">
          Submit your Google Ads ID
        </h1>
        <p className="mt-5 leading-relaxed text-muted">
          We need your Google Ads Customer ID to request manager access, so we can build your campaign inside your
          account. Don&apos;t have a Google Ads account yet? Create one at ads.google.com first.
        </p>
        <div className="card mt-10 p-6 sm:p-10">
          <IntakeForm />
        </div>
      </div>
    </section>
  );
}
