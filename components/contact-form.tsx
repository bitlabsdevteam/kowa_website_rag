'use client';

import { useState, type FormEvent } from 'react';

import type { SiteCopy } from '@/lib/site-copy';

type ContactCopy = SiteCopy['contactPage'];

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({ copy }: { copy: ContactCopy }) {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const submitting = status === 'submitting';

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, email, query }),
      });

      if (!response.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      setCompanyName('');
      setEmail('');
      setQuery('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="form-grid contact-form" onSubmit={onSubmit} aria-labelledby="contact-form-heading">
      <p id="contact-form-heading" className="section-label contact-form-title">
        {copy.formTitle}
      </p>

      <label className="field-label" htmlFor="contact-company">
        {copy.companyLabel}
        <input
          id="contact-company"
          className="field"
          type="text"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          required
          disabled={submitting}
        />
      </label>

      <label className="field-label" htmlFor="contact-email">
        {copy.emailLabel}
        <input
          id="contact-email"
          className="field"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={submitting}
        />
      </label>

      <label className="field-label" htmlFor="contact-query">
        {copy.queryLabel}
        <textarea
          id="contact-query"
          className="field"
          rows={5}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          required
          disabled={submitting}
        />
      </label>

      <button type="submit" className="field-button" disabled={submitting}>
        {submitting ? copy.sendingLabel : copy.submitLabel}
      </button>

      {status === 'success' ? (
        <p className="contact-form-feedback contact-form-feedback--success" role="status">
          {copy.successMessage}
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="contact-form-feedback contact-form-feedback--error" role="alert">
          {copy.errorMessage}
        </p>
      ) : null}
    </form>
  );
}
