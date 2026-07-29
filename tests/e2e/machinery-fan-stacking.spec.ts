import { test, expect } from '@playwright/test';

// Regression for the fan carousel's even-count zIndex tie: with 4 cards, the
// geometric centre straddles two slots with identical |offset| (and thus
// identical zIndex), and ties used to resolve by DOM order rather than by
// which card is actually selected — so the caption could name one product
// while a different card visually painted on top of it. See
// CardFanCarousel's centerIndex zIndex bump.
test('centred machinery card always paints above its symmetric twin', async ({ page }) => {
  await page.goto('/products?category=plastics&form=machinery');
  await page.waitForSelector('.fan-card', { timeout: 15_000 });

  // Default mount centres index 2 (Food Machines), where the tie already
  // resolves correctly by luck. Click the first card (Heavy-duty Grinder 1,
  // index 0) to force the exact centerIndex=0 case that was broken.
  await page.locator('.fan-card').first().click();
  await page.waitForTimeout(700); // let the GSAP transition settle

  const captionText = await page.locator('.card-fan-caption').textContent();
  expect(captionText?.trim()).toBe('Heavy-duty Grinder 1');

  const stacks = await page.locator('.fan-card').evaluateAll((els) =>
    els.map((el) => {
      const img = el.querySelector('img');
      return {
        alt: img?.getAttribute('alt') ?? null,
        zIndex: Number(getComputedStyle(el as HTMLElement).zIndex) || 0,
      };
    }),
  );

  const centerEntry = stacks.find((s) => s.alt === captionText?.trim());
  expect(centerEntry).toBeTruthy();

  const maxOtherZIndex = Math.max(...stacks.filter((s) => s.alt !== captionText?.trim()).map((s) => s.zIndex));
  expect(centerEntry!.zIndex).toBeGreaterThan(maxOtherZIndex);
});
