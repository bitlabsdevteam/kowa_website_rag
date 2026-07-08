'use client';

import { useMemo } from 'react';

import { LocalizedFooter } from '@/components/localized-footer';
import { PageHeaderBand } from '@/components/page-header-band';
import { TopMenu } from '@/components/top-menu';
import type { ProductMediaCategory } from '@/lib/product-media';
import { PRODUCT_SHOWCASE_COPY } from '@/lib/product-showcase-copy';
import { SITE_COPY } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

/** One representative photograph per business lane (see lib/product-showcase-copy.ts chapters). */
const SEGMENT_IMAGES = ['/images/products/gpps-pellet-1.jpg', '/images/products/pp-crushed-1.jpg', '/images/products/mixer-machine.jpg'];

/** Categories that lead to the machinery catalog rather than the product gallery. */
const MACHINE_LINKED_CATEGORIES: ProductMediaCategory[] = ['machinery-equipment', 'factory-operations'];

export default function BusinessPage() {
  const [locale, setLocale] = useLocale();
  const copy = SITE_COPY[locale];
  const showcase = PRODUCT_SHOWCASE_COPY[locale];
  const page = copy.businessPage;

  const segments = useMemo(
    () =>
      showcase.chapters.map((chapter, index) => ({
        id: `segment-${index + 1}`,
        heading: chapter.caption,
        image: SEGMENT_IMAGES[index % SEGMENT_IMAGES.length],
        offerings: chapter.categories.map((categoryKey) => {
          const category = showcase.categories[categoryKey];
          const toMachines = MACHINE_LINKED_CATEGORIES.includes(categoryKey);
          return {
            key: categoryKey,
            title: category.label,
            body: category.summary,
            href: toMachines ? '/machines' : '/products',
            linkLabel: toMachines ? page.offeringsMachinesLabel : page.offeringsProductsLabel,
          };
        }),
      })),
    [showcase, page.offeringsMachinesLabel, page.offeringsProductsLabel],
  );

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <PageHeaderBand
        display={page.display}
        subtitle={page.subtitle}
        breadcrumbAria={page.breadcrumbAria}
        breadcrumbs={[{ label: page.breadcrumbHome, href: '/' }, { label: page.breadcrumbCurrent }]}
      />

      <section className="business-landing-intro" aria-label={page.segmentsLabel}>
        <div className="business-landing-intro-inner">
          <p>{page.intro}</p>
        </div>
      </section>

      {segments.map((segment) => (
        <section key={segment.id} id={segment.id} className="business-segment" aria-label={segment.heading}>
          <div className="business-segment-inner">
            <div className="business-segment-media">
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative segment photo, natural aspect crop */}
              <img src={segment.image} alt="" loading="lazy" />
            </div>
            <div>
              <h2 className="business-segment-heading">{segment.heading}</h2>
              <div className="offering-cards">
                {segment.offerings.map((offering) => (
                  <a key={offering.key} href={offering.href} className="offering-card">
                    <p className="offering-card-title">{offering.title}</p>
                    <p className="offering-card-body">{offering.body}</p>
                    <span className="offering-card-link">{offering.linkLabel}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="business-flow-strip" aria-label={copy.business.flowTitle}>
        <div className="business-flow-inner">
          <h2 className="section-heading-display" style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.2rem)' }}>
            {copy.business.flowTitle}
          </h2>
          <ol className="business-flow-list">
            {copy.business.flowPhases.map((phase, index) => (
              <li key={phase.nodeLabel} className="business-flow-step">
                <span className="business-flow-step-index">{String(index + 1).padStart(2, '0')}</span>
                <p className="business-flow-step-title">{phase.title}</p>
                <p className="business-flow-step-detail">{phase.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="business-cta-band">
        <div className="business-cta-inner">
          <h2 className="business-cta-title">{page.ctaTitle}</h2>
          <p className="business-cta-body">{page.ctaBody}</p>
          <a href="/contact_us" className="business-cta-button">
            {page.ctaLabel}
          </a>
        </div>
      </section>

      <LocalizedFooter copy={copy} />
    </main>
  );
}
