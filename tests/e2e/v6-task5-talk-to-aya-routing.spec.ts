import { expect, test } from '@playwright/test';

test('v6 task5 Talk to Aya routes users to assistant entry from nav and landing on desktop/mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task5-step1-v6-nav-before-routing.png', fullPage: true });

  await page.click('[data-testid="top-menu-link-talk-to-aya"]');
  await expect(page).toHaveURL(/\/\#assistant$/);
  await expect(page.locator('#assistant')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Start with a grounded prompt' })).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task5-step2-v6-desktop-nav-arrival.png', fullPage: true });

  await page.goto('/');
  await page.click('[data-testid="landing-primary-cta"]');
  await expect(page).toHaveURL(/\/\#assistant$/);
  await expect(page.locator('[data-testid="chat-send"]')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task5-step3-v6-landing-cta-arrival.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.click('[data-testid="mobile-menu-toggle"]');
  await page.click('[data-testid="top-menu-link-talk-to-aya"]');

  await expect(page).toHaveURL(/\/\#assistant$/);
  await expect(page.locator('#assistant')).toBeVisible();
  await expect(page.locator('[data-testid="chat-send"]')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task5-step4-v6-mobile-nav-arrival.png', fullPage: true });
});
