'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { HeroFallback, supportsHero3DScene } from '@/components/hero-3d/hero-fallback';
import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';
import type { SiteCopy } from '@/lib/site-copy';

const Hero3DScene = dynamic(() => import('@/components/hero-3d/hero-3d-scene'), { ssr: false });

type HeroCirculationVisualProps = {
  copy: SiteCopy;
};

/** The hero's media pane: the resource-circulation 3D scene (stage rings +
 * flow stream) as the backdrop, with a slowly rotating wireframe globe —
 * dashed outer ring plus meridian/latitude hairlines — and two glowing pulse
 * dots orbiting it. Image-free; the globe reads as Kowa's global trade loop.
 * The 3D canvas mounts only on wide viewports with WebGL and no reduced-motion
 * preference; everyone else gets the static poster. */
export function HeroCirculationVisual({ copy }: HeroCirculationVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    setCanRender3D(window.matchMedia('(min-width: 768px)').matches && supportsHero3DScene());
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-circulation"
      data-testid="hero-circulation"
      role="img"
      aria-label={copy.hero.visualAria}
      style={{ '--hero-progress': progress } as React.CSSProperties}
    >
      {canRender3D ? <Hero3DScene progressRef={progressRef} cameraMode="hero" /> : <HeroFallback />}

      <svg className="hero-circulation-arc" viewBox="0 0 100 100" aria-hidden="true">
        {/* Outer ring — dashed, keeps the orbit radius the pulse dots track. */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.55"
          strokeDasharray="2.5 4.5"
          strokeLinecap="round"
        />
        {/* Wireframe globe: meridians + latitudes as faint hairlines. */}
        <g className="hero-circulation-arc-grid" fill="none" stroke="currentColor" strokeWidth="0.4">
          <circle cx="50" cy="50" r="44" />
          <ellipse cx="50" cy="50" rx="15" ry="44" />
          <ellipse cx="50" cy="50" rx="30" ry="44" />
          <ellipse cx="50" cy="50" rx="44" ry="15" />
          <ellipse cx="50" cy="50" rx="44" ry="30" />
          <line x1="6" y1="50" x2="94" y2="50" />
          <line x1="50" y1="6" x2="50" y2="94" />
        </g>
      </svg>

      <span className="hero-circulation-pulse hero-circulation-pulse--1" aria-hidden="true">
        <span className="hero-circulation-pulse-dot" />
      </span>
      <span className="hero-circulation-pulse hero-circulation-pulse--2" aria-hidden="true">
        <span className="hero-circulation-pulse-dot" />
      </span>
    </div>
  );
}
