import { expect, test } from '@playwright/test';

test('v17 task2: landing page no longer renders the Talk to Aya chat trigger', async ({ page }) => {
  await page.goto('/');

  // Viewport-only: fullPage capture of the fixed WebGL backdrop hangs under
  // headless SwiftShader (same limitation noted in v17 task 10).
  await page.screenshot({ path: 'tests/screenshots/task2-01-landing-initial.png', fullPage: false });

  await expect(page.locator('[data-testid="landing-primary-box"]')).toBeVisible();

  await expect(page.locator('[data-testid="landing-primary-cta"]')).toHaveCount(0);
  await expect(page.getByText('Talk to Aya')).toHaveCount(0);
  await expect(page.locator('[data-testid="chat-popup-panel"]')).toHaveCount(0);

  const secondaryCta = page.locator('.hero-actions a[href="/company_profile"]');
  await expect(secondaryCta).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task2-02-hero-without-aya.png', fullPage: false });
});
