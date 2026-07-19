import { expect, test, type Page } from '@playwright/test';

import en from '../../locales/en.json' with { type: 'json' };

// v28: mobile SVG storytelling — on narrow viewports the factory interlude
// pins a scroll-panned SVG filmstrip instead of the WebGL scene
// (components/factory-svg/factory-story.tsx). Scroll scrubs the pan through
// the same story beats, surfaced as data-factory-story-progress, with the
// same stage annotation cards. Runs under the mobile-chromium (Pixel 7)
// Playwright project only.

/** Scrolls so the film reaches the given progress, computing the runway from
 * the live track/frame boxes (the runway is measured at runtime in
 * home-factory-scene.tsx, so the spec never hardcodes svh heights). */
async function scrollToFilmProgress(page: Page, filmProgress: number): Promise<void> {
  await page.evaluate(
    ({ filmProgress }) => {
      const track = document.querySelector('[data-testid="home-factory-scene"]');
      const frame = document.querySelector('.home-factory-frame');
      if (!track || !frame) throw new Error('factory track/frame not found');
      const rect = track.getBoundingClientRect();
      const pinnedFraction = (rect.height - frame.getBoundingClientRect().height) / rect.height;
      const trackTop = window.scrollY + rect.top;
      // 'instant' overrides the site's html { scroll-behavior: smooth }.
      window.scrollTo({ top: trackTop + filmProgress * pinnedFraction * rect.height, behavior: 'instant' });
    },
    { filmProgress },
  );
  await page.waitForFunction(
    (expected) => {
      const story = document.querySelector('[data-testid="home-factory-story"]');
      if (!story) return false;
      const progress = Number.parseFloat(story.getAttribute('data-factory-story-progress') ?? '');
      return Number.isFinite(progress) && Math.abs(progress - expected) < 0.02;
    },
    filmProgress,
    { polling: 100 },
  );
}

async function readStripTranslateX(page: Page): Promise<number> {
  return page.evaluate(() => {
    const strip = document.querySelector('.factory-story-strip');
    if (!strip) throw new Error('story strip not found');
    const transform = getComputedStyle(strip).transform;
    if (transform === 'none') return 0;
    const matrix = new DOMMatrixReadOnly(transform);
    return matrix.m41;
  });
}

test.describe('mobile factory story', () => {
  test('narrow viewports mount the SVG story with a pinned track and no WebGL', async ({ page }) => {
    await page.goto('/');

    const track = page.getByTestId('home-factory-scene');
    await expect(track).toHaveAttribute('data-mode', 'story');
    await expect(page.getByTestId('home-factory-story')).toBeVisible();
    await expect(page.locator('[data-testid="factory-3d-scene"]')).toHaveCount(0);
    await expect(page.locator('canvas')).toHaveCount(0);

    // The pinned runway spans multiple viewports and the frame is full-bleed.
    const viewport = page.viewportSize()!;
    const trackBox = await track.boundingBox();
    expect(trackBox).not.toBeNull();
    expect(trackBox!.height).toBeGreaterThan(viewport.height * 2);
    const frameBox = await page.locator('.home-factory-frame').boundingBox();
    expect(frameBox).not.toBeNull();
    expect(frameBox!.width).toBeGreaterThanOrEqual(viewport.width - 1);

    // The scroll hint shows: the story is scroll-driven, unlike the poster.
    await track.scrollIntoViewIfNeeded();
    await expect(page.locator('.home-factory-caption-hint')).toHaveText(en.home.whatWeDo.storytellingHint);
  });

  test('scroll scrubs the filmstrip pan forward and back', async ({ page }) => {
    await page.goto('/');

    const track = page.getByTestId('home-factory-scene');
    await track.scrollIntoViewIfNeeded();
    await expect(track).toHaveAttribute('data-mode', 'story');

    // Establishing wide shot, then the focus dollies back to the intake end
    // of the line before walking left-to-right through the machines — so the
    // strip's translateX must strictly decrease from crusher to pelletizer.
    await scrollToFilmProgress(page, 0.0);
    const txStart = await readStripTranslateX(page);
    await page.screenshot({ path: 'tests/screenshots/v28-01-overview.png', fullPage: false });
    await scrollToFilmProgress(page, 0.26);
    const txCrusher = await readStripTranslateX(page);
    await page.screenshot({ path: 'tests/screenshots/v28-02-crusher.png', fullPage: false });

    await scrollToFilmProgress(page, 0.76);
    const txPelletizer = await readStripTranslateX(page);
    await page.screenshot({ path: 'tests/screenshots/v28-03-pelletizer.png', fullPage: false });

    expect(txPelletizer).toBeLessThan(txCrusher);

    // The film completes exactly at the unpin.
    await scrollToFilmProgress(page, 1.0);
    await page.screenshot({ path: 'tests/screenshots/v28-04-takeoff.png', fullPage: false });

    // Scrubbing backwards reverses the pan toward its establishing framing.
    await scrollToFilmProgress(page, 0.26);
    const txBack = await readStripTranslateX(page);
    expect(Math.abs(txBack - txCrusher)).toBeLessThan(2);
    expect(txBack).toBeGreaterThan(txPelletizer);

    // Sanity: the pan actually moved from the establishing shot at some point.
    expect(Math.abs(txStart - txPelletizer)).toBeGreaterThan(10);
  });

  test('the annotation card names the machines through the mobile film', async ({ page }) => {
    await page.goto('/');

    const track = page.getByTestId('home-factory-scene');
    await track.scrollIntoViewIfNeeded();
    await expect(track).toHaveAttribute('data-mode', 'story');

    const annotation = page.getByTestId('home-factory-stage');

    await scrollToFilmProgress(page, 0.12);
    await expect(annotation).toHaveAttribute('data-stage', 'intake');
    await expect(annotation).toContainText(en.home.whatWeDo.stages.intake.title);

    await scrollToFilmProgress(page, 0.62);
    await expect(annotation).toHaveAttribute('data-stage', 'extrusion');
    await expect(annotation).toContainText(en.home.whatWeDo.stages.extrusion.title);

    await scrollToFilmProgress(page, 1.0);
    await expect(annotation).toHaveAttribute('data-stage', 'takeoff');
    await expect(annotation).toContainText(en.home.whatWeDo.stages.takeoff.title);

    // Reverse scrub re-explains an earlier station, and the crossfade never
    // strands a ghost card.
    await scrollToFilmProgress(page, 0.4);
    await expect(annotation).toHaveAttribute('data-stage', 'washing');
    await expect(page.locator('.home-factory-annotation--leaving')).toHaveCount(0);
    await expect(page.locator('.home-factory-annotation')).toHaveCount(1);
  });

  test('reduced motion on mobile keeps the static poster and an unpinned track', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');

    const track = page.getByTestId('home-factory-scene');
    await track.scrollIntoViewIfNeeded();
    await expect(track).toHaveAttribute('data-mode', 'poster');
    await expect(page.getByTestId('home-factory-poster')).toBeVisible();
    await expect(page.getByTestId('home-factory-story')).toHaveCount(0);

    // Poster mode collapses the scroll track: no multi-viewport runway, and
    // the frame flows unpinned.
    const trackBox = await track.boundingBox();
    const viewportHeight = page.viewportSize()!.height;
    expect(trackBox).not.toBeNull();
    expect(trackBox!.height).toBeLessThanOrEqual(viewportHeight * 1.5);
    const framePosition = await page
      .locator('.home-factory-frame')
      .evaluate((el) => getComputedStyle(el).position);
    expect(framePosition).toBe('relative');

    await context.close();
  });
});
