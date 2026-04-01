import { expect, test } from '@playwright/test';

test('v6 task2 final state: top menu is minimal and landing uses a single primary box', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task2-step1-v6-current-state.png', fullPage: true });

  await expect(page.locator('[data-testid="top-menu-link-overview"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-business"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-talk-to-aya"]')).toBeVisible();

  await expect(page.locator('[data-testid="top-menu-link-welcome"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="top-menu-link-inquiry"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="top-menu-link-factory"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="top-menu-link-access"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="top-menu-link-sources"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="top-menu-link-admin"]')).toHaveCount(0);

  await expect(page.locator('[data-testid^="top-menu-link-"]')).toHaveCount(3);

  await expect(page.locator('[data-testid="landing-primary-box"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="landing-primary-box"]')).toContainText('Kowa Trade & Commerce');
  await expect(page.locator('[data-testid="landing-primary-box"]')).toContainText('Overview');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('[data-testid="mobile-menu-toggle"]').click();

  await expect(page.locator('[data-testid="top-menu-link-overview"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-business"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-talk-to-aya"]')).toBeVisible();
  await expect(page.locator('[data-testid^="top-menu-link-"]')).toHaveCount(3);

  await page.screenshot({ path: 'tests/screenshots/task2-step2-v6-final-state.png', fullPage: true });
});
