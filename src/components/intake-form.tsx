'use client';

import { useState, type FormEvent } from 'react';
import { intakeSchema, type IntakeField, type IntakeFieldErrors } from '@/lib/intake-schema';
import { HONEYPOT_FIELD, toFieldErrors } from '@/lib/signup-schema';

const inputClass =
  'mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent-strong/40';

export function IntakeForm() {
  const [errors, setErrors] = useState<IntakeFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function describedBy(id: IntakeField, hasHint = false) {
    const ids = [hasHint ? `${id}-hint` : null, errors[id] ? `${id}-error` : null].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
  }

  function fieldClass(id: IntakeField) {
    return `${inputClass} ${errors[id] ? 'border-red-600' : 'border-line'}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = intakeSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors<IntakeField>(parsed.error);
      setErrors(fieldErrors);
      const first = Object.keys(fieldErrors)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] ?? '' }),
      });
      if (res.ok) {
        setDone(true);
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string; fieldErrors?: IntakeFieldErrors };
      if (body.fieldErrors) setErrors(body.fieldErrors);
      setFormError(body.error ?? 'Something went wrong. Please try again.');
    } catch {
      setFormError('Could not reach the server. Check your connection and try again.');
    }
    setSubmitting(false);
  }

  if (done) {
    return (
      <div role="status">
        <h2 className="font-display text-2xl font-bold">Thanks, we&apos;ve got it.</h2>
        <p className="mt-3 leading-relaxed text-muted">
          We&apos;ll send a manager access request to your Google Ads account shortly. Approve it in Google Ads under
          Admin, then Access and security, then Managers.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-ink">
          Email
        </label>
        <p id="email-hint" className="mt-1 text-sm text-muted">
          The address you signed up with.
        </p>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy('email', true)}
          className={fieldClass('email')}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm font-medium text-red-700">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="googleAdsId" className="block text-sm font-semibold text-ink">
          Google Ads Customer ID
        </label>
        <p id="googleAdsId-hint" className="mt-1 text-sm text-muted">
          The 10-digit number at the top of your Google Ads account, next to your account name.
        </p>
        <input
          id="googleAdsId"
          name="googleAdsId"
          type="text"
          inputMode="numeric"
          placeholder="123-456-7890"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.googleAdsId)}
          aria-describedby={describedBy('googleAdsId', true)}
          className={fieldClass('googleAdsId')}
        />
        {errors.googleAdsId && (
          <p id="googleAdsId-error" className="mt-2 text-sm font-medium text-red-700">
            {errors.googleAdsId}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {formError}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  );
}
