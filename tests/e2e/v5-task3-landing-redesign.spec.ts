import { expect, test } from '@playwright/test';

// Updated in v17 Task 9: the landing hero is now a cinematic 3D scene with no
// chat CTA (removed in v17 Task 2) and no assistant section on the page.
test('v5 task3 landing redesign delivers editorial narrative (v17 cinematic hero)', async ({ page }) => {
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task3-step1-landing-initial.png', fullPage: true });

  await expect(page.getByRole('heading', { name: 'Kowa Trade & Commerce' })).toBeVisible();
  await expect(page.locator('[data-testid="landing-narrative"]')).toBeVisible();

  // The Talk to Aya CTA was removed from the landing page in v17.
  await expect(page.locator('[data-testid="landing-primary-cta"]')).toHaveCount(0);

  // The hero routes visitors to the company profile instead.
  await expect(page.locator('.hero-actions a[href="/company_profile"]')).toBeVisible();

  await expect(page.locator('[data-testid="business-section"]')).toBeVisible();
  await expect(page.locator('[data-testid="hero-stat-card"]')).toHaveCount(3);
});
