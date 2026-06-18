import { expect, test } from '@playwright/test';

test('v17 task5: hero renders the 3D background scene without console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });

  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task5-01-landing-initial.png', fullPage: false });

  const scene = page.locator('[data-testid="hero-3d-scene"]');
  await expect(scene).toBeVisible();
  await expect(scene).toHaveAttribute('aria-hidden', 'true');
  await expect(scene.locator('canvas')).toHaveCount(1);

  // Give the render loop a moment to surface any runtime errors.
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'tests/screenshots/task5-02-scene-running.png', fullPage: false });

  expect(consoleErrors, `console errors: ${consoleErrors.join('\n')}`).toHaveLength(0);
});
