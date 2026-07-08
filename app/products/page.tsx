'use client';

import { Suspense, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import type { CardItem } from '@/components/ui/card-fan-carousel';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
import { PRODUCT_MEDIA, PRODUCT_TOP_CATEGORY_ORDER, type ProductFamily, type ProductTopCategory } from '@/lib/product-media';
import { PRODUCT_FAMILY_COPY } from '@/lib/product-showcase-copy';
import { SITE_COPY, type Locale } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

/** Families photographed per top-level category. Categories absent from this
 * map have no grounded photography yet and render the "catalog in
 * preparation" empty state instead of fabricated products. Plastics is
 * further split into "crushed" / "pellet" sub-tabs — see
 * `PLASTICS_FAMILIES_BY_FORM` below — so it's intentionally absent here. */
const CATEGORY_FAMILIES: Partial<Record<ProductTopCategory, ProductFamily[]>> = {
  'general-goods': ['general-goods-moisture-charcoal', 'general-goods-canvas-tote'],
  timber: ['myanmar-teak', 'wood-flooring-office', 'wood-flooring-bedroom', 'wood-flooring-living-room', 'wood-flooring-deck'],
};

/** Plastics form — raw crushed scrap feedstock vs. regenerated pellet output. */
type PlasticsForm = 'crushed' | 'pellet';

const PLASTICS_FORM_ORDER: PlasticsForm[] = ['pellet', 'crushed'];

const PLASTICS_FAMILIES_BY_FORM: Record<PlasticsForm, ProductFamily[]> = {
  crushed: ['abs-crushed', 'hdpe-crushed', 'hips-crushed', 'pp-crushed'],
  pellet: ['gpps-pellet', 'hdpe-pellet', 'pc-pellet', 'pcr-pellet', 'pir-pellet', 'pp-pellet', 'ps-pellet'],
};

function isPlasticsForm(value: string | null): value is PlasticsForm {
  return value === 'crushed' || value === 'pellet';
}

/** Maps a top-category id to its camelCase key in copy.products.categories.tabs. */
const CATEGORY_TAB_COPY_KEY: Record<ProductTopCategory, 'plastics' | 'generalGoods' | 'foods' | 'ffe' | 'timber'> = {
  plastics: 'plastics',
  'general-goods': 'generalGoods',
  foods: 'foods',
  ffe: 'ffe',
  timber: 'timber',
};

// The fan carousel pulls in GSAP and only runs on the client, so defer its
// bundle until the products page mounts. A height-matched placeholder reserves
// the layout to avoid shift while the chunk loads.
const CardFanCarousel = dynamic(() => import('@/components/ui/card-fan-carousel'), {
  ssr: false,
  loading: () => <div className="card-fan-loading" aria-hidden="true" />,
});

const PRODUCT_INTRO: Record<Locale, string> = {
  en: 'Recovered scrap, regenerated pellets, and supply-ready resin: the materials Kowa moves through its circular supply.',
  ja: '回収スクラップ、再生ペレット、供給可能な樹脂。Kowaが循環型サプライで扱う素材です。',
  'zh-Hans': '回收废料、再生颗粒与可供应树脂，皆是 Kowa 在循环供应链中流转的材料。',
  'zh-Hant': '回收廢料、再生顆粒與可供應樹脂，皆是 Kowa 在循環供應鏈中流轉的材料。',
};

function isProductTopCategory(value: string | null): value is ProductTopCategory {
  return PRODUCT_TOP_CATEGORY_ORDER.includes(value as ProductTopCategory);
}

function ProductsPageContent() {
  const [locale, setLocale] = useLocale();
  const copy = useMemo(() => SITE_COPY[locale], [locale]);
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<ProductTopCategory>(
    isProductTopCategory(requestedCategory) ? requestedCategory : 'plastics',
  );
  const requestedForm = searchParams.get('form');
  const [activePlasticsForm, setActivePlasticsForm] = useState<PlasticsForm>(
    isPlasticsForm(requestedForm) ? requestedForm : 'pellet',
  );

  // One card per product family. The card face shows the clean "primary"
  // view photo, with just the product name shown below. Plastics, General
  // Goods, and Timber have grounded photography today (see
  // CATEGORY_FAMILIES / PLASTICS_FAMILIES_BY_FORM above); Foods and FFE are
  // defined as tabs but have no grounded photography yet (see
  // lib/product-media.ts — PRODUCT_FAMILY_TOP_CATEGORY), so they render an
  // honest "catalog in preparation" state instead of fabricated products.
  const cards = useMemo<CardItem[]>(() => {
    const order = activeCategory === 'plastics' ? PLASTICS_FAMILIES_BY_FORM[activePlasticsForm] : CATEGORY_FAMILIES[activeCategory];
    if (!order) return [];

    const families = PRODUCT_FAMILY_COPY[locale];

    return order.map((familyKey) => {
      const family = families[familyKey];
      const items = PRODUCT_MEDIA.filter((m) => m.family === familyKey);
      const pile = items.find((m) => m.view === 'primary' || m.view === 'pile') ?? items[0];

      return {
        imgUrl: pile.src,
        alt: family.title,
        title: family.title,
      };
    });
  }, [locale, activeCategory, activePlasticsForm]);

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section className="card product-grid products-page-surface page-surface corporate-content-surface" data-testid="products-page-content">
        <div className="pgallery-head">
          <span className="eyebrow">{copy.menu.products}</span>
          <h1 className="page-title">{copy.products.title}</h1>
          <p className="body-copy">{PRODUCT_INTRO[locale]}</p>
        </div>

        <div className="products-category-tabs" role="tablist" aria-label={copy.products.categories.tabListAriaLabel}>
          {PRODUCT_TOP_CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={`products-category-tab${activeCategory === category ? ' is-active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {copy.products.categories.tabs[CATEGORY_TAB_COPY_KEY[category]]}
            </button>
          ))}
        </div>

        {activeCategory === 'plastics' ? (
          <div className="products-form-tabs" role="tablist" aria-label={copy.products.categories.plasticsForms.tabListAriaLabel}>
            {PLASTICS_FORM_ORDER.map((form) => (
              <button
                key={form}
                type="button"
                role="tab"
                aria-selected={activePlasticsForm === form}
                className={`products-form-tab${activePlasticsForm === form ? ' is-active' : ''}`}
                onClick={() => setActivePlasticsForm(form)}
              >
                {copy.products.categories.plasticsForms[form]}
              </button>
            ))}
          </div>
        ) : null}

        {cards.length > 0 ? (
          <CardFanCarousel
            key={activeCategory === 'plastics' ? `plastics-${activePlasticsForm}` : activeCategory}
            cards={cards}
            prevLabel={copy.products.carousel.prevAriaLabel}
            nextLabel={copy.products.carousel.nextAriaLabel}
          />
        ) : (
          <div className="products-category-empty">
            <p className="products-category-empty-title">{copy.products.categories.empty.title}</p>
            <p className="body-copy">{copy.products.categories.empty.body}</p>
            <Link href="/contact_us" className="products-category-empty-cta">
              {copy.products.categories.empty.ctaLabel}
            </Link>
          </div>
        )}
      </section>

      <LocalizedFooter copy={copy} />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
