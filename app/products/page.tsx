'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

import type { CardItem } from '@/components/ui/card-fan-carousel';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
import { PRODUCT_MEDIA, type ProductFamily, type ProductView } from '@/lib/product-media';
import { PRODUCT_FAMILY_COPY, PRODUCT_VIEW_COPY } from '@/lib/product-showcase-copy';
import { SITE_COPY, type Locale } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

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
  zh: '回收废料、再生颗粒与可供应树脂，皆是 Kowa 在循环供应链中流转的材料。',
};

export default function ProductsPage() {
  const [locale, setLocale] = useLocale();
  const copy = useMemo(() => SITE_COPY[locale], [locale]);

  // One card per product family. The card face shows the clean loose-pellet
  // photo (the "pile" view); clicking opens a modal that reveals the package /
  // lot shot and the macro zoom alongside the localized description.
  const cards = useMemo<CardItem[]>(() => {
    const families = PRODUCT_FAMILY_COPY[locale];
    const views = PRODUCT_VIEW_COPY[locale];
    const order: ProductFamily[] = ['cd-pcn', 'gpps', 'ps-recycle'];

    return order.map((familyKey) => {
      const family = families[familyKey];
      const items = PRODUCT_MEDIA.filter((m) => m.family === familyKey);
      const byView = (view: ProductView) => items.find((m) => m.view === view);
      const pile = byView('pile') ?? items[0];
      const lot = byView('lot');
      const macro = byView('macro');

      // Modal gallery: package/lot shot first, then the macro zoom.
      const detailImages = [
        lot && { src: lot.src, alt: `${family.title} — ${views.lot}`, caption: views.lot },
        macro && { src: macro.src, alt: `${family.title} — ${views.macro}`, caption: views.macro },
      ].filter((image): image is { src: string; alt: string; caption: string } => Boolean(image));

      return {
        imgUrl: pile.src,
        alt: family.title,
        title: family.title,
        category: family.material,
        description: family.summary,
        points: family.points,
        detailImages,
      };
    });
  }, [locale]);

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

        <CardFanCarousel
          cards={cards}
          prevLabel={copy.products.carousel.prevAriaLabel}
          nextLabel={copy.products.carousel.nextAriaLabel}
          closeLabel={copy.products.carousel.closeLabel}
          detailsLabel={copy.products.carousel.enlargeLabel}
        />
      </section>

      <LocalizedFooter copy={copy} />
    </main>
  );
}
