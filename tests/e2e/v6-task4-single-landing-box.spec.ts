import { expect, test } from '@playwright/test';

// Updated in v17 Task 9: the single overview box is now the cinematic hero;
// its CTA routes to the company profile instead of the removed chat trigger.
test('v6 task4 landing consolidates into a single overview box', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task4-step1-v6-landing-red-state.png', fullPage: true });

  await expect(page.locator('[data-testid="landing-primary-box"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="landing-primary-box"]')).toContainText('Kowa Trade & Commerce');

  await expect(page.locator('[data-testid="landing-primary-cta"]')).toHaveCount(0);

  await page.click('.hero-actions a[href="/company_profile"]');
  await expect(page).toHaveURL(/\/company_profile$/);
});
