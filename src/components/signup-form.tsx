'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { pricing } from '@/config/site';
import { BUDGET_TIERS } from '@/lib/airtable-fields';

const FORM_BUDGET_TIERS = BUDGET_TIERS.filter((tier) => tier.amount >= pricing.minAdSpend);
import {
  HONEYPOT_FIELD,
  signupSchema,
  toFieldErrors,
  type FieldErrors,
  type SignupField,
} from '@/lib/signup-schema';

const inputClass =
  'mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent-strong/40';

// Visual marker only; inputs carry `required` and `aria-required` for assistive tech.
function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-red-700">
      *
    </span>
  );
}

function Field({
  id,
  label,
  hint,
  optional,
  error,
  children,
}: {
  id: SignupField;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">(optional)</span> : <RequiredMark />}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function describedBy(id: SignupField, hasHint = false) {
    const ids = [hasHint ? `${id}-hint` : null, errors[id] ? `${id}-error` : null].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
  }

  function fieldClass(id: SignupField) {
    return `${inputClass} ${errors[id] ? 'border-red-600' : 'border-line'}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      const first = Object.keys(fieldErrors)[0];
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] ?? '' }),
      });
      if (res.ok) {
        router.push('/thank-you');
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string; fieldErrors?: FieldErrors };
      if (body.fieldErrors) setErrors(body.fieldErrors);
      setFormError(body.error ?? 'Something went wrong. Please try again.');
    } catch {
      setFormError('Could not reach the server. Check your connection and try again.');
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <p className="text-sm text-muted">
        Fields marked <span className="text-red-700">*</span> are required.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy('name')}
            className={fieldClass('name')}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
            className={fieldClass('email')}
          />
        </Field>
      </div>

      <Field id="videoUrl" label="YouTube video link" error={errors.videoUrl}>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          inputMode="url"
          placeholder="https://youtu.be/..."
          required
          aria-required="true"
          aria-invalid={Boolean(errors.videoUrl)}
          aria-describedby={describedBy('videoUrl')}
          className={fieldClass('videoUrl')}
        />
      </Field>

      <fieldset
        role="radiogroup"
        aria-required="true"
        aria-invalid={Boolean(errors.budgetTier)}
        aria-describedby={errors.budgetTier ? 'budgetTier-hint budgetTier-error' : 'budgetTier-hint'}
      >
        <legend className="block text-sm font-semibold text-ink">
          Estimated ad budget
          <RequiredMark />
        </legend>
        <p id="budgetTier-hint" className="mt-1 text-sm text-muted">
          A rough idea is fine. We&apos;ll confirm the exact amount with you before launch. Paid to Google directly,
          ${pricing.minAdSpend} minimum.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
          {FORM_BUDGET_TIERS.map((tier) => (
            <label
              key={tier.value}
              className={`flex cursor-pointer items-center justify-center rounded-xl border bg-white px-2 py-3 text-base font-semibold transition-colors has-[:checked]:border-accent-strong has-[:checked]:bg-accent-soft has-[:checked]:text-accent-strong has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-strong/40 ${
                errors.budgetTier ? 'border-red-600' : 'border-line'
              }`}
            >
              <input type="radio" name="budgetTier" value={tier.value} required className="sr-only" />
              {tier.label}
            </label>
          ))}
        </div>
        {errors.budgetTier && (
          <p id="budgetTier-error" className="mt-2 text-sm font-medium text-red-700">
            {errors.budgetTier}
          </p>
        )}
      </fieldset>

      <Field
        id="googleAdsId"
        label="Google Ads Customer ID"
        optional
        hint="You can add this later."
        error={errors.googleAdsId}
      >
        <input
          id="googleAdsId"
          name="googleAdsId"
          type="text"
          inputMode="numeric"
          placeholder="123-456-7890"
          aria-invalid={Boolean(errors.googleAdsId)}
          aria-describedby={describedBy('googleAdsId', true)}
          className={fieldClass('googleAdsId')}
        />
      </Field>

      <Field
        id="notes"
        label="Anything else we should know?"
        optional
        hint="For example, a specific country you want to target."
        error={errors.notes}
      >
        <textarea
          id="notes"
          name="notes"
          rows={4}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={describedBy('notes', true)}
          className={fieldClass('notes')}
        />
      </Field>

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
        {submitting ? 'Submitting…' : 'Start my campaign'}
      </button>
    </form>
  );
}
