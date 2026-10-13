import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Privacy policy' };

// OWNER REVIEW: placeholder text. Have this reviewed before launch.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="October 2026">
      <p>
        This policy explains what information {site.name} collects through this website and how we use it.
      </p>

      <h2>What we collect</h2>
      <p>When you submit the signup form, we collect:</p>
      <ul>
        <li>Your name and email address</li>
        <li>Your YouTube video link and estimated budget</li>
        <li>Your Google Ads Customer ID, if you provide it</li>
        <li>Anything you write in the notes field</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        We use this information to contact you about your campaign, send you a payment link, request manager access to
        your Google Ads account, run your campaign, and send you a summary report. We do not sell your information.
      </p>

      <h2>Service providers</h2>
      <p>We use the following providers to operate this site and our service:</p>
      <ul>
        <li>Airtable, to store signup submissions</li>
        <li>SendGrid, to send emails</li>
        <li>Stripe, to process management fee payments</li>
        <li>Google Ads, to run your campaign in your own account</li>
        <li>Our website hosting provider</li>
      </ul>

      <h2>Retention</h2>
      <p>We keep signup information for as long as needed to provide the service and meet our legal obligations.</p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct, or delete your information at any time by emailing{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
