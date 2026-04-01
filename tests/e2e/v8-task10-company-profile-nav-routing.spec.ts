import { expect, test } from '@playwright/test';

test('v8 task10: company profile nav link is visible and routable on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const companyLink = nav.getByTestId('top-menu-link-company-profile');

  await expect(companyLink).toBeVisible();
  await expect(companyLink).toHaveAttribute('href', '/company_profile');

  await page.screenshot({
    path: 'tests/screenshots/task10-step1-v8-company-profile-nav-desktop.png',
    fullPage: true,
  });

  await companyLink.click();
  await expect(page).toHaveURL(/\/company_profile$/);
  await expect(page.getByTestId('company-profile-page-content')).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task10-step2-v8-company-profile-route-desktop.png',
    fullPage: true,
  });
});

test('v8 task10: company profile nav link is visible and routable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const companyLink = nav.getByTestId('top-menu-link-company-profile');

  await expect(companyLink).toBeVisible();
  await companyLink.click();
  await expect(page).toHaveURL(/\/company_profile$/);
  await expect(page.getByTestId('company-profile-page-content')).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task10-step3-v8-company-profile-route-mobile.png',
    fullPage: true,
  });
});
