import { expect, test, type Page } from '@playwright/test';

async function assertLocaleSelector(page: Page) {
  const trigger = page.locator('#locale-select');

  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveText('JP');

  await trigger.click();
  await expect(page.getByTestId('locale-option-en')).toHaveText('EN');
  await expect(page.getByTestId('locale-option-ja')).toHaveText('JP');
  await expect(page.getByTestId('locale-option-zh-Hans')).toHaveText('簡体字');
  await expect(page.getByTestId('locale-option-zh-Hant')).toHaveText('繁体字');
  await trigger.click();
}

test('v7 task5 locale selector is visible with JP default and EN/JP/SC/TC options on core pages', async ({ page }) => {
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
