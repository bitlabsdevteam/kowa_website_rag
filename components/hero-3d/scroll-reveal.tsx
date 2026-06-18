'use client';

import type { ReactNode } from 'react';

import { useScrollReveal } from './use-scroll-reveal';

type RevealVariant = 'fade-up' | 'fly-left' | 'fly-right';

interface ScrollRevealProps {
  variant?: RevealVariant;
  className?: string;
  /** Forwarded to the wrapper for Playwright targeting. */
  testId?: string;
  children: ReactNode;
}

/**
 * Wraps a section in a scroll-triggered reveal. The element starts offset and
 * faded (per `variant`) and settles to its resting pose the first time it
 * enters the viewport. Pair `fly-left` and `fly-right` siblings so they fly in
 * from opposite sides and combine at center.
 */
export function ScrollReveal({ variant = 'fade-up', className, testId, children }: ScrollRevealProps) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const classes = ['reveal-' + variant, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} data-revealed={revealed} data-testid={testId}>
      {children}
    </div>
  );
}
