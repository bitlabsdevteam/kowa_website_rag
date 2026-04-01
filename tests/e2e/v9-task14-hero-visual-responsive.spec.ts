import { expect, test } from '@playwright/test';

test('v9 task14: hero visual renders on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/');

  const visual = page.locator('.business-hero-visual');
  const image = page.locator('.business-hero-visual img');

  await expect(visual).toBeVisible();
  await expect(image).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task14-step1-v9-hero-visual-desktop.png',
    fullPage: true,
  });
});

test('v9 task14: hero visual renders responsively on mobile below hero text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const textBlock = page.locator('.hero-overview-text');
  const visual = page.locator('.business-hero-visual');
  const image = page.locator('.business-hero-visual img');

  await expect(textBlock).toBeVisible();
  await expect(visual).toBeVisible();
  await expect(image).toBeVisible();

  const textBox = await textBlock.boundingBox();
  const visualBox = await visual.boundingBox();
  expect(textBox).not.toBeNull();
  expect(visualBox).not.toBeNull();
  expect((visualBox?.y ?? 0) > (textBox?.y ?? 0)).toBeTruthy();

  await page.screenshot({
    path: 'tests/screenshots/task14-step2-v9-hero-visual-mobile.png',
    fullPage: true,
  });
});
