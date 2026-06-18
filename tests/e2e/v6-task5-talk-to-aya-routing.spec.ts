import { expect, test } from '@playwright/test';

// Updated in v17 Task 9: Talk to Aya no longer has entry points on the landing
// page (CTA removed in v17 Task 2; nav entry removed in an earlier sprint).
// The landing route now leads to the company profile.
test('v6 task5 landing routing leads to company profile, with no Aya entry points', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task5-step1-v6-nav-before-routing.png', fullPage: true });

  await expect(page.locator('[data-testid="top-menu-link-talk-to-aya"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="landing-primary-cta"]')).toHaveCount(0);
  await expect(page.getByText('Talk to Aya')).toHaveCount(0);

  await page.click('.hero-actions a[href="/company_profile"]');
  await expect(page).toHaveURL(/\/company_profile$/);

  await page.screenshot({ path: 'tests/screenshots/task5-step2-v6-company-profile-arrival.png', fullPage: true });
});
