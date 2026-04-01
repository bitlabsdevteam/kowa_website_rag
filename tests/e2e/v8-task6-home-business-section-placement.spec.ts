import { expect, test } from '@playwright/test';

test('v8 task6: homepage business section appears under hero narrative and above lower-page blocks', async ({ page }) => {
  await page.goto('/');

  const narrative = page.getByTestId('landing-narrative');
  const business = page.getByTestId('business-section');
  const businessHeading = business.getByRole('heading', { level: 2, name: "WHAT IS KOWA'S BUSINESS?" });
  const footer = page.locator('footer.site-footer');

  await expect(narrative).toBeVisible();
  await expect(business).toBeVisible();
  await expect(businessHeading).toBeVisible();
  await expect(footer).toBeVisible();

  const narrativeBox = await narrative.boundingBox();
  const businessBox = await business.boundingBox();
  const footerBox = await footer.boundingBox();

  expect(narrativeBox).not.toBeNull();
  expect(businessBox).not.toBeNull();
  expect(footerBox).not.toBeNull();

  expect((businessBox?.y ?? 0) > (narrativeBox?.y ?? 0)).toBeTruthy();
  expect((businessBox?.y ?? 0) < (footerBox?.y ?? 99999)).toBeTruthy();

  await page.screenshot({
    path: 'tests/screenshots/task6-step1-v8-home-business-section-placement.png',
    fullPage: true,
  });
});
