import { expect, test } from '@playwright/test';

test('v7 task1 baseline captures homepage render and key targets', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('landing-primary-box')).toBeVisible();
  await expect(page.getByTestId('top-menu-link-about')).toBeVisible();
  await expect(page.getByTestId('top-menu-link-news')).toBeVisible();
  await expect(page.getByTestId('top-menu-link-products')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task1-step1-v7-home-baseline.png', fullPage: true });

  await page.getByTestId('landing-primary-cta').click();
  await expect(page.getByTestId('chat-popup-panel')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task1-step2-v7-chat-open.png', fullPage: true });
});
