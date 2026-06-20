import { expect, test } from '@playwright/test';

test('v8 task5: company profile page shows elegant bilingual key facts', async ({ page }) => {
  await page.goto('/company_profile');

  const content = page.getByTestId('company-profile-page-content');
  await expect(content).toBeVisible();

  // Minimal header: eyebrow + company name as the single h1.
  await expect(content.getByRole('heading', { level: 1 })).toBeVisible();

  // The two core facts, shown bilingually (JA / EN).
  await expect(content.getByText('資本金', { exact: true })).toBeVisible();
  await expect(content.getByText('5000万円', { exact: true })).toBeVisible();
  await expect(content.getByText('Capital', { exact: true })).toBeVisible();
  await expect(content.getByText('50 Million Yen', { exact: true })).toBeVisible();

  await expect(content.getByText('設立', { exact: true })).toBeVisible();
  await expect(content.getByText('1994年', { exact: true })).toBeVisible();
  await expect(content.getByText('Established', { exact: true })).toBeVisible();
  await expect(content.getByText('1994', { exact: true })).toBeVisible();

  // Removed clutter should no longer be present.
  await expect(content.getByRole('heading', { name: 'Source narrative' })).toHaveCount(0);
  await expect(content.getByRole('heading', { name: 'Operating priorities' })).toHaveCount(0);
  await expect(content.getByRole('heading', { name: 'Operational build-out over time.' })).toHaveCount(0);

  await page.screenshot({
    path: 'tests/screenshots/task5-step1-v8-company-profile-key-facts.png',
    fullPage: true,
  });
});
