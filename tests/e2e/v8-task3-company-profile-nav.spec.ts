import { expect, test } from '@playwright/test';

test('v8 task3: company profile menu item is visible and routes correctly', async ({ page }) => {
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const companyProfileLink = nav.getByTestId('top-menu-link-company-profile');

  await expect(companyProfileLink).toBeVisible();
  await expect(companyProfileLink).toHaveAttribute('href', '/company_profile');

  await page.screenshot({
    path: 'tests/screenshots/task3-step1-v8-company-profile-link.png',
    fullPage: true,
  });

  await companyProfileLink.click();
  await expect(page).toHaveURL(/\/company_profile$/);
  await expect(page.getByTestId('company-profile-page-content')).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task3-step2-v8-company-profile-page.png',
    fullPage: true,
  });
});
