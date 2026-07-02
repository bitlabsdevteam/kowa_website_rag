'use client';

import Link from 'next/link';

import { PRODUCT_SHOWCASE_COPY } from '@/lib/product-showcase-copy';
import type { Locale, SiteCopy } from '@/lib/site-copy';

type HomeBusinessGridProps = {
  locale: Locale;
  copy: SiteCopy;
};

/** One representative photograph per business lane (see lib/product-showcase-copy.ts chapters). */
const SEGMENT_IMAGES = ['/images/products/gpps-pellet-lot.jpg', '/images/products/pe-crushing.jpg', '/images/products/mixer-machine.jpg'];

export function HomeBusinessGrid({ locale, copy }: HomeBusinessGridProps) {
  const ui = copy.home.business;
  const showcase = PRODUCT_SHOWCASE_COPY[locale];

  return (
    <section id="business" className="segment-grid" aria-label={copy.business.title} data-testid="business-section">
      <div className="segment-grid-inner">
        <p className="section-heading-display">{ui.display}</p>
        <p className="section-heading-subtitle">{ui.subtitle}</p>

        <div className="segment-cards">
          {showcase.chapters.map((chapter, index) => (
            <Link key={chapter.caption} href={`/business#segment-${index + 1}`} className="segment-card">
              <div className="segment-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element -- decorative segment photo, natural aspect crop */}
                <img src={SEGMENT_IMAGES[index % SEGMENT_IMAGES.length]} alt="" loading="lazy" />
              </div>
              <div className="segment-card-body">
                <h3 className="segment-card-title">{chapter.caption}</h3>
                <span className="segment-card-link">{ui.linkLabel} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
