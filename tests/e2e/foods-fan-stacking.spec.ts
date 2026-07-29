import { test, expect } from '@playwright/test';

// Same even-count fan zIndex-tie regression as the machinery tab, verified
// here on the Foods tab (also 4 cards: matcha, herbs, snacks, seasonings).
test('centred foods card always paints above its symmetric twin', async ({ page }) => {
  await page.goto('/products?category=foods');
  await page.waitForSelector('.fan-card', { timeout: 15_000 });

  await page.locator('.fan-card').first().click();
  await page.waitForTimeout(700);

  const captionText = await page.locator('.card-fan-caption').textContent();

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
