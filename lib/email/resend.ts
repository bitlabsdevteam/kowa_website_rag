// Not currently wired up — the contact form hands off to the visitor's local mail client via
// mailto: (components/contact-form.tsx) instead of calling app/api/contact. Kept for possible
// future re-use if server-side relay delivery is reactivated.
import { Resend } from 'resend';

export type ContactEmailPayload = {
  companyName: string;
  email: string;
  query: string;
};

const DEFAULT_CONTACT_TO_EMAIL = 'kowa@kowatrade.com';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sends a contact-form submission to the Kowa inbox via Resend.
 * The sender's email is set as Reply-To so staff can respond directly.
 */
export async function sendContactEmail({ companyName, email, query }: ContactEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO_EMAIL;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  if (!fromEmail) {
    throw new Error('CONTACT_FROM_EMAIL is not configured');
  }

  const resend = new Resend(apiKey);

  const text = `New contact form inquiry\n\nCompany: ${companyName}\nEmail: ${email}\n\nQuery:\n${query}`;
  const html = `
    <h2>New contact form inquiry</h2>
    <p><strong>Company:</strong> ${escapeHtml(companyName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Query:</strong></p>
    <p>${escapeHtml(query).replace(/\n/g, '<br />')}</p>
  `;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject: `New contact form inquiry: ${companyName}`,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Failed to send contact email');
  }
}
