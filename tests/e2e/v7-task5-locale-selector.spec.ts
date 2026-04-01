import { expect, test, type Page } from '@playwright/test';

async function assertLocaleSelector(page: Page) {
  const select = page.locator('#locale-select');

  await expect(select).toBeVisible();
  await expect(select).toHaveValue('en');

  await expect(select.locator('option[value="en"]')).toHaveText('EN');
  await expect(select.locator('option[value="ja"]')).toHaveText('JP');
  await expect(select.locator('option[value="zh"]')).toHaveText('中文');
}

test('v7 task5 locale selector is visible with EN default and EN/JP/中文 options on core pages', async ({ page }) => {
  await page.goto('/');
  await assertLocaleSelector(page);
  await page.screenshot({ path: 'tests/screenshots/task5-step1-v7-locale-home.png', fullPage: true });

  await page.goto('/news');
  await assertLocaleSelector(page);
  await page.screenshot({ path: 'tests/screenshots/task5-step2-v7-locale-news.png', fullPage: true });

  await page.goto('/products');
  await assertLocaleSelector(page);
  await page.screenshot({ path: 'tests/screenshots/task5-step3-v7-locale-products.png', fullPage: true });
});
