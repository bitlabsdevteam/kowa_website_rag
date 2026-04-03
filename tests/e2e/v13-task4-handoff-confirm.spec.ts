import { expect, test } from '@playwright/test';

test('v13 task4: popup chat collects contact details and confirms office handoff', async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto('/');
  await page.getByTestId('landing-primary-cta').click();

  const input = page.locator('.chat-mini-input-row input');
  await input.fill('I need a quote for recycled plastic pellets for Singapore.');
  await page.getByTestId('chat-send').click();

  await expect(page.getByTestId('chat-contact-card')).toBeVisible();

  const fields = page.locator('.chat-contact-card input');
  await fields.nth(0).fill('David Bong');
  await fields.nth(1).fill('Kowa Prospect');
  await fields.nth(2).fill('david@example.com');
  await fields.nth(3).fill('+65 1234 5678');
  await fields.nth(4).fill('Singapore');

  await page.getByTestId('chat-prepare-handoff').click();
  await expect(page.getByTestId('chat-handoff-draft')).toBeVisible();
  await expect(page.getByTestId('chat-handoff-draft')).toContainText('Visitor request: I need a quote for recycled plastic pellets for Singapore.');

  await page.getByTestId('chat-confirm-handoff').click();
  await expect(page.locator('.chat-mini-bubble.assistant').last()).toContainText('office handoff has been submitted successfully');
});
