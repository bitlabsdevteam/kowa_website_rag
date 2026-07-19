'use client';

import { memo, useEffect, useRef, type RefObject } from 'react';

import { FactoryDioramaArt } from '@/components/factory-svg/factory-diorama-art';
import { computeStoryTransform } from '@/components/factory-svg/factory-story-math';

type FactoryStoryProps = {
  /** Normalized film progress (0–1), written by the parent's scroll handler.
   * Read per frame from the rAF loop — same contract as FactoryScene. */
  progressRef: RefObject<number>;
  /** Parent's IntersectionObserver flag: the pan loop only runs on screen. */
  visible: boolean;
};

/** Mobile twin of the WebGL factory flythrough: the poster diorama rendered
 * oversized inside the sticky frame and panned with translate3d as scroll
 * scrubs the film — the same story beats, no WebGL. Transform-only writes go
 * straight to the strip element (no React state per frame); `memo` keeps the
 * SVG subtree out of the parent's per-scroll re-renders. Mirrors the scene's
 * e2e contract by exposing the eased progress as data-factory-story-progress. */
export const FactoryStory = memo(function FactoryStory({ progressRef, visible }: FactoryStoryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return undefined;
    const root = rootRef.current;
    const strip = stripRef.current;
    if (!root || !strip) return undefined;

    /* Frame/strip sizes live in a ref so the rAF loop never touches layout;
       the ResizeObserver refreshes them on rotation and URL-bar resizes. */
    const sizes = { frameW: 0, frameH: 0, stripW: 0, stripH: 0 };
    const measure = () => {
      sizes.frameW = root.clientWidth;
      sizes.frameH = root.clientHeight;
      sizes.stripW = strip.clientWidth;
      sizes.stripH = strip.clientHeight;
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(root);
    observer?.observe(strip);

    let frame = 0;
    let lastTransform = '';
    let lastProgress = '';
    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      const progress = progressRef.current ?? 0;
      const { tx, ty } = computeStoryTransform(
        progress,
        sizes.stripW,
        sizes.stripH,
        sizes.frameW,
        sizes.frameH,
      );
      /* Round to 0.1px and skip unchanged writes so idle frames cost nothing. */
      const transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
      if (transform !== lastTransform) {
        lastTransform = transform;
        strip.style.transform = transform;
      }
      const rounded = progress.toFixed(3);
      if (rounded !== lastProgress) {
        lastProgress = rounded;
        root.setAttribute('data-factory-story-progress', rounded);
      }
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [progressRef, visible]);

  return (
    <div
      className="factory-story"
      data-testid="home-factory-story"
      data-factory-story-progress="0.000"
      ref={rootRef}
    >
      <div className="factory-story-strip" ref={stripRef}>
        {/* data-active drives the same packing-worker CSS loop the poster
            plays, parked while the section is offscreen. */}
        <svg
          className="factory-story-svg"
          viewBox="0 0 1200 675"
          data-active={visible ? 'true' : undefined}
          aria-hidden="true"
        >
          <FactoryDioramaArt />
        </svg>
      </div>
    </div>
  );
});
