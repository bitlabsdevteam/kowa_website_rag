import { expect, test } from '@playwright/test';

// Updated in v17 Task 9: the featured YouTube video was removed in v17 Task 3.
// The landing page must stay video-free; the hero media column carries the
// stat cards instead, and stays within the viewport on mobile.
test('v7 task11 landing page stays video-free after the v17 hero redesign', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('.video-panel')).toHaveCount(0);
  await expect(page.locator('.reference-video-frame')).toHaveCount(0);
  await expect(page.locator('[data-testid="hero-stat-card"]')).toHaveCount(3);

  await page.screenshot({ path: 'tests/screenshots/task11-step1-v7-video-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.locator('iframe')).toHaveCount(0);
  const statCard = page.locator('[data-testid="hero-stat-card"]').first();
  await expect(statCard).toBeVisible();
  const cardBox = await statCard.boundingBox();
  expect(cardBox).not.toBeNull();
  expect((cardBox?.x ?? 0) + (cardBox?.width ?? 0)).toBeLessThanOrEqual(390);

  await page.screenshot({ path: 'tests/screenshots/task11-step2-v7-video-mobile.png', fullPage: true });
});
