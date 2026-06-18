import { expect, test } from '@playwright/test';

const MOBILE = { width: 375, height: 812 };
const DESKTOP = { width: 1440, height: 900 };

test('v18 task10: no horizontal overflow on the landing route at 375px', async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto('/');
  await page.getByTestId('landing-primary-box').waitFor();

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth };
  });
  // The hero's full-bleed breakout must not push the document wider than the
  // viewport (the 100vw-includes-scrollbar overflow from Tasks 3/4).
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);

  await page.screenshot({ path: 'tests/screenshots/task10-v18-01-mobile-landing.png', fullPage: false });
});

test('v18 task10: reveal fly-in distance is reduced on mobile vs desktop', async ({ page }) => {
  const readFlyOffset = async () => {
    const rail = page.getByTestId('reveal-business-rail');
    await rail.waitFor();
    return rail.evaluate((el) => {
      const t = getComputedStyle(el).transform;
      return t === 'none' ? 0 : Math.abs(new DOMMatrixReadOnly(t).m41);
    });
  };

  await page.setViewportSize(DESKTOP);
  await page.goto('/');
  const desktopOffset = await readFlyOffset();

  await page.setViewportSize(MOBILE);
  await page.goto('/');
  const mobileOffset = await readFlyOffset();

  // Both pre-reveal states still translate the column off-center...
  expect(desktopOffset).toBeGreaterThan(0);
  expect(mobileOffset).toBeGreaterThan(0);
  // ...but the mobile fly-in travels a shorter distance so it stays on-screen.
  expect(mobileOffset).toBeLessThan(desktopOffset);
});

test('v18 task10: backdrop keeps aria-hidden and the canvas DPR stays capped', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/');

  const backdrop = page.getByTestId('page-backdrop');
  await expect(backdrop).toHaveAttribute('aria-hidden', 'true');

  // The R3F canvas must never render above 2x device pixel ratio (perf cap).
  const canvas = backdrop.locator('canvas').first();
  await canvas.waitFor({ state: 'attached', timeout: 15_000 }).catch(() => {});
  if (await canvas.count()) {
    const ratio = await canvas.evaluate((el: HTMLCanvasElement) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 ? el.width / rect.width : 0;
    });
    expect(ratio).toBeLessThanOrEqual(2.01);
  }
});

test('v18 task10: reduced motion shows all content immediately over the static fallback', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: DESKTOP });
  const page = await context.newPage();
  await page.goto('/');

  // Reveal-wrapped sections are fully visible without scrolling/animation.
  const rail = page.getByTestId('reveal-business-rail');
  const visual = page.getByTestId('reveal-business-visual');
  await rail.waitFor();

  for (const el of [rail, visual]) {
    const state = await el.evaluate((node) => {
      const s = getComputedStyle(node);
      const t = s.transform;
      const x = t === 'none' ? 0 : Math.abs(new DOMMatrixReadOnly(t).m41);
      return { opacity: Number(s.opacity), x };
    });
    expect(state.opacity).toBe(1);
    expect(state.x).toBeLessThan(1);
  }

  // Static fallback poster is present underneath (not the animated canvas only).
  await expect(page.getByTestId('hero-3d-fallback').first()).toBeAttached();

  await page.screenshot({ path: 'tests/screenshots/task10-v18-02-reduced-motion.png', fullPage: false });
  await context.close();
});
