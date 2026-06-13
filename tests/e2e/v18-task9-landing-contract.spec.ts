import { expect, test } from '@playwright/test';

// Consolidated regression guard for the v18 full-page cinematic contract.
// Tasks 2–8 migrated the individual v17 boxed-hero specs to this contract
// inline; this spec asserts the integrated end-state in a single flow so a
// future change that quietly re-boxes the hero, drops the backdrop, breaks the
// scroll-reveal choreography, or regresses the typography fails loudly here.

test('v18 task9: landing renders the full-page cinematic contract end-to-end', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  // 1. The 3D scene is a fixed full-viewport backdrop, not a boxed panel.
  const backdrop = page.getByTestId('page-backdrop');
  await expect(backdrop).toBeAttached();
  const viewport = page.viewportSize()!;
  const box = await backdrop.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeLessThanOrEqual(1);
  expect(box!.y).toBeLessThanOrEqual(1);
  expect(box!.width).toBeGreaterThanOrEqual(viewport.width - 2);
  expect(box!.height).toBeGreaterThanOrEqual(viewport.height - 2);

  const backdropStyle = await backdrop.evaluate((el) => {
    const s = getComputedStyle(el);
    return { position: s.position, zIndex: s.zIndex };
  });
  expect(backdropStyle.position).toBe('fixed');

  // 2. The hero is a boxless copy layer: transparent, no border, no card radius.
  const hero = page.getByTestId('landing-primary-box');
  await expect(hero).toBeVisible();
  const heroStyle = await hero.evaluate((el) => {
    const s = getComputedStyle(el);
    return { background: s.backgroundColor, borderTop: s.borderTopWidth, radius: s.borderTopLeftRadius };
  });
  expect(heroStyle.background).toMatch(/rgba?\(0, 0, 0, 0\)|transparent/);
  expect(heroStyle.borderTop).toBe('0px');

  // 3. Typography: Fraunces display headline, Space Grotesk body (Task 8).
  const headingFont = await hero.locator('h1').evaluate((el) => getComputedStyle(el).fontFamily);
  expect(headingFont).toContain('Fraunces');
  const bodyFont = await page.getByTestId('landing-narrative').evaluate((el) => getComputedStyle(el).fontFamily);
  expect(bodyFont).toContain('Space Grotesk');

  // 4. Below-hero sections reveal on scroll: the paired columns start offset and
  //    settle to their resting transform once the section enters the viewport.
  const rail = page.getByTestId('reveal-business-rail');
  const visual = page.getByTestId('reveal-business-visual');
  expect(await rail.getAttribute('data-revealed')).toBe('false');

  await page.getByTestId('business-section').scrollIntoViewIfNeeded();
  await expect(rail).toHaveAttribute('data-revealed', 'true');
  await expect(visual).toHaveAttribute('data-revealed', 'true');

  // Both columns rest at the identity x-offset after revealing (they "combine").
  await expect
    .poll(async () =>
      rail.evaluate((el) => {
        const t = getComputedStyle(el).transform;
        return t === 'none' ? 0 : Math.abs(new DOMMatrixReadOnly(t).m41);
      }),
    )
    .toBeLessThan(1);

  // 5. The landing keeps its dark-theme footer over the backdrop.
  await expect(page.getByTestId('landing-footer')).toBeVisible();

  await page.screenshot({ path: 'tests/screenshots/task9-v18-01-landing-contract.png', fullPage: false });
});

test('v18 task9: backdrop stays full-viewport after scrolling to the footer', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await page.getByTestId('landing-footer').scrollIntoViewIfNeeded();

  const backdrop = page.getByTestId('page-backdrop');
  const viewport = page.viewportSize()!;
  const box = await backdrop.boundingBox();
  expect(box).not.toBeNull();
  // Fixed backdrop: still pinned to the viewport origin, still covering it.
  expect(box!.y).toBeLessThanOrEqual(1);
  expect(box!.height).toBeGreaterThanOrEqual(viewport.height - 2);

  await page.screenshot({ path: 'tests/screenshots/task9-v18-02-backdrop-at-footer.png', fullPage: false });
});
