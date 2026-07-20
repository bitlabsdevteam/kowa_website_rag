'use client';

import { useRef, type ReactNode } from 'react';

import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';

type HeroParallaxStageProps = {
  children: ReactNode;
};

/** Measures the hero's scroll-through once and publishes it as --hero-yard-drift
 * (0→1 over one hero-height of scroll) to every descendant. The photo, scrim and
 * copy each consume it at their own rate in CSS, so the three planes drift at
 * distinct speeds off a single scroll listener. Reduced motion pins progress at
 * 0 via useScrollProgress itself. */
export function HeroParallaxStage({ children }: HeroParallaxStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(stageRef);

  return (
    <div
      ref={stageRef}
      className="hero-parallax-stage"
      data-testid="hero-parallax-stage"
      style={{ '--hero-yard-drift': progress } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
