'use client';

import { useRef, type ReactNode } from 'react';

import { useScrollProgressStyleVar } from '@/components/hero-3d/use-scroll-progress';

type HeroParallaxStageProps = {
  children: ReactNode;
};

/** Measures the hero's scroll-through once and publishes it as --hero-yard-drift
 * (0→1 over one hero-height of scroll) to every descendant. The photo, scrim and
 * copy each consume it at their own rate in CSS, so the three planes drift at
 * distinct speeds off a single scroll listener. Written directly to the DOM via
 * ref (not React state) so scrolling never forces a React commit — see
 * useScrollProgressStyleVar. Reduced motion pins progress at 0. */
export function HeroParallaxStage({ children }: HeroParallaxStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  useScrollProgressStyleVar(stageRef, stageRef, '--hero-yard-drift');

  return (
    <div ref={stageRef} className="hero-parallax-stage" data-testid="hero-parallax-stage">
      {children}
    </div>
  );
}
