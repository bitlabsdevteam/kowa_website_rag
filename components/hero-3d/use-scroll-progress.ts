'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Normalizes how far an element has been scrolled through: 0 while its top is
 * at or below the viewport top, 1 once a full element height has scrolled by.
 */
export function computeScrollProgress(top: number, height: number): number {
  if (!Number.isFinite(top) || !Number.isFinite(height) || height <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, -top / height));
}

/**
 * Tracks scroll progress (0..1) for the element in `targetRef`, throttled to
 * one measurement per animation frame. Stays at 0 when the visitor prefers
 * reduced motion, so parallax consumers render their static state.
 */
export function useScrollProgress(targetRef: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      setProgress(0);
      return undefined;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;
      const element = targetRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setProgress(computeScrollProgress(rect.top, rect.height));
    };

    const requestMeasure = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', requestMeasure, { passive: true });
    window.addEventListener('resize', requestMeasure, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestMeasure);
      window.removeEventListener('resize', requestMeasure);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [targetRef]);

  return progress;
}
