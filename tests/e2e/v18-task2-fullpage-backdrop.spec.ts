import { expect, test } from '@playwright/test';

test('v18 task2: 3D scene is a fixed full-viewport page backdrop, not a boxed panel', async ({ page }) => {
  await page.goto('/');

  const backdrop = page.locator('[data-testid="page-backdrop"]');
  await expect(backdrop).toHaveCount(1);
  await expect(backdrop).toHaveAttribute('aria-hidden', 'true');

  // The scene (or its fallback) must live inside the page backdrop, not the hero.
  const scene = backdrop.locator('[data-testid="hero-3d-scene"], [data-testid="hero-3d-fallback"]');
  await expect(scene.first()).toBeAttached();

  await page.screenshot({ path: 'tests/screenshots/task2-v18-01-backdrop-top.png', fullPage: false });

  const viewport = page.viewportSize();
  if (!viewport) throw new Error('viewport size unavailable');

  // Fixed positioning: bounding box equals the viewport at the top of the page…
  await expect(backdrop).toHaveCSS('position', 'fixed');
  const boxAtTop = await backdrop.boundingBox();
  expect(boxAtTop).not.toBeNull();
  expect(boxAtTop!.x).toBe(0);
  expect(boxAtTop!.y).toBe(0);
  expect(boxAtTop!.width).toBe(viewport.width);
  expect(boxAtTop!.height).toBe(viewport.height);

  // …and still equals the viewport after scrolling to the bottom of the page.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'tests/screenshots/task2-v18-02-backdrop-bottom.png', fullPage: false });

  const boxAtBottom = await backdrop.boundingBox();
  expect(boxAtBottom).not.toBeNull();
  expect(boxAtBottom!.x).toBe(0);
  expect(boxAtBottom!.y).toBe(0);
  expect(boxAtBottom!.width).toBe(viewport.width);
  expect(boxAtBottom!.height).toBe(viewport.height);

  // No panel box around the visual: no rounded corners or borders on the scene.
  const sceneStyles = await scene.first().evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      borderRadius: style.borderRadius,
      borderTopWidth: style.borderTopWidth,
    };
  });
  expect(sceneStyles.borderRadius).toBe('0px');
  expect(sceneStyles.borderTopWidth).toBe('0px');

  // The hero no longer hosts the scene — it sits above the fixed backdrop.
  const heroHostedScene = page.locator(
    '[data-testid="landing-primary-box"] [data-testid="hero-3d-scene"], [data-testid="landing-primary-box"] [data-testid="hero-3d-fallback"]',
  );
  await expect(heroHostedScene).toHaveCount(0);
});
