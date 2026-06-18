import { expect, test } from '@playwright/test';

test('v7 task2 nav shows ABOUT/NEWS/PRODUCTS/MACHINES and hides legacy labels', async ({ page }) => {
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: 'Main navigation' });

  await expect(nav.getByTestId('top-menu-link-about')).toHaveText('ABOUT');
  // News temporarily hidden from the top menu (route /news still active).
  await expect(nav.getByTestId('top-menu-link-news')).toHaveCount(0);
  await expect(nav.getByTestId('top-menu-link-products')).toHaveText('PRODUCTS');
  await expect(nav.getByTestId('top-menu-link-machines')).toHaveText('MACHINES');
  await expect(nav.getByTestId('top-menu-link-products')).toHaveAttribute('href', '/products');
  await expect(nav.getByTestId('top-menu-link-machines')).toHaveAttribute('href', '/machines');

  await expect(nav.getByText('Overview', { exact: true })).toHaveCount(0);
  await expect(nav.getByText('Business', { exact: true })).toHaveCount(0);
  await expect(nav.getByText('Talk to Aya', { exact: true })).toHaveCount(0);

  await page.screenshot({ path: 'tests/screenshots/task2-step1-v7-nav-home.png', fullPage: true });

  await page.goto('/news');
  await expect(page).toHaveURL(/\/news$/);
  await page.screenshot({ path: 'tests/screenshots/task2-step2-v7-nav-news-route.png', fullPage: true });
});
