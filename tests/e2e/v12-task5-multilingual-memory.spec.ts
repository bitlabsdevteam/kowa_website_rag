import { expect, test } from '@playwright/test';

test('v12 task5: popup chat answers a Japanese address question and shows citation metadata', async ({ page }) => {
  await page.goto('/');
  await page.locator('#locale-select').selectOption('ja');
  await page.getByTestId('landing-primary-cta').click();

  const input = page.locator('.chat-mini-input-row input');
  await input.fill('会社の住所は？');
  await page.getByTestId('chat-send').click();

  await expect(page.locator('.chat-mini-bubble.assistant').last()).toContainText('Kowaの所在地は');
  await expect(page.getByTestId('chat-confidence').last()).toBeVisible();
  await expect(page.getByTestId('chat-citation').last()).toContainText('Kowa Legacy Company Profile');
});

test('v12 task5: popup chat uses prior turn memory for follow-up wording', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('landing-primary-cta').click();

  const input = page.locator('.chat-mini-input-row input');
  await input.fill('When was Kowa established?');
  await page.getByTestId('chat-send').click();
  await expect(page.locator('.chat-mini-bubble.assistant').last()).toContainText('Kowa was established');

  await input.fill('And what about the address?');
  await page.getByTestId('chat-send').click();

  await expect(page.locator('.chat-mini-bubble.assistant').last()).toContainText('Following up on your earlier question:');
  await expect(page.locator('.chat-mini-bubble.assistant').last()).toContainText('Kowa address is');
});
