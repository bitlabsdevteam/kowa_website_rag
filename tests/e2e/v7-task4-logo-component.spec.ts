import { expect, test } from '@playwright/test';

test('v7 task4 renders reusable logo mark + wordmark and stays responsive', async ({ page }) => {
  await page.goto('/');

  const brand = page.getByRole('link', { name: 'Kowa Trade and Commerce home' });
  const logo = brand.locator('.kowa-logo');
  const logoSvg = logo.locator('svg');
  const logoWordmark = logo.locator('.kowa-logo-text strong');
  const logoSubline = logo.locator('.kowa-logo-text small');

  await expect(brand).toBeVisible();
  await expect(logoSvg).toBeVisible();
  await expect(logoWordmark).toHaveText('Kowa Trade & Commerce');
  await expect(logoSubline).toHaveText('Tokyo, Japan');

  await page.screenshot({ path: 'tests/screenshots/task4-step1-v7-logo-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(brand).toBeVisible();
  await expect(logoSvg).toBeVisible();

  const brandBox = await brand.boundingBox();
  expect(brandBox).not.toBeNull();
  expect((brandBox?.x ?? 0) + (brandBox?.width ?? 0)).toBeLessThanOrEqual(390);

  const sublineDisplay = await logoSubline.evaluate((node) => getComputedStyle(node).display);
  expect(sublineDisplay).toBe('none');

  await page.screenshot({ path: 'tests/screenshots/task4-step2-v7-logo-mobile.png', fullPage: true });
});
