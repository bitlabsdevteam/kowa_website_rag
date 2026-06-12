import { expect, test } from '@playwright/test';

async function layerTops(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const top = (testid: string) =>
      document.querySelector(`[data-testid="${testid}"]`)?.getBoundingClientRect().top ?? Number.NaN;
    return {
      background: top('hero-parallax-background'),
      mid: top('hero-parallax-mid'),
      foreground: top('hero-parallax-foreground'),
    };
  });
}

test('v17 task7: hero is full-viewport with background, mid, and foreground layers', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('[data-testid="landing-primary-box"]');
  await expect(hero).toBeVisible();

  const background = page.locator('[data-testid="hero-parallax-background"]');
  const mid = page.locator('[data-testid="hero-parallax-mid"]');
  const foreground = page.locator('[data-testid="hero-parallax-foreground"]');

  await expect(background).toHaveAttribute('aria-hidden', 'true');
  await expect(mid).toHaveAttribute('aria-hidden', 'true');
  await expect(foreground).toBeVisible();

  // The 3D scene (or its fallback) lives inside the background layer.
  await expect(
    background.locator('[data-testid="hero-3d-scene"], [data-testid="hero-3d-fallback"]'),
  ).toHaveCount(1);

  // Foreground carries the brand copy and stat cards.
  await expect(foreground.getByRole('heading', { level: 1 })).toContainText('Kowa Trade & Commerce');
  await expect(foreground.locator('[data-testid="hero-stat-card"]')).toHaveCount(3);

  const viewport = page.viewportSize();
  const heroBox = await hero.boundingBox();
  expect(heroBox).not.toBeNull();
  expect(heroBox!.height).toBeGreaterThanOrEqual(viewport!.height * 0.9);

  await page.screenshot({ path: 'tests/screenshots/task7-01-cinematic-hero.png', fullPage: false });
});

test('v17 task7: scrolling moves the parallax layers at distinct rates', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(300);

  const before = await layerTops(page);
  await page.screenshot({ path: 'tests/screenshots/task7-02-before-scroll.png', fullPage: false });

  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' as ScrollBehavior }));
  await page.waitForTimeout(400);

  const after = await layerTops(page);
  await page.screenshot({ path: 'tests/screenshots/task7-03-after-scroll.png', fullPage: false });

  const delta = {
    background: after.background - before.background,
    mid: after.mid - before.mid,
    foreground: after.foreground - before.foreground,
  };

  // Every layer must have moved with the scroll...
  expect(Math.abs(delta.background)).toBeGreaterThan(50);
  expect(Math.abs(delta.foreground)).toBeGreaterThan(50);

  // ...but at rates distinct from one another (otherwise it is not parallax).
  expect(Math.abs(delta.background - delta.foreground)).toBeGreaterThan(10);
  expect(Math.abs(delta.background - delta.mid)).toBeGreaterThan(5);
  expect(Math.abs(delta.mid - delta.foreground)).toBeGreaterThan(5);
});

test('v17 task7: locale switching still updates the hero copy', async ({ page }) => {
  await page.goto('/');

  const foreground = page.locator('[data-testid="hero-parallax-foreground"]');
  await expect(foreground).toContainText('ABOUT');

  // The locale selector has a stable id (no data-testid; TopMenu carries
  // pre-existing uncommitted edits we must not touch in this task).
  await page.locator('#locale-select').selectOption('ja');

  await expect(foreground).toContainText('会社情報');
  await expect(foreground.getByRole('heading', { level: 1 })).toContainText('Kowa Trade & Commerce');

  await page.screenshot({ path: 'tests/screenshots/task7-04-locale-ja.png', fullPage: false });
});
