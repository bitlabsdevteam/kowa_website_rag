import { expect, test } from '@playwright/test';

import en from '../../locales/en.json' with { type: 'json' };

// v20/v22: landing — full-bleed container-yard photo hero, OUR BUSINESS
// parallax bands, WHAT WE DO business-line rows (the section's media is the
// v24 factory scene, covered in v24-factory-scene.spec.ts).

test.describe('hero container-yard photo backdrop', () => {
  test('the yard photo fills the hero behind light-on-photo copy', async ({ page }) => {
    await page.goto('/');

    const hero = page.getByTestId('landing-primary-box');
    await expect(hero).toBeVisible();

    // Full-bleed variant: the media pane is the hero backdrop, not a side pane.
    await expect(hero).toHaveClass(/hero-section--full-bleed/);

    const yard = page.getByTestId('hero-yard');
    await expect(yard).toBeVisible();
    const photo = yard.locator('img.hero-yard-photo');
    await expect(photo).toHaveAttribute('src', /container-yard\.jpg/);
    await expect(photo).toHaveJSProperty('complete', true);

    // The forest scrim grades the photo so the headline stays legible.
    await expect(yard.locator('.hero-yard-scrim')).toHaveCount(1);

    // The old circulation globe is gone from the hero.
    await expect(hero.locator('[data-testid="hero-circulation"]')).toHaveCount(0);

    // Light-on-photo copy: white headline with the soft leaf-green accent line.
    const heading = hero.locator('h1');
    await expect(heading).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(heading.locator('.hero-section-title-accent')).toHaveCSS('color', 'rgb(163, 217, 189)');

    await page.waitForTimeout(800);
    await page.screenshot({ path: 'tests/screenshots/v22-01-hero-yard.png', fullPage: false });
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

    // The ghost watermark still carries the band's scroll parallax… Poll
    // rather than sleeping a fixed interval: the WebGL factory interlude just
    // above this band lazy-mounts around this scroll position, and its first
    // SwiftShader frame can stall the band's rAF measure well past any fixed
    // wait.
    const ghostBefore = await ghost.evaluate((el) => getComputedStyle(el).transform);
    await page.evaluate(() => window.scrollBy(0, 200));
    await expect
      .poll(() => ghost.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(ghostBefore);

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

test.describe('what we do business-line rows', () => {
  test('hovering a row highlights it', async ({ page }) => {
    await page.goto('/');
    await page.locator('.business-lines').scrollIntoViewIfNeeded();

    await page.locator('.business-line-row[data-category="timber"]').hover();
    await expect(page.locator('.business-line-row[data-category="timber"]')).toHaveAttribute('data-active', 'true');

    await page.screenshot({ path: 'tests/screenshots/v20-03-what-we-do.png', fullPage: false });
  });

  test('all five rows keep their product links; mobile gets the poster figure', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');

    // Narrow viewports get the static factory poster instead of the canvas.
    await page.getByTestId('home-factory-scene').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('home-factory-scene')).toHaveAttribute('data-mode', 'poster');
    await expect(page.getByTestId('home-factory-poster')).toBeVisible();

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
