import { expect, test } from '@playwright/test';

test('v7 task3 routes ABOUT/NEWS/PRODUCTS to dedicated pages', async ({ page }) => {
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: 'Main navigation' });

  await expect(page).toHaveURL(/\/$/);
  await expect(nav.getByTestId('top-menu-link-about')).toHaveAttribute('href', '/');
  await expect(nav.getByTestId('top-menu-link-news')).toHaveAttribute('href', '/news');
  await expect(nav.getByTestId('top-menu-link-products')).toHaveAttribute('href', '/products');
  await page.screenshot({ path: 'tests/screenshots/task3-step1-v7-home-route.png', fullPage: true });

  await nav.getByTestId('top-menu-link-news').click();
  await expect(page).toHaveURL(/\/news$/);
  await expect(page.getByTestId('news-page-content')).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task3-step2-v7-news-route.png', fullPage: true });

  await page.getByRole('navigation', { name: 'Main navigation' }).getByTestId('top-menu-link-products').click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByTestId('products-page-content')).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task3-step3-v7-products-route.png', fullPage: true });
});
