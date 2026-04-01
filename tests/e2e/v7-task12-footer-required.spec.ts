import { expect, test } from '@playwright/test';

test('v7 task12 footer is present and readable on home, news, and products', async ({ page }) => {
  await page.goto('/');

  const homeFooter = page.locator('footer.site-footer');
  await expect(homeFooter).toBeVisible();
  await expect(homeFooter.getByText('KOWA TRADE AND COMMERCE CO.,LTD.', { exact: false })).toBeVisible();
  await expect(homeFooter.getByText('All rights reserved.', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task12-step1-v7-footer-home.png', fullPage: true });

  await page.goto('/news');
  const newsFooter = page.locator('footer.site-footer');
  await expect(newsFooter).toBeVisible();
  await expect(newsFooter.getByText('KOWA TRADE AND COMMERCE CO.,LTD.', { exact: false })).toBeVisible();
  await expect(newsFooter.getByText('All rights reserved.', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'tests/screenshots/task12-step2-v7-footer-news.png', fullPage: true });

  await page.goto('/products');
  const productsFooter = page.locator('footer.site-footer');
  await expect(productsFooter).toBeVisible();
  await expect(productsFooter.getByText('KOWA TRADE AND COMMERCE CO.,LTD.', { exact: false })).toBeVisible();
  await expect(productsFooter.getByText('All rights reserved.', { exact: true })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const mobileFooter = page.locator('footer.site-footer');
  await expect(mobileFooter).toBeVisible();
  const footerBox = await mobileFooter.boundingBox();
  expect(footerBox).not.toBeNull();
  expect((footerBox?.x ?? 0) + (footerBox?.width ?? 0)).toBeLessThanOrEqual(390);

  await page.screenshot({ path: 'tests/screenshots/task12-step3-v7-footer-mobile.png', fullPage: true });
});
