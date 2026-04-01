import { expect, test } from '@playwright/test';

test('v9 task9: homepage footer area renders a single divider line', async ({ page }) => {
  await page.goto('/');

  const footer = page.locator('footer.site-footer');
  const footerBar = page.locator('.site-footer-bar');

  await expect(footer).toBeVisible();
  await expect(footerBar).toBeVisible();

  const borders = await page.evaluate(() => {
    const footerEl = document.querySelector('footer.site-footer');
    const footerBarEl = document.querySelector('.site-footer-bar');
    if (!footerEl || !footerBarEl) return null;

    const footerStyle = getComputedStyle(footerEl);
    const barStyle = getComputedStyle(footerBarEl);
    return {
      footerBorderTopWidth: footerStyle.borderTopWidth,
      footerBorderTopStyle: footerStyle.borderTopStyle,
      barBorderTopWidth: barStyle.borderTopWidth,
      barBorderTopStyle: barStyle.borderTopStyle,
    };
  });

  expect(borders).not.toBeNull();
  expect(borders?.footerBorderTopWidth).toBe('0px');
  expect(borders?.footerBorderTopStyle).toBe('none');
  expect(borders?.barBorderTopWidth).not.toBe('0px');
  expect(borders?.barBorderTopStyle).toBe('solid');

  await page.screenshot({
    path: 'tests/screenshots/task9-step1-v9-homepage-single-footer-divider.png',
    fullPage: true,
  });
});
