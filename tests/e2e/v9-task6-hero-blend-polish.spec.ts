import { expect, test } from '@playwright/test';

test('v9 task6: hero visual uses blended, non-harsh background styling', async ({ page }) => {
  await page.goto('/');

  const visual = page.locator('.business-hero-visual');
  const image = page.locator('.business-hero-visual img');

  await expect(visual).toBeVisible();
  await expect(image).toBeVisible();

  const styles = await page.evaluate(() => {
    const figure = document.querySelector('.business-hero-visual');
    const img = document.querySelector('.business-hero-visual img');
    if (!figure || !img) return null;
    const figureStyle = getComputedStyle(figure);
    const imgStyle = getComputedStyle(img);
    return {
      figureBackground: figureStyle.backgroundColor,
      figureOverflow: figureStyle.overflow,
      figureBorderRadius: figureStyle.borderRadius,
      imageBlendMode: imgStyle.mixBlendMode,
    };
  });

  expect(styles).not.toBeNull();
  expect(styles?.figureOverflow).toBe('hidden');
  expect(styles?.figureBorderRadius).not.toBe('0px');
  expect(styles?.figureBackground === 'rgba(0, 0, 0, 0)' || styles?.figureBackground === 'transparent').toBeTruthy();
  expect(styles?.imageBlendMode).toBe('multiply');

  await page.screenshot({
    path: 'tests/screenshots/task6-step1-v9-hero-blend-polish.png',
    fullPage: true,
  });
});
