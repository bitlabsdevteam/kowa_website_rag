import { expect, test } from '@playwright/test';

test('v17 task6: reduced motion swaps the 3D scene for the static fallback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const fallback = page.locator('[data-testid="hero-3d-fallback"]');
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveAttribute('aria-hidden', 'true');

  // Give the support check time to run, then confirm the scene never mounted.
  await page.waitForTimeout(800);
  await expect(page.locator('[data-testid="hero-3d-scene"]')).toHaveCount(0);

  await page.screenshot({ path: 'tests/screenshots/task6-01-reduced-motion-fallback.png', fullPage: false });
});

test('v17 task6: missing WebGL support swaps the 3D scene for the static fallback', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function getContext(
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
        return null;
      }
      return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });

  await page.goto('/');

  const fallback = page.locator('[data-testid="hero-3d-fallback"]');
  await expect(fallback).toBeVisible();

  await page.waitForTimeout(800);
  await expect(page.locator('[data-testid="hero-3d-scene"]')).toHaveCount(0);

  await page.screenshot({ path: 'tests/screenshots/task6-02-no-webgl-fallback.png', fullPage: false });
});

test('v17 task6: capable browsers still get the 3D scene, over the poster underlay', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('[data-testid="hero-3d-scene"]')).toBeVisible();
  // Since v18 the fallback stays mounted as a poster underlay beneath the
  // scene so the backdrop never flashes empty while the 3D chunk loads.
  await expect(page.locator('[data-testid="hero-3d-fallback"]')).toHaveCount(1);

  await page.screenshot({ path: 'tests/screenshots/task6-03-webgl-scene-kept.png', fullPage: false });
});
