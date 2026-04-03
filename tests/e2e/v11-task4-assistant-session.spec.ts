import { expect, test } from '@playwright/test';

test('v11 task4: popup chat bootstraps assistant session and returns a grounded reply', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('landing-primary-cta').click();
  await expect(page.getByTestId('chat-popup-panel')).toBeVisible();

  await page.getByLabel('Type message').fill('When was Kowa established?');
  await page.getByTestId('chat-send').click();

  await expect(page.locator('.chat-mini-bubble.user').last()).toContainText('When was Kowa established?');
  await expect(page.locator('.chat-mini-bubble.assistant').last()).toContainText('Kowa was established');
});
