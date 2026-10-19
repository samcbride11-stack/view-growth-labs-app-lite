import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Terms of service' };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated="October 2026">
      <p>
        These terms apply to campaign management services provided by {site.name}. By submitting the signup form or
        paying a management fee, you agree to them.
      </p>

      <h2>The service</h2>
      <p>
        We set up and optimize YouTube video ad campaigns inside your own Google Ads account, using manager access you
        grant us. We email you a summary report when the campaign ends.
      </p>

      <h2>Fees and ad spend</h2>
      <ul>
        <li>Ad spend is billed by Google directly to the payment method on your Google Ads account.</li>
        <li>Our management fee is separate, stated before launch, and collected before the campaign starts.</li>
        <li>
          The management fee is a percentage of your agreed ad budget. If Google spends less than that budget, we refund
          the fee on the unspent amount or credit it toward your next campaign. Spend is measured using Google Ads
          reporting when the campaign ends.
        </li>
      </ul>

      <h2>No guaranteed results</h2>
      <p>
        We optimize for low cost per view, but we do not guarantee any number of views, subscribers, rankings, or other
        outcomes. Results depend on your video, budget, targeting, and Google&apos;s ad auction.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>You own or have the rights to promote the video you submit.</li>
        <li>Your video and account comply with Google Ads and YouTube policies.</li>
        <li>You keep a valid payment method on your Google Ads account.</li>
      </ul>

      <h2>Access and cancellation</h2>
      <p>
        You can pause your campaign or remove our manager access at any time from your Google Ads account. Ad spend
        already used is billed by Google. If you stop a campaign early, the management fee on the unspent budget is
        refunded or credited as described under Fees and ad spend.
      </p>

      <h2>Not affiliated with Google</h2>
      <p>{site.name} is an independent service and is not affiliated with or endorsed by Google or YouTube.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
