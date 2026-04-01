import { expect, test } from '@playwright/test';

test('v8 task5: company profile page shows structured content blocks', async ({ page }) => {
  await page.goto('/company_profile');

  const content = page.getByTestId('company-profile-page-content');
  await expect(content).toBeVisible();

  await expect(content.getByRole('heading', { level: 1, name: 'Company Profile' })).toBeVisible();
  await expect(content.getByRole('heading', { level: 2, name: 'Core Business Domains' })).toBeVisible();
  await expect(content.getByRole('heading', { level: 2, name: 'Operational Model' })).toBeVisible();
  await expect(content.getByRole('heading', { level: 2, name: 'Company Facts' })).toBeVisible();

  await expect(content.getByText('Synthetic resin raw materials and recycled plastics trading.')).toBeVisible();
  await expect(content.getByText('Kowa provides a whole-service path from material purchase and classification to processing, logistics, customs, and export.')).toBeVisible();
  await expect(content.getByText('Established: 1994')).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task5-step1-v8-company-profile-structured-content.png',
    fullPage: true,
  });
});
