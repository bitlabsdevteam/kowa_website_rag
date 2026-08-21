import { expect, test } from '@playwright/test';

test.describe('Japanese default locale', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (!window.sessionStorage.getItem('kowa-locale-test-initialized')) {
        window.localStorage.removeItem('kowa-locale');
        window.sessionStorage.setItem('kowa-locale-test-initialized', '1');
      }
    });
  });

  test('shows Japanese on a clean visit and keeps it across route navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('.hero-section-title')).toContainText('もう一度、');

    await page.goto('/company_profile');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.locator('#locale-select')).toHaveText('JP');
  });

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
  });
});
