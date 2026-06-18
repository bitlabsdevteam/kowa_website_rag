import { expect, test } from '@playwright/test';

const CANVAS = '[data-testid="hero-3d-scene"] canvas';

test('v17 task8: scrolling the hero eases the 3D camera rig forward', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto('/');
  const canvas = page.locator(CANVAS);
  // First request compiles the page and loads the R3F chunk; allow extra time.
  await expect(canvas).toBeVisible({ timeout: 30000 });

  // At the top of the page the rig should sit at (or settle to) rest.
  await page.waitForTimeout(700);
  const restProgress = Number(await canvas.getAttribute('data-hero-progress'));
  expect(restProgress).toBeLessThan(0.15);
  await page.screenshot({ path: 'tests/screenshots/task8-01-camera-at-rest.png', fullPage: false });

  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' as ScrollBehavior }));
  // The damped easing chases the new scroll target over several frames.
  await expect
    .poll(async () => Number(await canvas.getAttribute('data-hero-progress')), { timeout: 5000 })
    .toBeGreaterThan(0.3);

  const scrolledProgress = Number(await canvas.getAttribute('data-hero-progress'));
  expect(scrolledProgress).toBeGreaterThan(restProgress);
  await page.screenshot({ path: 'tests/screenshots/task8-02-camera-scrolled.png', fullPage: false });

  expect(consoleErrors).toEqual([]);
});
