import { expect, test } from '@playwright/test';

test('v17 task3: landing page no longer embeds the YouTube video', async ({ page }) => {
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task3-01-landing-initial.png', fullPage: true });

  await expect(page.locator('[data-testid="landing-primary-box"]')).toBeVisible();

  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('.reference-video-frame')).toHaveCount(0);

  await expect(page.locator('[data-testid="hero-stat-card"]')).toHaveCount(3);

  await page.screenshot({ path: 'tests/screenshots/task3-02-hero-without-video.png', fullPage: true });
});
