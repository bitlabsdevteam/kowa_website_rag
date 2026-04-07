'use client';

import { useMemo, useState } from 'react';

import { ProductCarousel } from '@/components/product-carousel';
import { TopMenu } from '@/components/top-menu';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { PRODUCT_MEDIA } from '@/lib/product-media';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

const PRODUCT_PAGE_INTRO: Record<Locale, string> = {
  en: 'An editorial product view that turns Kowa’s materials, regeneration flow, and equipment-support context into a guided visual sequence.',
  ja: 'Kowaの原料、再生フロー、設備支援を、章立てされたビジュアル体験として見せるプロダクトページです。',
  zh: '以更具展示感的方式，把 Kowa 的材料、再生流程与设备支持整理成可浏览的视觉序列。',
};

export default function ProductsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = useMemo(() => SITE_COPY[locale], [locale]);

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section className="card product-grid products-page-surface page-surface corporate-hero corporate-content-surface" data-testid="products-page-content">
        <div className="products-page-head">
          <div className="products-page-title-block">
            <span className="eyebrow">{copy.menu.products}</span>
            <h1 className="page-title">{copy.products.title}</h1>
          </div>
          <p className="body-copy products-page-intro">{PRODUCT_PAGE_INTRO[locale]}</p>
        </div>
        <ProductCarousel items={PRODUCT_MEDIA} entries={copy.products.entries} locale={locale} labels={copy.products.carousel} />
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
