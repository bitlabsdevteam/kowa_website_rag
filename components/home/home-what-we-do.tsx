'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { PRODUCT_TOP_CATEGORY_ORDER, TOP_CATEGORY_IMAGE, type ProductTopCategory } from '@/lib/product-media';
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

/** The numbered business-line rows. The factory scene that used to open this
 * section now lives between the OUR BUSINESS and PRODUCTS bands
 * (HomeBusinessParallax); the section keeps its WHAT WE DO landmark name via
 * aria-label. Hover/focus highlights a row directly; an IntersectionObserver
 * keyed to the viewport's middle band drives the highlight from plain
 * scrolling on touch. */
export function HomeWhatWeDo({ copy }: HomeWhatWeDoProps) {
  const ui = copy.home.whatWeDo;
  const tabs = copy.products.categories.tabs;

  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ProductTopCategory>(PRODUCT_TOP_CATEGORY_ORDER[0]);

  useEffect(() => {
    // Scroll-driven activation is for touch surfaces only; on pointer devices
    // hover/focus own the active row and the observer would fight them.
    if (window.matchMedia('(hover: hover)').matches) {
      return undefined;
    }
    const rows = listRef.current?.querySelectorAll<HTMLElement>('[data-category]');
    if (!rows?.length || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive((entry.target as HTMLElement).dataset.category as ProductTopCategory);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home-about" className="home-about" aria-label={ui.display}>
      <div className="home-about-inner">
        <p className="about-pillars-label">{ui.pillarsLabel}</p>
        <div className="business-lines" ref={listRef}>
          {PRODUCT_TOP_CATEGORY_ORDER.map((category, index) => {
            const copyKey = CATEGORY_COPY_KEY[category];
            const isComingSoon = !TOP_CATEGORY_IMAGE[category];

            return (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="business-line-row"
                data-category={category}
                data-active={active === category}
                onMouseEnter={() => setActive(category)}
                onFocus={() => setActive(category)}
              >
                <p className="business-line-index">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="business-line-title">
                  {tabs[copyKey]}
                  {isComingSoon ? <span className="business-line-badge">{ui.comingSoonLabel}</span> : null}
                </h3>
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
