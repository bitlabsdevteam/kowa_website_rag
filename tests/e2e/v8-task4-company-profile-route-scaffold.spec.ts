import { expect, test } from '@playwright/test';

test('v8 task4: company profile route scaffold renders on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/company_profile');

  await expect(page).toHaveURL(/\/company_profile$/);
  await expect(page.getByTestId('company-profile-page-content')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task4-step1-v8-company-profile-desktop.png',
    fullPage: true,
  });
});

test('v8 task4: company profile route scaffold renders on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/company_profile');

  await expect(page).toHaveURL(/\/company_profile$/);
  await expect(page.getByTestId('company-profile-page-content')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task4-step2-v8-company-profile-mobile.png',
    fullPage: true,
  });
});
