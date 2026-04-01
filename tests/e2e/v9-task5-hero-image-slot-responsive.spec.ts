import { expect, test } from '@playwright/test';

test('v9 task5: hero image slot renders beside hero text on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/');

  const heroRow = page.locator('.hero-overview-row');
  const textBlock = page.locator('.hero-overview-text');
  const visual = page.locator('.business-hero-visual');
  const visualImage = page.locator('.business-hero-visual img');

  await expect(heroRow).toBeVisible();
  await expect(textBlock).toBeVisible();
  await expect(visual).toBeVisible();
  await expect(visualImage).toBeVisible();

  const textBox = await textBlock.boundingBox();
  const visualBox = await visual.boundingBox();
  expect(textBox).not.toBeNull();
  expect(visualBox).not.toBeNull();

  // Desktop layout expectation: image sits to the right of text.
  expect((visualBox?.x ?? 0) > (textBox?.x ?? 0)).toBeTruthy();

  await page.screenshot({
    path: 'tests/screenshots/task5-step1-v9-hero-image-slot-desktop.png',
    fullPage: true,
  });
});

test('v9 task5: hero image slot stacks below hero text on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const textBlock = page.locator('.hero-overview-text');
  const visual = page.locator('.business-hero-visual');
  const visualImage = page.locator('.business-hero-visual img');

  await expect(textBlock).toBeVisible();
  await expect(visual).toBeVisible();
  await expect(visualImage).toBeVisible();

  const textBox = await textBlock.boundingBox();
  const visualBox = await visual.boundingBox();
  expect(textBox).not.toBeNull();
  expect(visualBox).not.toBeNull();

  // Mobile layout expectation: image appears below text block.
  expect((visualBox?.y ?? 0) > (textBox?.y ?? 0)).toBeTruthy();

  await page.screenshot({
    path: 'tests/screenshots/task5-step2-v9-hero-image-slot-mobile.png',
    fullPage: true,
  });
});
