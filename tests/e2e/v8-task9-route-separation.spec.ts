import { expect, test } from '@playwright/test';

test('v8 task9: homepage excludes dedicated news/products content surfaces', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('news-page-content')).toHaveCount(0);
  await expect(page.getByTestId('products-page-content')).toHaveCount(0);
  await expect(page.getByTestId('company-profile-page-content')).toHaveCount(0);

  await page.screenshot({
    path: 'tests/screenshots/task9-step1-v8-home-route-separation.png',
    fullPage: true,
  });
});

test('v8 task9: dedicated news and products pages render their own content surfaces', async ({ page }) => {
  await page.goto('/news');
  await expect(page.getByTestId('news-page-content')).toBeVisible();
  await expect(page.getByTestId('products-page-content')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1, name: /news/i })).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task9-step2-v8-news-route-content.png',
    fullPage: true,
  });

  await page.goto('/products');
  await expect(page.getByTestId('products-page-content')).toBeVisible();
  await expect(page.getByTestId('news-page-content')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1, name: /products|製品|产品/i })).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task9-step3-v8-products-route-content.png',
    fullPage: true,
  });
});
