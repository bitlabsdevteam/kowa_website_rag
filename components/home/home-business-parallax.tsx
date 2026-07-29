'use client';

import { useRef, type ReactNode } from 'react';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { HomeBusinessGrid } from '@/components/home/home-business-grid';
import { HomeBusinessStory } from '@/components/home/home-business-story';
import { HomeFactoryScene } from '@/components/home/home-factory-scene';
import { useScrollProgressStyleVar } from '@/components/hero-3d/use-scroll-progress';
import type { Locale, SiteCopy } from '@/lib/site-copy';

const toDrift = (progress: number) => (progress - 0.5) * 2;

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
  useScrollProgressStyleVar(wrapRef, wrapRef, '--biz-drift', toDrift);

  return (
    <div ref={wrapRef} className={`home-business-band home-business-band--${variant}`} data-testid={testId}>
      <p className="home-business-band-ghost" aria-hidden="true">
        {ghost}
      </p>
      {children}
    </div>
  );
}

/** The OUR BUSINESS narrative and the PRODUCTS grid, each on its own parallax
 * band so they read as two separate, independently-drifting sections. The
 * scroll-scrubbed factory diorama sits between them as a full-bleed
 * interlude — outside both bands (its 320vh track would wreck their
 * progress-based drift) and never inside a ScrollReveal (a track taller than
 * ~5 viewports can't hit the observer's 0.2 threshold and would stay
 * invisible). */
export function HomeBusinessParallax({ locale, copy }: HomeBusinessParallaxProps) {
  return (
    <div className="home-business-parallax" data-testid="home-business-parallax">
      <Band variant="story" ghost={copy.companyProfile.introLabel} testId="home-business-band-story">
        <ScrollReveal variant="fade-up" testId="reveal-home-business-story">
          <HomeBusinessStory copy={copy} />
        </ScrollReveal>
      </Band>

      <HomeFactoryScene copy={copy} />

      <Band variant="products" ghost={copy.home.business.display} testId="home-business-band-products">
        <ScrollReveal variant="fade-up" testId="reveal-business-head">
          <HomeBusinessGrid locale={locale} copy={copy} />
        </ScrollReveal>
      </Band>
    </div>
  );
}
