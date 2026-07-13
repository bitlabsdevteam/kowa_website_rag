import { expect, test } from '@playwright/test';

import en from '../../locales/en.json' with { type: 'json' };

// v20/v22: landing — full-bleed container-yard photo hero, OUR BUSINESS
// parallax bands, WHAT WE DO sticky-media split.

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
