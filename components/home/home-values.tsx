'use client';

import Link from 'next/link';

import type { SiteCopy } from '@/lib/site-copy';

type HomeValuesProps = {
  copy: SiteCopy;
};

export function HomeValues({ copy }: HomeValuesProps) {
  const ui = copy.home.values;

  return (
    <section id="home-values" className="values-band" aria-label={ui.display}>
      <div className="values-band-inner">
        <p className="section-heading-display">{ui.display}</p>
        <p className="values-band-subtitle">{ui.subtitle}</p>
        <p className="values-band-statement">{ui.statement}</p>
        <Link href="/business" className="values-band-cta">
          {ui.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
