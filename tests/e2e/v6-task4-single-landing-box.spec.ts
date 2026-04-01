import { expect, test } from '@playwright/test';

test('v6 task4 landing consolidates into a single overview box', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task4-step1-v6-landing-red-state.png', fullPage: true });

  await expect(page.locator('[data-testid="landing-primary-box"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="landing-primary-box"]')).toContainText('Kowa Trade & Commerce');
  await expect(page.locator('[data-testid="landing-primary-box"]')).toContainText('Overview');
  await expect(page.locator('[data-testid="landing-primary-cta"]')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'What users can reliably ask about' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'How answers stay credible' })).toHaveCount(0);
  await expect(page.getByText('Company profile', { exact: true })).toHaveCount(0);

  await page.click('[data-testid="landing-primary-cta"]');
  await expect(page.locator('#assistant')).toBeVisible();
});
