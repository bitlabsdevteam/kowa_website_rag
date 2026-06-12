import { expect, test } from '@playwright/test';

// deviceScaleFactor 3 proves the canvas DPR cap: the backing store must stay
// at <= 2x CSS pixels even on a 3x display.
test.use({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 3 });

test('v17 task10: hero renders cleanly at 375px with no horizontal overflow', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('[data-testid="landing-primary-box"]');
  await expect(hero).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375);

  const title = page.getByRole('heading', { level: 1 });
  await expect(title).toBeVisible();
  const titleBox = await title.boundingBox();
  expect(titleBox).not.toBeNull();
  expect(titleBox!.x).toBeGreaterThanOrEqual(0);
  expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(375);

  const statCard = page.locator('[data-testid="hero-stat-card"]').first();
  await expect(statCard).toBeVisible();
  const cardBox = await statCard.boundingBox();
  expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(375);

  // scale: 'css' keeps captures at CSS pixels; 3x buffers fail under SwiftShader.
  await page.screenshot({ path: 'tests/screenshots/task10-01-mobile-hero.png', fullPage: false, scale: 'css' });
  await page.screenshot({ path: 'tests/screenshots/task10-02-mobile-full.png', fullPage: true, scale: 'css' });
});

test('v17 task10: canvas stays aria-hidden and caps its DPR at 2 on a 3x display', async ({ page }) => {
  await page.goto('/');

  const scene = page.locator('[data-testid="hero-3d-scene"]');
  await expect(scene).toBeVisible({ timeout: 30000 });
  await expect(scene).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('[data-testid="hero-parallax-background"]')).toHaveAttribute('aria-hidden', 'true');

  const canvas = scene.locator('canvas');
  await expect(canvas).toBeVisible();

  const sizes = await canvas.evaluate((element) => {
    const c = element as HTMLCanvasElement;
    return {
      backingWidth: c.width,
      cssWidth: c.clientWidth,
      devicePixelRatio: window.devicePixelRatio,
    };
  });

  expect(sizes.devicePixelRatio).toBe(3);
  expect(sizes.cssWidth).toBeGreaterThan(0);
  // dpr={[1, 2]} must clamp the backing store to 2x CSS size (small tolerance).
  expect(sizes.backingWidth).toBeLessThanOrEqual(sizes.cssWidth * 2 + 2);

  await page.screenshot({ path: 'tests/screenshots/task10-03-mobile-canvas.png', fullPage: false, scale: 'css' });
});
