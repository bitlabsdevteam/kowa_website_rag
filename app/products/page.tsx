'use client';

import { useMemo, useState } from 'react';

import { ProductCarousel } from '@/components/product-carousel';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { TopMenu } from '@/components/top-menu';
import { PRODUCT_MEDIA } from '@/lib/product-media';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

const PRODUCT_INTRO: Record<Locale, string> = {
  en: 'Recovered scrap, regenerated pellets, and supply-ready resin — the materials Kowa moves through its circular supply.',
  ja: '回収スクラップ、再生ペレット、供給可能な樹脂——Kowaが循環型サプライで扱う素材。',
  zh: '回收废料、再生颗粒与可供应树脂——Kowa 在循环供应链中流转的材料。',
};

export default function ProductsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = useMemo(() => SITE_COPY[locale], [locale]);

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

        <ProductCarousel items={PRODUCT_MEDIA} locale={locale} labels={copy.products.carousel} />
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
