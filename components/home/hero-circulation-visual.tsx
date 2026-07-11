'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { HeroFallback, supportsHero3DScene } from '@/components/hero-3d/hero-fallback';
import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';
import type { SiteCopy } from '@/lib/site-copy';

const Hero3DScene = dynamic(() => import('@/components/hero-3d/hero-3d-scene'), { ssr: false });

/** The four verified circulation stages (copy.business.flowPhases), staged as
 * glass marker nodes around the rotating arc — no photography. Each node sits
 * at a clock position on the arc (12 / 3 / 6 / 9) and drifts at its own depth
 * off the hero scroll progress, echoing material moving "back to resources,
 * forward to the future": collection → sorting → regeneration → export. */
const FLOW_NODES = [
  { phaseIndex: 0, depth: 1 },
  { phaseIndex: 1, depth: 0.7 },
  { phaseIndex: 2, depth: 0.5 },
  { phaseIndex: 3, depth: 0.85 },
] as const;

type HeroCirculationVisualProps = {
  copy: SiteCopy;
};

/** The hero's media pane: the resource-circulation 3D scene (stage rings +
 * flow stream) as the backdrop, with four labelled stage nodes and two
 * glowing pulse dots arranged along an animated dashed arc — image-free. The
 * 3D canvas mounts only on wide viewports with WebGL and no reduced-motion
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
      </svg>

      <span className="hero-circulation-pulse hero-circulation-pulse--1" aria-hidden="true">
        <span className="hero-circulation-pulse-dot" />
      </span>
      <span className="hero-circulation-pulse hero-circulation-pulse--2" aria-hidden="true">
        <span className="hero-circulation-pulse-dot" />
      </span>

      {FLOW_NODES.map((node, index) => (
        <span
          key={node.phaseIndex}
          className={`hero-circulation-node hero-circulation-node--${index + 1}`}
          style={{ '--node-depth': node.depth } as React.CSSProperties}
          aria-hidden="true"
        >
          <span className="hero-circulation-node-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="hero-circulation-node-label">
            {copy.business.flowPhases[node.phaseIndex]?.nodeLabel}
          </span>
        </span>
      ))}
    </div>
  );
}
