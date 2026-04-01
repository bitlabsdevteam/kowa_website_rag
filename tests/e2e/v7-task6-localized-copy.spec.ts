import { expect, test } from '@playwright/test';

test('v7 task6 localized dictionaries drive content across home/news/products', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.eyebrow').first()).toHaveText('ABOUT');
  await expect(page.getByText('All rights reserved.', { exact: true })).toBeVisible();

  await page.locator('#locale-select').selectOption('ja');
  await expect(page.locator('.eyebrow').first()).toHaveText('会社情報');
  await expect(page.getByText('無断転載を禁じます。', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task6-step1-v7-home-ja.png', fullPage: true });

  await page.locator('#locale-select').selectOption('zh');
  await expect(page.locator('.eyebrow').first()).toHaveText('关于');
  await expect(page.getByText('版权所有。', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task6-step2-v7-home-zh.png', fullPage: true });

  await page.goto('/news');
  await page.locator('#locale-select').selectOption('ja');
  await expect(page.getByRole('heading', { name: 'ニュース' })).toBeVisible();
  await page.locator('#locale-select').selectOption('zh');
  await expect(page.getByRole('heading', { name: '新闻' })).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task6-step3-v7-news-locales.png', fullPage: true });

  await page.goto('/products');
  await page.locator('#locale-select').selectOption('ja');
  await expect(page.getByRole('heading', { name: '製品' })).toBeVisible();
  await page.locator('#locale-select').selectOption('zh');
  await expect(page.getByRole('heading', { name: '产品' })).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task6-step4-v7-products-locales.png', fullPage: true });
});
