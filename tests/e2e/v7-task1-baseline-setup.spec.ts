import { expect, test } from '@playwright/test';

// Updated in v17 Task 9: the homepage baseline no longer includes the chat
// popup trigger; the hero CTA routes to the company profile.
test('v7 task1 baseline captures homepage render and key targets', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('landing-primary-box')).toBeVisible();
  await expect(page.getByTestId('top-menu-link-about')).toBeVisible();
  await expect(page.getByTestId('top-menu-link-news')).toBeVisible();
  await expect(page.getByTestId('top-menu-link-products')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task1-step1-v7-home-baseline.png', fullPage: true });

  await expect(page.getByTestId('landing-primary-cta')).toHaveCount(0);
  await page.locator('.hero-actions a[href="/company_profile"]').click();
  await expect(page).toHaveURL(/\/company_profile$/);

  await page.screenshot({ path: 'tests/screenshots/task1-step2-v7-company-profile.png', fullPage: true });
});
