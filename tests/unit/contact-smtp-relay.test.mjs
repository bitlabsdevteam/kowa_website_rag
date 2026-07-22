import test from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';

const ORIGINAL_ENV = { ...process.env };

function resetEnv() {
  for (const key of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'CONTACT_TO_EMAIL']) {
    delete process.env[key];
  }
  Object.assign(process.env, ORIGINAL_ENV);
}

test('isSmtpRelayConfigured reflects SMTP_HOST presence', async () => {
  resetEnv();
  const { isSmtpRelayConfigured } = await import('../../lib/email/smtp.ts?nocache=1');

  delete process.env.SMTP_HOST;
  assert.equal(isSmtpRelayConfigured(), false);

  process.env.SMTP_HOST = 'smtp.sakura.ne.jp';
  assert.equal(isSmtpRelayConfigured(), true);
  resetEnv();
});

test('sendContactEmailViaSmtp throws on missing config instead of silently no-op', async () => {
  resetEnv();
  delete process.env.SMTP_HOST;
  const { sendContactEmailViaSmtp } = await import('../../lib/email/smtp.ts?nocache=2');

  await assert.rejects(
    () => sendContactEmailViaSmtp({ companyName: 'Acme', email: 'a@example.com', query: 'hi' }),
    /SMTP_HOST is not configured/,
  );
  resetEnv();
});

test('sendContactEmailViaSmtp successfully delivers via a real authenticated STARTTLS SMTP relay', async () => {
  resetEnv();
  const testAccount = await nodemailer.createTestAccount();

  process.env.SMTP_HOST = testAccount.smtp.host;
  process.env.SMTP_PORT = String(testAccount.smtp.port);
  process.env.SMTP_USER = testAccount.user;
  process.env.SMTP_PASS = testAccount.pass;
  process.env.SMTP_FROM = 'Kowa Trade and Commerce <noreply@kowatrade.com>';
  process.env.CONTACT_TO_EMAIL = 'kowa@kowatrade.com';

  const { sendContactEmailViaSmtp } = await import('../../lib/email/smtp.ts?nocache=3');

  await sendContactEmailViaSmtp({
    companyName: 'Test Buyer Co., Ltd.',
    email: 'buyer@example.com',
    query: 'We are interested in HDPE regrind pellet volumes for Q3 export.',
  });

  resetEnv();
});
