'use client';

import Link from 'next/link';

import { PRODUCT_TOP_CATEGORY_ORDER, type ProductTopCategory } from '@/lib/product-media';
import type { SiteCopy } from '@/lib/site-copy';

type HomeWhatWeDoProps = {
  copy: SiteCopy;
};

/** camelCase key shared by copy.products.categories.tabs and copy.home.whatWeDo.categories. */
const CATEGORY_COPY_KEY: Record<ProductTopCategory, 'plastics' | 'generalGoods' | 'foods' | 'ffe' | 'timber'> = {
  plastics: 'plastics',
  'general-goods': 'generalGoods',
  foods: 'foods',
  ffe: 'ffe',
  timber: 'timber',
};

export function HomeWhatWeDo({ copy }: HomeWhatWeDoProps) {
  const ui = copy.home.whatWeDo;
  const tabs = copy.products.categories.tabs;

  return (
    <section id="home-about" className="home-about" aria-label={ui.display}>
      <div className="home-about-inner">
        <p className="section-heading-display">{ui.display}</p>
        <p className="section-heading-subtitle">{ui.subtitle}</p>
        <p className="home-about-statement">{ui.statement}</p>

        <p className="about-pillars-label">{ui.pillarsLabel}</p>
        <div className="business-lines">
          {PRODUCT_TOP_CATEGORY_ORDER.map((category, index) => {
            const copyKey = CATEGORY_COPY_KEY[category];

            return (
              <Link key={category} href={`/products?category=${category}`} className="business-line-row">
                <p className="business-line-index">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="business-line-title">{tabs[copyKey]}</h3>
                <p className="business-line-desc">{ui.categories[copyKey]}</p>
              </Link>
            );
          })}
        </div>

        <nav className="pillar-links" aria-label={ui.linksLabel}>
          <Link href="/company_profile" className="pillar-link">
            {copy.menu.companyProfile}
          </Link>
          <Link href="/contact_us" className="pillar-link">
            {copy.menu.contactUs}
          </Link>
        </nav>
      </div>
    </section>
  );
}
