import { expect, test } from '@playwright/test';

test('v7 task15 polished spacing rhythm and readable typography remain stable', async ({ page }) => {
  await page.goto('/');

  const pageRoot = page.locator('.page');
  const heroTitle = page.locator('.hero-title');
  const sectionTitle = page.locator('.section-title').first();

  await expect(pageRoot).toBeVisible();
  await expect(heroTitle).toBeVisible();
  await expect(sectionTitle).toBeVisible();

  const desktopGap = await pageRoot.evaluate((node) => getComputedStyle(node).gap);
  const heroLineHeight = await heroTitle.evaluate((node) => getComputedStyle(node).lineHeight);
  const sectionLineHeight = await sectionTitle.evaluate((node) => getComputedStyle(node).lineHeight);

  expect(desktopGap).toBe('26px');
  expect(Number.parseFloat(heroLineHeight)).toBeGreaterThanOrEqual(60);
  expect(Number.parseFloat(sectionLineHeight)).toBeGreaterThanOrEqual(45);

  await page.screenshot({ path: 'tests/screenshots/task15-step1-v7-polish-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.page')).toBeVisible();

  const mobileScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(mobileScrollWidth).toBeLessThanOrEqual(390);

  await page.screenshot({ path: 'tests/screenshots/task15-step2-v7-polish-mobile.png', fullPage: true });
});
