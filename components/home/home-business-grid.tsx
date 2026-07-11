'use client';

import Link from 'next/link';

import { PRODUCT_TOP_CATEGORY_ORDER, TOP_CATEGORY_IMAGE, type ProductTopCategory } from '@/lib/product-media';
import type { Locale, SiteCopy } from '@/lib/site-copy';

type HomeBusinessGridProps = {
  locale: Locale;
  copy: SiteCopy;
};

/** camelCase key in copy.products.categories.tabs for each top-category id. */
const CATEGORY_TAB_COPY_KEY: Record<ProductTopCategory, 'plastics' | 'generalGoods' | 'foods' | 'ffe' | 'timber'> = {
  plastics: 'plastics',
  'general-goods': 'generalGoods',
  foods: 'foods',
  ffe: 'ffe',
  timber: 'timber',
};

/** Per-card parallax depth (px of translateZ per unit drift) — alternating
 * signs so neighbouring cards counter-drift and the row reads as a 3D relief
 * rather than a flat sheet sliding together. */
const CARD_DEPTHS = [46, -28, 64, -36, 52];

export function HomeBusinessGrid({ locale, copy }: HomeBusinessGridProps) {
  const ui = copy.home.business;
  const tabs = copy.products.categories.tabs;

  return (
    <section id="business" className="segment-grid" aria-label={copy.business.title} data-testid="business-section">
      <div className="segment-grid-inner">
        <p className="section-heading-display">{ui.display}</p>
        <p className="section-heading-subtitle">{ui.subtitle}</p>

        <div className="segment-cards segment-cards--five">
          {PRODUCT_TOP_CATEGORY_ORDER.map((category, index) => {
            const title = tabs[CATEGORY_TAB_COPY_KEY[category]];
            const image = TOP_CATEGORY_IMAGE[category];

            return (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="segment-card"
                style={{ '--card-depth': CARD_DEPTHS[index % CARD_DEPTHS.length] } as React.CSSProperties}
              >
                <div className={`segment-card-media${image ? '' : ' segment-card-media--placeholder'}`}>
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- decorative business-line photo, natural aspect crop
                    <img src={image} alt="" loading="lazy" />
                  ) : null}
                  <div className="segment-card-overlay">
                    <h3 className="segment-card-title">{title}</h3>
                    <span className="segment-card-link">{ui.linkLabel} →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
