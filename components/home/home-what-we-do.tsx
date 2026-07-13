'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';
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

/** Editorial split: the numbered business-line rows on the right, and a
 * sticky media frame on the left that crossfades to the active line's
 * grounded photo (or an honest placeholder tile for lines without
 * photography). Hover/focus sets the active line directly; an
 * IntersectionObserver keyed to the viewport's middle band drives it from
 * plain scrolling on touch. Below 900px the media frame is hidden and the
 * rows read exactly as before. */
export function HomeWhatWeDo({ copy }: HomeWhatWeDoProps) {
  const ui = copy.home.whatWeDo;
  const tabs = copy.products.categories.tabs;

  const listRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<ProductTopCategory>(PRODUCT_TOP_CATEGORY_ORDER[0]);
  const scrollProgress = useScrollProgress(sectionRef);
  const aboutDrift = (scrollProgress - 0.5) * 2;

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
    <section id="home-about" className="home-about" aria-label={ui.display} ref={sectionRef}>
      <div className="home-about-inner">
        <p className="home-about-watermark" aria-hidden="true">
          {ui.watermark}
        </p>
        <div className="home-about-head">
          <p className="section-heading-display">{ui.display}</p>
          <p className="section-heading-subtitle">{ui.subtitle}</p>
          <p className="home-about-statement">{ui.statement}</p>
        </div>

        <p className="about-pillars-label">{ui.pillarsLabel}</p>
        <div className="home-about-split" style={{ '--about-drift': aboutDrift } as React.CSSProperties}>
          <div className="home-about-media" aria-hidden="true">
            {PRODUCT_TOP_CATEGORY_ORDER.map((category, index) => {
              const image = TOP_CATEGORY_IMAGE[category];
              const isActive = active === category;

              return (
                <div
                  key={category}
                  className={`home-about-media-layer${image ? '' : ' home-about-media-layer--placeholder'}`}
                  data-category={category}
                  data-active={isActive}
                >
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- decorative category photo mirrored by the row text
                    <img src={image} alt="" loading="lazy" />
                  ) : (
                    <>
                      <span className="home-about-media-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="home-about-media-watermark" aria-hidden="true">
                        {ui.comingSoonLabel}
                      </span>
                    </>
                  )}
                  <p className="home-about-media-caption">{tabs[CATEGORY_COPY_KEY[category]]}</p>
                </div>
              );
            })}
          </div>

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
