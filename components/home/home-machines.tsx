'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

import type { CardItem } from '@/components/ui/card-fan-carousel';
import { HOME_MACHINE_CAROUSEL } from '@/lib/machine-catalog';
import type { SiteCopy } from '@/lib/site-copy';

type HomeMachinesProps = {
  copy: SiteCopy;
};

// Same lazy-load pattern as app/products/page.tsx — GSAP only runs client-side.
const CardFanCarousel = dynamic(() => import('@/components/ui/card-fan-carousel'), {
  ssr: false,
  loading: () => <div className="card-fan-loading" aria-hidden="true" />,
});

export function HomeMachines({ copy }: HomeMachinesProps) {
  const ui = copy.home.machines;

  const cards = useMemo<CardItem[]>(
    () =>
      HOME_MACHINE_CAROUSEL.map((machine, index) => ({
        imgUrl: machine.src,
        alt: ui.slides[index] ?? machine.legacyLabel,
        title: ui.slides[index] ?? machine.legacyLabel,
      })),
    [ui.slides],
  );

  return (
    <section id="home-machines" className="home-machines" aria-label={ui.display}>
      <div className="home-machines-inner">
        <p className="section-heading-display">{ui.display}</p>
        <p className="section-heading-subtitle">{ui.subtitle}</p>

        <CardFanCarousel cards={cards} prevLabel={copy.products.carousel.prevAriaLabel} nextLabel={copy.products.carousel.nextAriaLabel} />
      </div>
    </section>
  );
}
