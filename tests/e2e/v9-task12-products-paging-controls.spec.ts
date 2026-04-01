import { expect, test } from '@playwright/test';

test('v9 task12: products carousel exposes paging controls and position indicator', async ({ page }) => {
  await page.goto('/products');

  const indicator = page.getByTestId('products-carousel-position');
  const pageButtons = page.locator('[data-testid="products-carousel-page"]');
  const next = page.getByTestId('products-carousel-next');

  await expect(indicator).toBeVisible();
  await expect(indicator).toHaveText('1 / 13');
  await expect(pageButtons).toHaveCount(13);

  await expect(pageButtons.nth(0)).toHaveAttribute('aria-current', 'true');
  await expect(pageButtons.nth(1)).toHaveAttribute('aria-current', 'false');

  await next.click();
  await expect(indicator).toHaveText('2 / 13');
  await expect(pageButtons.nth(0)).toHaveAttribute('aria-current', 'false');
  await expect(pageButtons.nth(1)).toHaveAttribute('aria-current', 'true');

  await pageButtons.nth(6).click();
  await expect(indicator).toHaveText('7 / 13');
  await expect(pageButtons.nth(6)).toHaveAttribute('aria-current', 'true');

  await page.screenshot({
    path: 'tests/screenshots/task12-step1-v9-products-paging-controls.png',
    fullPage: true,
  });
});
