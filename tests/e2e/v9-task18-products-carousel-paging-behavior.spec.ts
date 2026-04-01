import { expect, test } from '@playwright/test';

test('v9 task18: products carousel navigation updates active page and position on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/products');

  const indicator = page.getByTestId('products-carousel-position');
  const next = page.getByTestId('products-carousel-next');
  const prev = page.getByTestId('products-carousel-prev');
  const pageButtons = page.locator('[data-testid="products-carousel-page"]');

  await expect(indicator).toHaveText('1 / 13');
  await expect(pageButtons.nth(0)).toHaveAttribute('aria-current', 'true');

  await next.click();
  await expect(indicator).toHaveText('2 / 13');
  await expect(pageButtons.nth(1)).toHaveAttribute('aria-current', 'true');

  await prev.click();
  await expect(indicator).toHaveText('1 / 13');
  await expect(pageButtons.nth(0)).toHaveAttribute('aria-current', 'true');

  await pageButtons.nth(8).click();
  await expect(indicator).toHaveText('9 / 13');
  await expect(pageButtons.nth(8)).toHaveAttribute('aria-current', 'true');

  await page.screenshot({
    path: 'tests/screenshots/task18-step1-v9-products-carousel-desktop-nav.png',
    fullPage: true,
  });
});

test('v9 task18: mobile products carousel supports swipe and next-button progression', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/products');

  const viewport = page.locator('.products-carousel-viewport');
  const indicator = page.getByTestId('products-carousel-position');
  const next = page.getByTestId('products-carousel-next');
  const pageButtons = page.locator('[data-testid="products-carousel-page"]');

  await expect(indicator).toHaveText('1 / 13');

  await viewport.dispatchEvent('touchstart', {
    touches: [{ identifier: 1, clientX: 300, clientY: 200 }],
  });
  await viewport.dispatchEvent('touchend', {
    changedTouches: [{ identifier: 1, clientX: 160, clientY: 200 }],
  });

  await expect(indicator).toHaveText('2 / 13');
  await expect(pageButtons.nth(1)).toHaveAttribute('aria-current', 'true');

  await next.click();
  await expect(indicator).toHaveText('3 / 13');
  await expect(pageButtons.nth(2)).toHaveAttribute('aria-current', 'true');

  await page.screenshot({
    path: 'tests/screenshots/task18-step2-v9-products-carousel-mobile-swipe-next.png',
    fullPage: true,
  });
});
