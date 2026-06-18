import { expect, test } from '@playwright/test';

function translation(matrix: string): { x: number; y: number } {
  if (matrix === 'none') return { x: 0, y: 0 };
  const parts = matrix.match(/matrix(?:3d)?\(([^)]+)\)/);
  if (!parts) return { x: 0, y: 0 };
  const values = parts[1].split(',').map((v) => Number(v.trim()));
  if (values.length === 16) return { x: values[12], y: values[13] };
  return { x: values[4] ?? 0, y: values[5] ?? 0 };
}

test('v18 task7: landing sections fly in and combine as they enter the viewport', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(400);

  const head = page.locator('[data-testid="reveal-business-head"]');
  const rail = page.locator('[data-testid="reveal-business-rail"]');
  const visual = page.locator('[data-testid="reveal-business-visual"]');

  // The business block is below the 100svh hero, so it starts hidden/offset.
  await expect(head).toHaveAttribute('data-revealed', 'false');
  const railStart = translation(await rail.evaluate((el) => getComputedStyle(el).transform));
  const visualStart = translation(await visual.evaluate((el) => getComputedStyle(el).transform));
  // Paired columns begin offset to opposite sides.
  expect(railStart.x).toBeLessThan(-20);
  expect(visualStart.x).toBeGreaterThan(20);
  await page.screenshot({ path: 'tests/screenshots/task7-v18-01-before-reveal.png', fullPage: false });

  // Scroll the section into view and let the reveal run.
  await page.locator('[data-testid="business-section"]').scrollIntoViewIfNeeded();
  await expect(head).toHaveAttribute('data-revealed', 'true');
  await expect(rail).toHaveAttribute('data-revealed', 'true');
  await expect(visual).toHaveAttribute('data-revealed', 'true');
  await page.waitForTimeout(900);

  // They combine at the center: both rest at the identity transform.
  const railEnd = translation(await rail.evaluate((el) => getComputedStyle(el).transform));
  const visualEnd = translation(await visual.evaluate((el) => getComputedStyle(el).transform));
  expect(Math.abs(railEnd.x)).toBeLessThan(1);
  expect(Math.abs(visualEnd.x)).toBeLessThan(1);
  await expect(visual).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'tests/screenshots/task7-v18-02-after-reveal.png', fullPage: false });
});

test('v18 task7: reveal fires once and stays revealed on scroll-back', async ({ page }) => {
  await page.goto('/');
  const visual = page.locator('[data-testid="reveal-business-visual"]');

  await page.locator('[data-testid="business-section"]').scrollIntoViewIfNeeded();
  await expect(visual).toHaveAttribute('data-revealed', 'true');

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }));
  await page.waitForTimeout(400);
  // Once revealed, it must not reset to hidden.
  await expect(visual).toHaveAttribute('data-revealed', 'true');
});

test('v18 task7: reduced motion shows content immediately without reveal offset', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForTimeout(400);

  const rail = page.locator('[data-testid="reveal-business-rail"]');
  await expect(rail).toHaveAttribute('data-revealed', 'true');
  const railTransform = translation(await rail.evaluate((el) => getComputedStyle(el).transform));
  expect(Math.abs(railTransform.x)).toBeLessThan(1);
  await expect(rail).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'tests/screenshots/task7-v18-03-reduced-motion.png', fullPage: false });
});
