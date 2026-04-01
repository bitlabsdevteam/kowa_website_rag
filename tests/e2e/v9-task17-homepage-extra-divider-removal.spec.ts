import { expect, test } from '@playwright/test';

test('v9 task17: homepage footer area has no duplicate horizontal divider', async ({ page }) => {
  await page.goto('/');

  const footer = page.locator('footer.site-footer');
  const footerBar = page.locator('.site-footer-bar');
  await expect(footer).toBeVisible();
  await expect(footerBar).toBeVisible();

  const dividerState = await page.evaluate(() => {
    const footerEl = document.querySelector('footer.site-footer');
    const footerBarEl = document.querySelector('.site-footer-bar');
    if (!footerEl || !footerBarEl) return null;

    const footerStyle = getComputedStyle(footerEl);
    const footerBarStyle = getComputedStyle(footerBarEl);

    const footerHasTopDivider =
      footerStyle.borderTopStyle !== 'none' && parseFloat(footerStyle.borderTopWidth) > 0;
    const footerBarHasTopDivider =
      footerBarStyle.borderTopStyle !== 'none' && parseFloat(footerBarStyle.borderTopWidth) > 0;

    return {
      footerHasTopDivider,
      footerBarHasTopDivider,
      topDividerCount: [footerHasTopDivider, footerBarHasTopDivider].filter(Boolean).length,
    };
  });

  expect(dividerState).not.toBeNull();
  expect(dividerState?.footerHasTopDivider).toBeFalsy();
  expect(dividerState?.footerBarHasTopDivider).toBeTruthy();
  expect(dividerState?.topDividerCount).toBe(1);

  await page.screenshot({
    path: 'tests/screenshots/task17-step1-v9-homepage-extra-divider-removal.png',
    fullPage: true,
  });
});
