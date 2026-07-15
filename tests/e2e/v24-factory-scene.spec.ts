import { expect, test, type Page } from '@playwright/test';

import en from '../../locales/en.json' with { type: 'json' };

// v24: WHAT WE DO factory diorama — the landing page's photo sections
// replaced by a scroll-scrubbed Three.js recycling-line scene pinned in a
// full-bleed, full-viewport stage. The factory animates on the clock; scroll
// only drives the camera, surfaced on the canvas as data-factory-progress
// (components/factory-3d/factory-scene.tsx).

// Mirrors the wrapper's scroll normalization (home-factory-scene.tsx
// PINNED_FRACTION against the 320vh .home-factory-track / 100svh stage).
const PINNED_FRACTION = (320 - 100) / 320;

async function scrollToFilmProgress(page: Page, filmProgress: number): Promise<void> {
  await page.evaluate(
    ({ filmProgress, pinnedFraction }) => {
      const track = document.querySelector('[data-testid="home-factory-scene"]');
      if (!track) throw new Error('factory track not found');
      const rect = track.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      // 'instant' overrides the site's html { scroll-behavior: smooth }.
      window.scrollTo({ top: trackTop + filmProgress * pinnedFraction * rect.height, behavior: 'instant' });
    },
    { filmProgress, pinnedFraction: PINNED_FRACTION },
  );
  // The camera rig damp-eases toward the scrubbed value each frame — wait for
  // the eased progress it writes on the canvas to converge, don't sleep.
  await page.waitForFunction(
    (expected) => {
      const canvas = document.querySelector('[data-testid="factory-3d-scene"] canvas');
      if (!canvas) return false;
      const eased = Number.parseFloat(canvas.getAttribute('data-factory-progress') ?? '');
      return Number.isFinite(eased) && Math.abs(eased - expected) < 0.04;
    },
    filmProgress,
    { polling: 100 },
  );
}

test.describe('factory scene scrub', () => {
  test('the canvas mounts and scroll scrubs the camera forward and back', async ({ page }) => {
    await page.goto('/');

    const track = page.getByTestId('home-factory-scene');
    await track.scrollIntoViewIfNeeded();
    await expect(track).toHaveAttribute('data-mode', 'scene');
    await expect(page.locator('[data-testid="factory-3d-scene"] canvas')).toBeVisible();

    // The stage is full-bleed, hero-style: edge-to-edge with no side gutters.
    const viewportWidth = page.viewportSize()!.width;
    const frameBox = await page.locator('.home-factory-frame').boundingBox();
    expect(frameBox).not.toBeNull();
    expect(frameBox!.x).toBeLessThanOrEqual(0);
    expect(frameBox!.width).toBeGreaterThanOrEqual(viewportWidth - 1);

    // Dolly in to the intake beat, on to the extruder close-up, then the
    // export vignette — each converges because scrollToFilmProgress waits on
    // the eased data attribute.
    await scrollToFilmProgress(page, 0.12);
    await page.screenshot({ path: 'tests/screenshots/v24-01-intake.png', fullPage: false });

    await scrollToFilmProgress(page, 0.62);
    await page.screenshot({ path: 'tests/screenshots/v24-02-extruder.png', fullPage: false });

    await scrollToFilmProgress(page, 0.95);
    await page.screenshot({ path: 'tests/screenshots/v24-03-export.png', fullPage: false });

    // Bottom of the runway: the cargo plane's takeoff (data-factory-flight,
    // written by components/factory-3d/machines/cargo-plane.tsx) converges
    // toward 1 as the jet climbs out.
    await scrollToFilmProgress(page, 1.0);
    await page.waitForFunction(
      () => {
        const canvas = document.querySelector('[data-testid="factory-3d-scene"] canvas');
        if (!canvas) return false;
        const flight = Number.parseFloat(canvas.getAttribute('data-factory-flight') ?? '');
        return Number.isFinite(flight) && flight > 0.9;
      },
      undefined,
      { polling: 100 },
    );
    await page.screenshot({ path: 'tests/screenshots/v24-04-takeoff.png', fullPage: false });

    // Scrubbing backwards reverses the camera exactly (scrubbed, not played)
    // — including the flight, which lands back at its parked state.
    await scrollToFilmProgress(page, 0.12);
    await page.waitForFunction(
      () => {
        const canvas = document.querySelector('[data-testid="factory-3d-scene"] canvas');
        if (!canvas) return false;
        const flight = Number.parseFloat(canvas.getAttribute('data-factory-flight') ?? '');
        return Number.isFinite(flight) && flight < 0.05;
      },
      undefined,
      { polling: 100 },
    );
  });

  test('the display title is gone but the section keeps its landmark name', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('#home-about');
    await expect(section).toHaveAttribute('aria-label', en.home.whatWeDo.display);
    await expect(section.locator('.section-heading-display')).toHaveCount(0);

    // The visual wrapper carries the grounded accessible description of the
    // line, scoped away from the caption so its text stays real and readable.
    await expect(page.locator('.home-factory-visual')).toHaveAttribute('aria-label', en.home.whatWeDo.factoryAria);
  });

  test('the storytelling caption names the sequence and explains the scroll', async ({ page }) => {
    await page.goto('/');

    const track = page.getByTestId('home-factory-scene');
    await track.scrollIntoViewIfNeeded();
    await expect(track).toHaveAttribute('data-mode', 'scene');

    await expect(page.locator('.home-factory-caption-label')).toHaveText(en.home.whatWeDo.storytellingLabel);
    await expect(page.locator('.home-factory-caption-hint')).toHaveText(en.home.whatWeDo.storytellingHint);
  });
});

test.describe('factory scene fallbacks', () => {
  test('reduced motion gets the static poster and an unpinned track', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');

    const track = page.getByTestId('home-factory-scene');
    await track.scrollIntoViewIfNeeded();
    await expect(track).toHaveAttribute('data-mode', 'poster');
    await expect(page.getByTestId('home-factory-poster')).toBeVisible();
    await expect(page.locator('[data-testid="factory-3d-scene"]')).toHaveCount(0);

    // Poster mode collapses the scroll track: no multi-viewport runway.
    const trackBox = await track.boundingBox();
    const viewportHeight = page.viewportSize()!.height;
    expect(trackBox).not.toBeNull();
    expect(trackBox!.height).toBeLessThanOrEqual(viewportHeight * 1.5);

    // The title still names the illustration, but the scroll hint is dropped
    // since the poster doesn't animate on scroll.
    await expect(page.locator('.home-factory-caption-label')).toHaveText(en.home.whatWeDo.storytellingLabel);
    await expect(page.locator('.home-factory-caption-hint')).toHaveCount(0);

    await context.close();
  });
});
