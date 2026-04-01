import { expect, test } from '@playwright/test';

test('v9 task11: products page renders premium carousel with active-slide focus and smooth motion', async ({ page }) => {
  await page.goto('/products');

  const carousel = page.getByTestId('products-carousel');
  const track = page.getByTestId('products-carousel-track');
  const slides = page.locator('[data-testid="products-carousel-slide"]');
  const next = page.getByTestId('products-carousel-next');

  await expect(carousel).toBeVisible();
  await expect(track).toBeVisible();
  await expect(slides).toHaveCount(13);
  await expect(next).toBeVisible();

  const firstActiveBefore = page.locator('[data-testid="products-carousel-slide"][data-active="true"]').first();
  await expect(firstActiveBefore).toHaveAttribute('data-index', '0');

  await next.click();

  const firstActiveAfter = page.locator('[data-testid="products-carousel-slide"][data-active="true"]').first();
  await expect(firstActiveAfter).toHaveAttribute('data-index', '1');

  const styles = await page.evaluate(() => {
    const trackEl = document.querySelector('[data-testid="products-carousel-track"]');
    const slideEl = document.querySelector('[data-testid="products-carousel-slide"]');
    if (!trackEl || !slideEl) return null;
    const trackStyle = getComputedStyle(trackEl);
    const slideStyle = getComputedStyle(slideEl);
    return {
      transitionDuration: trackStyle.transitionDuration,
      touchAction: trackStyle.touchAction,
      slideTransform: slideStyle.transform,
    };
  });

  expect(styles).not.toBeNull();
  expect(styles?.transitionDuration).not.toBe('0s');
  expect(styles?.touchAction).toBe('pan-y');
  expect(styles?.slideTransform).not.toBe('none');

  await page.screenshot({
    path: 'tests/screenshots/task11-step1-v9-products-carousel-ui.png',
    fullPage: true,
  });
});
