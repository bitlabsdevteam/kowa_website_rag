import { expect, test } from '@playwright/test';

test.describe('Japanese default locale', () => {
  test('shows Japanese on a clean visit and keeps it across route navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('.hero-section-title')).toContainText('もう一度、');

    await page.goto('/company_profile');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('#locale-select')).toHaveText('JP');
  });

  test('migrates a legacy English default before hydration', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('kowa-locale', 'en'));
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('.hero-section-title')).toContainText('もう一度、');
    await expect.poll(() => page.evaluate(() => window.localStorage.getItem('kowa-locale'))).toBe('ja');
    await expect.poll(() => page.evaluate(() => window.localStorage.getItem('kowa-locale-version'))).toBe('ja-default-v1');
  });

  for (const storedLocale of ['ja', 'zh-Hans', 'zh-Hant'] as const) {
    test(`preserves stored ${storedLocale} after migration`, async ({ page }) => {
      await page.addInitScript((locale) => window.localStorage.setItem('kowa-locale', locale), storedLocale);
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('lang', storedLocale);
      await expect.poll(() => page.evaluate(() => window.localStorage.getItem('kowa-locale'))).toBe(storedLocale);
      await expect.poll(() => page.evaluate(() => window.localStorage.getItem('kowa-locale-version'))).toBe('ja-default-v1');
    });
  }

  test('preserves an explicit locale through navigation and reload', async ({ page }) => {
    await page.goto('/');
    await page.locator('#locale-select').click();
    await page.getByTestId('locale-option-en').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.goto('/products');
    await expect(page.locator('#locale-select')).toHaveText('EN');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#locale-select')).toHaveText('EN');
  });

  test('recovers from an invalid stored locale', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('kowa-locale', 'invalid-locale'));
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('#locale-select')).toHaveText('JP');
    await expect.poll(() => page.evaluate(() => window.localStorage.getItem('kowa-locale-version'))).toBe('ja-default-v1');
  });
});
