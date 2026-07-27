'use client';

import { useState, type FormEvent } from 'react';

import type { SiteCopy } from '@/lib/site-copy';

type ContactCopy = SiteCopy['contactPage'];

type SubmitStatus = 'idle' | 'handoff' | 'too-long';

const CONTACT_MAILTO_ADDRESS = 'kowa@kowatrade.com';
const MAILTO_URL_LENGTH_LIMIT = 1900;

export function ContactForm({ copy }: { copy: ContactCopy }) {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = query.replace(/\r?\n/g, '\r\n');
    const subject = `New contact form inquiry: ${companyName}`;
    const body = `New contact form inquiry\r\n\r\nCompany: ${companyName}\r\nEmail: ${email}\r\n\r\nQuery:\r\n${normalizedQuery}`;
    const mailtoUrl = `mailto:${CONTACT_MAILTO_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (mailtoUrl.length > MAILTO_URL_LENGTH_LIMIT) {
      setStatus('too-long');
      return;
    }

    window.location.href = mailtoUrl;
    setStatus('handoff');
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
        />
      </label>

      <button type="submit" className="field-button">
        {copy.submitLabel}
      </button>

      {status === 'handoff' ? (
        <p className="contact-form-feedback contact-form-feedback--success" role="status">
          {copy.successMessage}
        </p>
      ) : null}
      {status === 'too-long' ? (
        <p className="contact-form-feedback contact-form-feedback--error" role="alert">
          {copy.errorMessage}
        </p>
      ) : null}
    </form>
  );
}
