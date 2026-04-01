import { expect, test } from '@playwright/test';

test('v7 task13 english business copy aligns to legacy normalized facts', async ({ page }) => {
  await page.goto('/');

  const footer = page.locator('footer.site-footer');
  await expect(footer).toBeVisible();
  await expect(footer.getByText('Reoma Bldg. 5F, 2-10-6, Mita, Minato-Ku, Tokyo 108-0073,JAPAN', { exact: false })).toBeVisible();

  await page.goto('/news');
  await expect(page.locator('footer.site-footer').getByText('Reoma Bldg. 5F, 2-10-6, Mita, Minato-Ku, Tokyo 108-0073,JAPAN', { exact: false })).toBeVisible();

  await page.goto('/products');
  await expect(page.locator('footer.site-footer').getByText('Reoma Bldg. 5F, 2-10-6, Mita, Minato-Ku, Tokyo 108-0073,JAPAN', { exact: false })).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task13-step1-v7-legacy-alignment.png', fullPage: true });
});
