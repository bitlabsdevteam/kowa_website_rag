'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { computeFactoryStage } from '@/components/factory-3d/factory-camera-math';
import { FactoryPoster } from '@/components/factory-3d/factory-poster';
import { supportsHero3DScene } from '@/components/hero-3d/hero-fallback';
import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';
import type { SiteCopy } from '@/lib/site-copy';

const FactoryScene = dynamic(() => import('@/components/factory-3d/factory-scene'), { ssr: false });

type HomeFactorySceneProps = {
  copy: SiteCopy;
};

/** The sticky full-viewport stage unpins once (track − stage) has scrolled
 * past: (320vh − 100vh) / 320vh (see .home-factory-track /
 * .home-factory-frame in globals.css). The film completes exactly there so
 * the final pull-back holds while the stage releases. */
const PINNED_FRACTION = (320 - 100) / 320;

/** Full-bleed interlude between the OUR BUSINESS and PRODUCTS bands: a
 * scroll-scrubbed cinematic camera flying through the always-running
 * recycling-line diorama (components/factory-3d).
 * Mirrors hero-circulation-visual.tsx's mount contract: the WebGL scene only
 * mounts on wide viewports with WebGL and no reduced-motion preference —
 * everyone else gets the static FactoryPoster, and the scroll track collapses
 * to a plain figure. An IntersectionObserver parks the render loop while the
 * section is offscreen. The scene/poster sits in its own role="img" wrapper
 * (home-factory-visual) so the "Storytelling" caption stays real, readable
 * text for screen readers instead of being swallowed by the image's
 * accessible name. */
export function HomeFactoryScene({ copy }: HomeFactorySceneProps) {
  const ui = copy.home.whatWeDo;

  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(trackRef);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = Math.min(1, progress / PINNED_FRACTION);
  }, [progress]);

  /* Which production stage the spotlight is explaining right now — drives the
     annotation card. Raw (undamped) film progress is fine here: the beam's
     damped sweep converges on the same beat within a few hundred ms. */
  const stage = computeFactoryStage(Math.min(1, progress / PINNED_FRACTION));

  const [canRender3D, setCanRender3D] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setCanRender3D(window.matchMedia('(min-width: 900px)').matches && supportsHero3DScene());
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setVisible(entry.isIntersecting);
        }
      },
      { rootMargin: '25%' },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="home-factory-track"
      ref={trackRef}
      data-testid="home-factory-scene"
      data-mode={canRender3D ? 'scene' : 'poster'}
    >
      <div className="home-factory-frame">
        <div className="home-factory-visual" role="img" aria-label={ui.factoryAria}>
          {canRender3D ? <FactoryScene progressRef={progressRef} visible={visible} /> : <FactoryPoster />}
        </div>
        <div className="home-factory-caption">
          <p className="home-factory-caption-label">{ui.storytellingLabel}</p>
          {/* Only the pinned scene is actually scroll-driven — the poster
              fallback is a static image, so scrolling it does nothing. */}
          {canRender3D ? <p className="home-factory-caption-hint">{ui.storytellingHint}</p> : null}
        </div>
        {/* Stage annotation: names the machine the tracking spotlight is on
            and says what it does, crossfading as the story beat changes. The
            key remounts the card per stage so the opacity-only fade-in
            replays (small compositor-layer card — the full-viewport canvas
            itself never animates raster-bound properties). Scene mode only:
            the static poster has its own printed labels. */}
        {canRender3D ? (
          <div
            className="home-factory-annotation"
            data-testid="home-factory-stage"
            data-stage={stage}
            key={stage}
          >
            <p className="home-factory-annotation-title">{ui.stages[stage].title}</p>
            <p className="home-factory-annotation-note">{ui.stages[stage].note}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
