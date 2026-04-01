import { expect, test } from '@playwright/test';

test('v8 task7: business section renders premium visual cards and flow on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/');

  const business = page.getByTestId('business-section');
  const cards = business.locator('.business-pillar-card');
  const flow = business.locator('.business-flow');

  await expect(business).toBeVisible();
  await expect(cards).toHaveCount(4);
  await expect(flow).toBeVisible();

  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();

  // Desktop should place first two cards in a row (same visual row, different x columns).
  expect(Math.abs((first?.y ?? 0) - (second?.y ?? 0)) < 10).toBeTruthy();
  expect((second?.x ?? 0) > (first?.x ?? 0)).toBeTruthy();

  await page.screenshot({
    path: 'tests/screenshots/task7-step1-v8-business-visual-desktop.png',
    fullPage: true,
  });
});

test('v8 task7: business section stacks cards responsively on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const business = page.getByTestId('business-section');
  const cards = business.locator('.business-pillar-card');
  const flow = business.locator('.business-flow');

  await expect(business).toBeVisible();
  await expect(cards).toHaveCount(4);
  await expect(flow).toBeVisible();

  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();

  // Mobile should stack cards vertically.
  expect((second?.y ?? 0) > (first?.y ?? 0)).toBeTruthy();

  await page.screenshot({
    path: 'tests/screenshots/task7-step2-v8-business-visual-mobile.png',
    fullPage: true,
  });
});
