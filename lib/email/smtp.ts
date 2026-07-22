import nodemailer from 'nodemailer';

import type { ContactEmailPayload } from './resend';

const DEFAULT_CONTACT_TO_EMAIL = 'kowa@kowatrade.com';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isSmtpRelayConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST?.trim());
}

/**
 * Sends a contact-form submission via an authenticated SMTP relay
 * (Sakura's さくらのメールボックス: smtp.sakura.ne.jp:587 STARTTLS, or any
 * SMTP-AUTH provider configured the same way).
 */
export async function sendContactEmailViaSmtp({
  companyName,
  email,
  query,
}: ContactEmailPayload): Promise<void> {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || '587');
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO_EMAIL;

  if (!host) {
    throw new Error('SMTP_HOST is not configured');
  }
  if (!user) {
    throw new Error('SMTP_USER is not configured');
  }
  if (!pass) {
    throw new Error('SMTP_PASS is not configured');
  }
  if (!from) {
    throw new Error('SMTP_FROM is not configured');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
  });

  const text = `New contact form inquiry\n\nCompany: ${companyName}\nEmail: ${email}\n\nQuery:\n${query}`;
  const html = `
    <h2>New contact form inquiry</h2>
    <p><strong>Company:</strong> ${escapeHtml(companyName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Query:</strong></p>
    <p>${escapeHtml(query).replace(/\n/g, '<br />')}</p>
  `;

  await transporter.sendMail({
    from,
    to: toEmail,
    replyTo: email,
    subject: `New contact form inquiry: ${companyName}`,
    text,
    html,
  });
}
