import { expect, test } from '@playwright/test';

test('v7 task9 renders dedicated NEWS and PRODUCTS pages with expected content', async ({ page }) => {
  await page.goto('/news');

  await expect(page.getByTestId('news-page-content')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'NEWS' })).toBeVisible();
  await expect(page.getByText('Q2 sourcing update: expanded recycled resin intake capability for regional clients.', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task9-step1-v7-news-page.png', fullPage: true });

  await page.goto('/products');

  await expect(page.getByTestId('products-page-content')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'PRODUCTS' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Synthetic Resin Raw Materials' })).toBeVisible();
  await expect(page.getByText('Stable procurement for manufacturing partners with quality-first handling.', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task9-step2-v7-products-page.png', fullPage: true });
});
