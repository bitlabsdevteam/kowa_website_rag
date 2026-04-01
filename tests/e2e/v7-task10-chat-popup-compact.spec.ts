import { expect, test } from '@playwright/test';

test('v7 task10 popup chat uses compact merchant-style layout and stays viewport-safe', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('chat-popup-panel')).toHaveCount(0);
  await page.getByTestId('landing-primary-cta').click();

  const popup = page.getByTestId('chat-popup-panel');
  await expect(popup).toBeVisible();
  await expect(page.getByTestId('chat-popup-style')).toBeVisible();

  const promo = page.locator('.chat-promo');
  const inputRow = page.locator('.chat-mini-input-row');
  await expect(promo).toBeVisible();
  await expect(inputRow).toBeVisible();

  const promoBg = await promo.evaluate((node) => getComputedStyle(node).backgroundColor);
  const inputBg = await inputRow.evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(promoBg).toBe('rgb(6, 6, 6)');
  expect(inputBg).toBe('rgb(255, 255, 255)');

  await expect(popup.getByRole('button', { name: 'Open' })).toHaveCount(0);
  await expect(popup.getByRole('button', { name: 'Close' })).toHaveCount(0);

  const popupBoxDesktop = await popup.boundingBox();
  expect(popupBoxDesktop).not.toBeNull();
  expect((popupBoxDesktop?.x ?? 0) + (popupBoxDesktop?.width ?? 0)).toBeLessThanOrEqual(1280);

  await page.screenshot({ path: 'tests/screenshots/task10-step1-v7-popup-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByTestId('landing-primary-cta').click();

  const popupMobile = page.getByTestId('chat-popup-panel');
  await expect(popupMobile).toBeVisible();
  const popupBoxMobile = await popupMobile.boundingBox();
  expect(popupBoxMobile).not.toBeNull();
  expect((popupBoxMobile?.x ?? 0) + (popupBoxMobile?.width ?? 0)).toBeLessThanOrEqual(390);

  await page.screenshot({ path: 'tests/screenshots/task10-step2-v7-popup-mobile.png', fullPage: true });
});
