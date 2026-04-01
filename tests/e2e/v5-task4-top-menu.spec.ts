import { expect, test } from '@playwright/test';

test('v5 task4 top menu supports v6 minimal hierarchy, active state, mobile reveal, and real routes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await page.screenshot({ path: 'tests/screenshots/task4-step1-desktop-nav.png', fullPage: true });

  await expect(page.locator('[data-testid="top-menu-link-overview"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-overview"]')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-testid^="top-menu-link-"]')).toHaveCount(3);

  const links = [
    { testId: 'top-menu-link-business', href: '/business', heading: 'Business Items' },
    { testId: 'top-menu-link-talk-to-aya', href: '/#assistant', heading: 'Start with a grounded prompt' },
  ];

  for (const link of links) {
    await expect(page.locator(`[data-testid="${link.testId}"]`)).toHaveAttribute('href', link.href);
    await page.goto(link.href);
    await expect(page.getByRole('heading', { name: link.heading })).toBeVisible();
    await page.goto('/');
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
  await page.locator('[data-testid="mobile-menu-toggle"]').click();
  await expect(page.locator('[data-testid="top-menu-link-overview"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-business"]')).toBeVisible();
  await expect(page.locator('[data-testid="top-menu-link-talk-to-aya"]')).toBeVisible();
  await expect(page.locator('[data-testid^="top-menu-link-"]')).toHaveCount(3);

  await page.screenshot({ path: 'tests/screenshots/task4-step2-mobile-open-nav.png', fullPage: true });
});
