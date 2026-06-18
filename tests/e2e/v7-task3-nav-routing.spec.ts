import { expect, test } from '@playwright/test';

test('v7 task3 routes ABOUT/NEWS/PRODUCTS/MACHINES to dedicated pages', async ({ page }) => {
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: 'Main navigation' });

  await expect(page).toHaveURL(/\/$/);
  await expect(nav.getByTestId('top-menu-link-about')).toHaveAttribute('href', '/');
  // News temporarily hidden from the top menu; route /news still active and tested directly below.
  await expect(nav.getByTestId('top-menu-link-news')).toHaveCount(0);
  await expect(nav.getByTestId('top-menu-link-products')).toHaveAttribute('href', '/products');
  await expect(nav.getByTestId('top-menu-link-machines')).toHaveAttribute('href', '/machines');
  await page.screenshot({ path: 'tests/screenshots/task3-step1-v7-home-route.png', fullPage: true });

  await page.goto('/news');
  await expect(page).toHaveURL(/\/news$/);
  await expect(page.getByTestId('news-page-content')).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task3-step2-v7-news-route.png', fullPage: true });
  await page.goto('/');

  await page.getByRole('navigation', { name: 'Main navigation' }).getByTestId('top-menu-link-products').click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByTestId('products-page-content')).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task3-step3-v7-products-route.png', fullPage: true });

  await page.getByRole('navigation', { name: 'Main navigation' }).getByTestId('top-menu-link-machines').click();
  await expect(page).toHaveURL(/\/machines$/);
  await expect(page.getByTestId('machines-page-content')).toBeVisible();
});
