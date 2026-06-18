import { expect, test } from '@playwright/test';

test('v18 task3: hero is a boxless full-viewport copy layer over the backdrop', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('[data-testid="landing-primary-box"]');
  await expect(hero).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task3-v18-01-boxless-hero.png', fullPage: false });

  // No card box: transparent background, no border, no radius, no shadow.
  const heroStyles = await hero.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      borderTopWidth: style.borderTopWidth,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow,
    };
  });
  expect(heroStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(heroStyles.borderTopWidth).toBe('0px');
  expect(heroStyles.borderRadius).toBe('0px');
  expect(heroStyles.boxShadow).toBe('none');

  // Full-viewport: hero spans the entire viewport width (full-bleed out of the
  // width-constrained page shell) and stands at least a full viewport tall.
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('viewport size unavailable');
  const heroBox = await hero.boundingBox();
  expect(heroBox).not.toBeNull();
  expect(heroBox!.width).toBeGreaterThanOrEqual(viewport.width - 1);
  expect(heroBox!.height).toBeGreaterThanOrEqual(viewport.height * 0.95);

  // Copy and CTA render directly over the fixed backdrop.
  await expect(hero.getByRole('heading', { level: 1 })).toContainText('Kowa Trade & Commerce');
  await expect(hero.getByRole('link', { name: 'View company profile' })).toBeVisible();
  await expect(page.locator('[data-testid="page-backdrop"]')).toHaveCount(1);
});

test('v18 task3: parallax drift still responds to scroll after the restyle', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(300);

  const hero = page.locator('[data-testid="landing-primary-box"]');
  const progressBefore = await hero.evaluate((element) =>
    Number.parseFloat(element.style.getPropertyValue('--hero-parallax') || '0'),
  );
  expect(progressBefore).toBe(0);

  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' as ScrollBehavior }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'tests/screenshots/task3-v18-02-after-scroll.png', fullPage: false });

  const progressAfter = await hero.evaluate((element) =>
    Number.parseFloat(element.style.getPropertyValue('--hero-parallax') || '0'),
  );
  expect(progressAfter).toBeGreaterThan(0.1);

  // Foreground copy still drifts against the scroll via the CSS variable.
  const foregroundTransform = await page
    .locator('[data-testid="hero-parallax-foreground"]')
    .evaluate((element) => window.getComputedStyle(element).transform);
  expect(foregroundTransform).not.toBe('none');
});

test('v18 task3: locale switching still updates the boxless hero copy', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('[data-testid="landing-primary-box"]');
  await expect(hero).toContainText('ABOUT');

  await page.locator('#locale-select').selectOption('ja');

  await expect(hero).toContainText('会社情報');
  await page.screenshot({ path: 'tests/screenshots/task3-v18-03-locale-ja.png', fullPage: false });
});
