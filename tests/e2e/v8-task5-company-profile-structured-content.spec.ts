import { expect, test } from '@playwright/test';

test('v8 task5: company profile page shows structured content blocks', async ({ page }) => {
  await page.goto('/company_profile');

  const content = page.getByTestId('company-profile-page-content');
  await expect(content).toBeVisible();

  await expect(content.getByRole('heading', { level: 1, name: 'Company Profile' })).toBeVisible();
  await expect(content.getByRole('heading', { level: 2, name: 'Source narrative' })).toBeVisible();
  await expect(content.getByRole('heading', { level: 2, name: 'Operating priorities' })).toBeVisible();
  await expect(content.getByRole('heading', { level: 2, name: 'Operational build-out over time.' })).toBeVisible();

  await expect(content.getByText('We collect plastics domestically and export them overseas.')).toBeVisible();
  await expect(content.getByText('1993 founding, followed by reorganization in 1994')).toBeVisible();
  await expect(content.getByText('A self-operated Gunma distribution warehouse started operations as the North-Kanto base.')).toBeVisible();

  await page.screenshot({
    path: 'tests/screenshots/task5-step1-v8-company-profile-structured-content.png',
    fullPage: true,
  });
});
