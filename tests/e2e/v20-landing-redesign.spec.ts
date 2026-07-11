import { expect, test } from '@playwright/test';

import en from '../../locales/en.json' with { type: 'json' };

// v20: landing redesign — hero circulation visual, OUR BUSINESS 3D parallax,
// WHAT WE DO sticky-media split.

test.describe('hero circulation visual', () => {
  test('renders the image-free 3D scene (or fallback) with the wireframe globe', async ({ page }) => {
    await page.goto('/');

    const visual = page.locator('[data-testid="hero-circulation"]');
    await expect(visual).toBeVisible();
    await expect(visual).toHaveAttribute('aria-label', en.hero.visualAria);

    // Scene or static poster, exactly one of the two.
    const scene = visual.locator('[data-testid="hero-3d-scene"], [data-testid="hero-3d-fallback"]');
    await expect(scene.first()).toBeAttached({ timeout: 30000 });

    // The redesigned visual is image-free — no photography inside the pane.
    await expect(visual.locator('img')).toHaveCount(0);

    // The wireframe globe: dashed outer ring plus meridian/latitude hairlines,
    // and no text labels.
    await expect(visual.locator('.hero-circulation-arc')).toHaveCount(1);
    await expect(visual.locator('.hero-circulation-arc-grid')).toHaveCount(1);
    await expect(visual.locator('.hero-circulation-node-label')).toHaveCount(0);

    // Two pulse beads orbit the arc.
    await expect(visual.locator('.hero-circulation-pulse')).toHaveCount(2);

    await page.waitForTimeout(800);
    await page.screenshot({ path: 'tests/screenshots/v20-01-hero-circulation.png', fullPage: false });
  });

  test('the hero camera rig advances as the page scrolls', async ({ page }) => {
    await page.goto('/');

    const canvas = page.locator('[data-testid="hero-circulation"] [data-testid="hero-3d-scene"] canvas');
    await expect(canvas).toBeVisible({ timeout: 30000 });

    await page.waitForTimeout(700);
    const restProgress = Number(await canvas.getAttribute('data-hero-progress'));
    expect(restProgress).toBeLessThan(0.15);

    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' as ScrollBehavior }));
    await expect
      .poll(async () => Number(await canvas.getAttribute('data-hero-progress')), { timeout: 5000 })
      .toBeGreaterThan(0.3);
  });

  test('reduced motion renders the static poster instead of the canvas', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');

    const visual = page.locator('[data-testid="hero-circulation"]');
    await expect(visual.locator('[data-testid="hero-3d-fallback"]')).toBeAttached();
    await expect(visual.locator('[data-testid="hero-3d-scene"]')).toHaveCount(0);

    await context.close();
  });
});

test.describe('our business / products parallax', () => {
  test('cards sit level while the ghost watermark drifts mid-scroll', async ({ page }) => {
    await page.goto('/');

    const wrapper = page.locator('[data-testid="home-business-parallax"]');
    await expect(wrapper).toBeVisible();

    // Two separate bands, each with its own drifting ghost display word.
    await expect(page.locator('[data-testid="home-business-band-story"] .home-business-band-ghost')).toHaveText(
      en.companyProfile.introLabel,
    );
    await expect(page.locator('[data-testid="home-business-band-products"] .home-business-band-ghost')).toHaveText(
      en.home.business.display,
    );
    // The grid heading now reads PRODUCTS.
    await expect(page.locator('#business .section-heading-display')).toHaveText(en.home.business.display);

    const ghost = page.locator('[data-testid="home-business-band-products"] .home-business-band-ghost');

    // Scroll until the grid is mid-viewport so --biz-drift is non-zero.
    await page.locator('#business').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);

    // The ghost watermark still carries the band's scroll parallax…
    const ghostBefore = await ghost.evaluate((el) => getComputedStyle(el).transform);
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);
    const ghostAfter = await ghost.evaluate((el) => getComputedStyle(el).transform);
    expect(ghostAfter).not.toBe(ghostBefore);

    // …but the cards themselves sit level and equal — no per-card 3D transform.
    const cardTransform = await page
      .locator('.segment-card')
      .first()
      .evaluate((element) => getComputedStyle(element).transform);
    expect(cardTransform).toBe('none');

    await page.screenshot({ path: 'tests/screenshots/v20-02-business-parallax.png', fullPage: false });
  });

  test('reduced motion pins the ghost watermark flat', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');

    await page.locator('#business').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Cards stay level (they never carry a transform now)…
    const cardTransform = await page
      .locator('.segment-card')
      .first()
      .evaluate((element) => getComputedStyle(element).transform);
    expect(cardTransform).toBe('none');

    // …and the ghost watermark no longer drifts with scroll.
    const ghost = page.locator('[data-testid="home-business-band-products"] .home-business-band-ghost');
    const ghostBefore = await ghost.evaluate((el) => getComputedStyle(el).transform);
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);
    const ghostAfter = await ghost.evaluate((el) => getComputedStyle(el).transform);
    expect(ghostAfter).toBe(ghostBefore);

    await context.close();
  });
});

test.describe('what we do sticky-media split', () => {
  test('hovering a row activates its media layer', async ({ page }) => {
    await page.goto('/');
    await page.locator('#home-about').scrollIntoViewIfNeeded();

    const media = page.locator('.home-about-media');
    await expect(media).toBeVisible();

    await page.locator('.business-line-row[data-category="timber"]').hover();
    await expect(page.locator('.home-about-media-layer[data-category="timber"]')).toHaveAttribute(
      'data-active',
      'true',
    );
    await expect(page.locator('.business-line-row[data-category="timber"]')).toHaveAttribute('data-active', 'true');

    await page.screenshot({ path: 'tests/screenshots/v20-03-what-we-do.png', fullPage: false });
  });

  test('all five rows keep their product links; media panel hides on mobile', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');

    await expect(page.locator('.home-about-media')).toBeHidden();

    const rows = page.locator('.business-line-row');
    await expect(rows).toHaveCount(5);
    for (const category of ['plastics', 'general-goods', 'foods', 'ffe', 'timber']) {
      await expect(page.locator(`.business-line-row[data-category="${category}"]`)).toHaveAttribute(
        'href',
        `/products?category=${category}`,
      );
    }

    await context.close();
  });
});
