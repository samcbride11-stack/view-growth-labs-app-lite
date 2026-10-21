import { site } from '@/config/site';
import { getBudgetTier } from '@/lib/airtable-fields';
import type { IntakeInput } from '@/lib/intake-schema';
import { describeTargeting, type SignupInput } from '@/lib/signup-schema';

interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  ownerEmail: string;
}

interface Message {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

async function send(config: EmailConfig, message: Message) {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: message.to }] }],
      from: { email: config.fromEmail, name: `${site.name} Support` },
      ...(message.replyTo ? { reply_to: { email: message.replyTo } } : {}),
      subject: message.subject,
      content: [
        { type: 'text/plain', value: message.text },
        { type: 'text/html', value: message.html },
      ],
      // Transactional mail: don't rewrite links or add tracking pixels.
      tracking_settings: {
        click_tracking: { enable: false, enable_text: false },
        open_tracking: { enable: false },
      },
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SendGrid send failed (${res.status}): ${body}`);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(body: string): string {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#FAFBFC;font-family:Arial,Helvetica,sans-serif;color:#2D3955;line-height:1.55;font-size:15px">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #E3E5E9;border-radius:12px;padding:28px">
${body}
</div></body></html>`;
}

export function sendVisitorConfirmation(config: EmailConfig, input: SignupInput) {
  const firstName = input.name.split(/\s+/)[0] || input.name;
  const budget = getBudgetTier(input.budgetTier).label;

  const steps = [
    'We review your video and confirm your exact ad budget with you.',
    'We email you a secure payment link for the management fee. It is collected before launch.',
    'We send a manager access request to your Google Ads account. Approve it, and we build your campaign inside your account.',
  ];

  const text = [
    `Hi ${firstName},`,
    '',
    `Thanks for signing up with ${site.name}. We've received your request for:`,
    input.videoUrl,
    `Estimated budget: ${budget}`,
    '',
    'What happens next:',
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    `Questions? Just reply to this email.`,
    '',
    site.name,
  ].join('\n');

  const html = layout(`
<p style="margin:0 0 16px">Hi ${escapeHtml(firstName)},</p>
<p style="margin:0 0 16px">Thanks for signing up with ${site.name}. We've received your request for:</p>
<p style="margin:0 0 4px"><a href="${escapeHtml(input.videoUrl)}" style="color:#176DB3">${escapeHtml(input.videoUrl)}</a></p>
<p style="margin:0 0 20px">Estimated budget: <strong>${escapeHtml(budget)}</strong></p>
<p style="margin:0 0 8px;font-weight:bold">What happens next</p>
<ol style="margin:0 0 20px;padding-left:20px">${steps.map((s) => `<li style="margin-bottom:6px">${s}</li>`).join('')}</ol>
<p style="margin:0 0 16px">Questions? Just reply to this email.</p>
<p style="margin:0">${site.name}</p>`);

  return send(config, {
    to: input.email,
    replyTo: config.ownerEmail,
    subject: `We've received your signup: ${site.name}`,
    text,
    html,
  });
}

// Sent on every real signup. If the Airtable write failed, the alert is marked so the lead isn't lost.
export function sendOwnerAlert(
  config: EmailConfig,
  input: SignupInput,
  signupDate: string,
  airtable: { ok: true; recordId: string } | { ok: false; error: string },
) {
  const budget = getBudgetTier(input.budgetTier);
  const rows: [string, string][] = [
    ['Name', input.name],
    ['Email', input.email],
    ['YouTube Video Link', input.videoUrl],
    // "$1,000+" is stored in Airtable as 1000; the label shows what the visitor actually picked.
    ['Budget (estimate)', `${budget.label} (stored as ${budget.amount})`],
    ['Google Ads ID', input.googleAdsId ?? '(not provided)'],
    ['Targeting', describeTargeting(input)],
    ['Notes', input.notes ?? '(none)'],
    ['Signup Date', signupDate],
    airtable.ok ? ['Airtable record', airtable.recordId] : ['Airtable error', airtable.error],
  ];

  const heading = airtable.ok ? 'New signup' : 'AIRTABLE WRITE FAILED: add this signup manually';
  const text = [heading, '', ...rows.map(([k, v]) => `${k}: ${v}`)].join('\n');

  const html = layout(`
<p style="margin:0 0 16px;font-size:18px;font-weight:bold;color:${airtable.ok ? '#2D3955' : '#B42318'}">${heading}</p>
<table style="border-collapse:collapse;width:100%">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#5A6478;white-space:nowrap">${k}</td><td style="padding:6px 0;white-space:pre-wrap;word-break:break-word">${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table>`);

  return send(config, {
    to: config.ownerEmail,
    replyTo: input.email,
    subject: airtable.ok
      ? `New signup: ${input.name} (${budget.label})`
      : `AIRTABLE WRITE FAILED: ${input.name} (${budget.label})`,
    text,
    html,
  });
}

// Sent on every real intake submission. If the Airtable write failed, the alert is marked so the ID isn't lost.
export function sendIntakeAlert(
  config: EmailConfig,
  input: IntakeInput,
  airtable: { ok: true; recordId: string } | { ok: false; error: string },
) {
  const formattedId = input.googleAdsId.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
  const rows: [string, string][] = [
    ['Email', input.email],
    ['Google Ads ID', formattedId],
    airtable.ok ? ['Airtable record', airtable.recordId] : ['Airtable error', airtable.error],
  ];

  const heading = airtable.ok
    ? 'New Google Ads ID submitted'
    : 'AIRTABLE WRITE FAILED: add this Google Ads ID manually';
  const text = [heading, '', ...rows.map(([k, v]) => `${k}: ${v}`)].join('\n');

  const html = layout(`
<p style="margin:0 0 16px;font-size:18px;font-weight:bold;color:${airtable.ok ? '#2D3955' : '#B42318'}">${heading}</p>
<table style="border-collapse:collapse;width:100%">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#5A6478;white-space:nowrap">${k}</td><td style="padding:6px 0;white-space:pre-wrap;word-break:break-word">${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table>`);

  return send(config, {
    to: config.ownerEmail,
    replyTo: input.email,
    subject: airtable.ok
      ? `Google Ads ID submitted: ${input.email}`
      : `AIRTABLE WRITE FAILED: Google Ads ID from ${input.email}`,
    text,
    html,
  });
}
