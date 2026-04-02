'use client';

import { useMemo, useState } from 'react';

import { ProductCarousel } from '@/components/product-carousel';
import { TopMenu } from '@/components/top-menu';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { PRODUCT_MEDIA } from '@/lib/product-media';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

export default function ProductsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = useMemo(() => SITE_COPY[locale], [locale]);

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section className="card product-grid page-surface" data-testid="products-page-content">
        <span className="eyebrow">{copy.menu.products}</span>
        <h1 className="page-title">{copy.products.title}</h1>
        <div className="product-cards">
          {copy.products.entries.map((product) => (
            <article key={product.name} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.detail}</p>
            </article>
          ))}
        </div>
        <ProductCarousel items={PRODUCT_MEDIA} labels={copy.products.carousel} />
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
