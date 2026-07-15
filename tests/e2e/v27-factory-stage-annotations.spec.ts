import { expect, test, type Page } from '@playwright/test';

import en from '../../locales/en.json' with { type: 'json' };

// v27: stage annotations for the factory diorama — a small glass card that
// names the machine the tracking spotlight is on and says what it does,
// crossfading as scroll moves the story between beats in either direction
// (components/home/home-factory-scene.tsx + computeFactoryStage in
// components/factory-3d/factory-camera-math.ts).

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
}

test.describe('factory stage annotations', () => {
  test('the annotation card names each machine as scroll moves the spotlight, both directions', async ({ page }) => {
    await page.goto('/');

    const track = page.getByTestId('home-factory-scene');
    await track.scrollIntoViewIfNeeded();
    await expect(track).toHaveAttribute('data-mode', 'scene');

    const annotation = page.getByTestId('home-factory-stage');

    // Forward through the pipeline: crusher → extruder → takeoff.
    await scrollToFilmProgress(page, 0.26);
    await expect(annotation).toHaveAttribute('data-stage', 'crushing');
    await expect(annotation).toContainText(en.home.whatWeDo.stages.crushing.title);
    await expect(annotation).toContainText(en.home.whatWeDo.stages.crushing.note);

    await scrollToFilmProgress(page, 0.62);
    await expect(annotation).toHaveAttribute('data-stage', 'extrusion');
    await expect(annotation).toContainText(en.home.whatWeDo.stages.extrusion.title);

    await scrollToFilmProgress(page, 1.0);
    await expect(annotation).toHaveAttribute('data-stage', 'takeoff');
    await expect(annotation).toContainText(en.home.whatWeDo.stages.takeoff.title);

    // Reverse: scrubbing back re-explains the earlier stations.
    await scrollToFilmProgress(page, 0.4);
    await expect(annotation).toHaveAttribute('data-stage', 'washing');
    await expect(annotation).toContainText(en.home.whatWeDo.stages.washing.title);

    await scrollToFilmProgress(page, 0.12);
    await expect(annotation).toHaveAttribute('data-stage', 'intake');
    await expect(annotation).toContainText(en.home.whatWeDo.stages.intake.title);
  });

  test('poster mode gets printed station labels instead of the live annotation card', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');

    const track = page.getByTestId('home-factory-scene');
    await track.scrollIntoViewIfNeeded();
    await expect(track).toHaveAttribute('data-mode', 'poster');

    // The scroll-synced card only exists for the pinned scene.
    await expect(page.getByTestId('home-factory-stage')).toHaveCount(0);

    // The static poster prints the station names onto the floor band.
    const poster = page.getByTestId('home-factory-poster');
    await expect(poster).toBeVisible();
    for (const label of ['Intake', 'Crushing', 'Washing', 'Extrusion', 'Pelletizing', 'Bagging']) {
      await expect(poster.locator('text', { hasText: label })).toHaveCount(1);
    }

    await context.close();
  });
});
