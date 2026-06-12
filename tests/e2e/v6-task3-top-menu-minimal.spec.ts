import { expect, test } from '@playwright/test';

// Updated in v17 Task 9: the top menu now carries the corporate link set
// (About / News / Products / Machines / Company Profile) with no chat entry
// and no mobile toggle.
test('v6 task3 top menu exposes the corporate link set without a chat entry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task3-step1-v6-menu-red-state.png', fullPage: true });

  await expect(page.locator('[data-testid="top-menu-link-about"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-news"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-products"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-machines"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-company-profile"]')).toBeVisible();
  await expect(page.locator('[data-testid^="top-menu-link-"]')).toHaveCount(5);

  await expect(page.locator('[data-testid="top-menu-link-talk-to-aya"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="top-menu-link-admin"]')).toHaveCount(0);
});
