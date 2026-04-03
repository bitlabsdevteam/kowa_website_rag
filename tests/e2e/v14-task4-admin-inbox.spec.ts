import { expect, test } from '@playwright/test';

test('v14 task4: admin console can triage a confirmed assistant handoff', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('landing-primary-cta').click();

  const input = page.locator('.chat-mini-input-row input');
  await input.fill('I need a quote for recycled plastic pellets for Singapore.');
  await page.getByTestId('chat-send').click();

  const fields = page.locator('.chat-contact-card input');
  await fields.nth(0).fill('David Bong');
  await fields.nth(1).fill('Kowa Prospect');
  await fields.nth(2).fill('david@example.com');
  await fields.nth(3).fill('+65 1234 5678');
  await fields.nth(4).fill('Singapore');

  await page.getByTestId('chat-prepare-handoff').click();
  await expect(page.getByTestId('chat-handoff-draft')).toBeVisible();
  await page.getByTestId('chat-confirm-handoff').click();

  await page.goto('/admin');
  await page.evaluate(() => window.localStorage.setItem('kowa-admin-auth', 'authenticated'));
  await page.reload();

  await expect(page.getByText('Assistant inbox', { exact: false })).toBeVisible();
  await expect(page.locator('.admin-queue-item').first()).toContainText('Intent: quote_request.');

  await page.locator('.admin-queue-item').first().click();
  await page.getByPlaceholder('Assign owner').fill('Aya Office');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Save assignee' }).click();

  await page.getByPlaceholder('Add an internal office note').fill('Prioritize this Singapore resin inquiry.');
  await page.getByRole('button', { name: 'Add note' }).click();
  await expect(page.getByText('Prioritize this Singapore resin inquiry.')).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Mark triaged' }).click();
  await expect(page.locator('.admin-health').first()).toContainText('triaged');
});
