import { expect, test } from '@playwright/test';

test('v7 task8 home page remains ABOUT-focused and excludes full NEWS/PRODUCTS blocks', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('landing-primary-box')).toBeVisible();

  await expect(page.getByTestId('news-page-content')).toHaveCount(0);
  await expect(page.getByTestId('products-page-content')).toHaveCount(0);

  await expect(page.locator('section#news')).toHaveCount(0);
  await expect(page.locator('section#products')).toHaveCount(0);

  await expect(page.getByRole('heading', { name: 'NEWS' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'PRODUCTS' })).toHaveCount(0);

  await page.screenshot({ path: 'tests/screenshots/task8-step1-v7-home-about-only.png', fullPage: true });

  await page.goto('/news');
  await expect(page.getByTestId('news-page-content')).toBeVisible();

  await page.goto('/products');
  await expect(page.getByTestId('products-page-content')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task8-step2-v7-news-products-routes.png', fullPage: true });
});
