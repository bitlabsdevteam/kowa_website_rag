'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export interface ScrollRevealOptions {
  /** Fraction of the element that must be visible before it reveals (0–1). */
  threshold?: number;
  /** Margin around the viewport root, e.g. shrink the trigger box from the bottom. */
  rootMargin?: string;
}

/**
 * Reveals an element the first time it scrolls into view. Returns a ref to
 * attach to the target and a `revealed` boolean for the `data-revealed`
 * attribute that the CSS reveal variants key off of.
 *
 * Fires once: the observer disconnects after the first intersection so the
 * resting state is permanent and never re-animates on scroll-back. Visitors
 * who prefer reduced motion are revealed immediately, before any observer is
 * created, so content is present without animation.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {},
): { ref: RefObject<T | null>; revealed: boolean } {
  const { threshold = 0.2, rootMargin = '0px 0px -10% 0px' } = options;
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return undefined;
    }

    const element = ref.current;
    if (!element) return undefined;

    // Without IntersectionObserver support, reveal eagerly rather than hide.
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, revealed };
}
