'use client';

import { useRef, type ReactNode } from 'react';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { HomeBusinessGrid } from '@/components/home/home-business-grid';
import { HomeBusinessStory } from '@/components/home/home-business-story';
import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';
import type { Locale, SiteCopy } from '@/lib/site-copy';

type HomeBusinessParallaxProps = {
  locale: Locale;
  copy: SiteCopy;
};

type BandProps = {
  variant: 'story' | 'products';
  ghost: string;
  testId: string;
  children: ReactNode;
};

/** One self-contained parallax band: it measures its own scroll progress and
 * exposes `--biz-drift` (-1 → 1) to just its subtree, so its ghost display
 * word and any depth-staggered content drift on their own timeline as the band
 * crosses the viewport. Two of these — the narrative story and the products
 * grid — stack as visibly separate sections instead of one shared stage.
 * Reduced motion pins progress at 0 and the CSS resets every transform. */
function Band({ variant, ghost, testId, children }: BandProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(wrapRef);
  const drift = (progress - 0.5) * 2;

  return (
    <div
      ref={wrapRef}
      className={`home-business-band home-business-band--${variant}`}
      data-testid={testId}
      style={{ '--biz-drift': drift } as React.CSSProperties}
    >
      <p className="home-business-band-ghost" aria-hidden="true">
        {ghost}
      </p>
      {children}
    </div>
  );
}

/** The OUR BUSINESS narrative and the PRODUCTS grid, each on its own parallax
 * band so they read as two separate, independently-drifting sections. */
export function HomeBusinessParallax({ locale, copy }: HomeBusinessParallaxProps) {
  return (
    <div className="home-business-parallax" data-testid="home-business-parallax">
      <Band variant="story" ghost={copy.companyProfile.introLabel} testId="home-business-band-story">
        <ScrollReveal variant="fade-up" testId="reveal-home-business-story">
          <HomeBusinessStory copy={copy} />
        </ScrollReveal>
      </Band>

      <Band variant="products" ghost={copy.home.business.display} testId="home-business-band-products">
        <ScrollReveal variant="fade-up" testId="reveal-business-head">
          <HomeBusinessGrid locale={locale} copy={copy} />
        </ScrollReveal>
      </Band>
    </div>
  );
}
