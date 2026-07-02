import { expect, test } from '@playwright/test';

test('v7 task8 (revised): home page carries a news digest, not the full NEWS/PRODUCTS pages', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('landing-primary-box')).toBeVisible();

  // The homepage now carries a Kanematsu-style news digest, but it must stay
  // a digest — the full news listing and product gallery remain owned by
  // their dedicated routes.
  await expect(page.getByTestId('home-news-section')).toBeVisible();
  await expect(page.getByTestId('news-page-content')).toHaveCount(0);
  await expect(page.getByTestId('products-page-content')).toHaveCount(0);

  await expect(page.locator('section#products')).toHaveCount(0);

  await page.screenshot({ path: 'tests/screenshots/task8-step1-v7-home-about-only.png', fullPage: true });

  await page.goto('/news');
  await expect(page.getByTestId('news-page-content')).toBeVisible();

  await page.goto('/products');
  await expect(page.getByTestId('products-page-content')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task8-step2-v7-news-products-routes.png', fullPage: true });
});
