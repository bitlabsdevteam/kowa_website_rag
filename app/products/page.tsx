'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ProductCarousel } from '@/components/product-carousel';
import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { TopMenu } from '@/components/top-menu';
import { PRODUCT_MEDIA } from '@/lib/product-media';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

type ProductPageCopy = {
  intro: string;
  carouselLabel: string;
  carouselTitle: string;
  carouselBody: string;
  ctaLabel: string;
  ctaTitle: string;
  ctaBody: string;
  inquiryCta: string;
  machineCta: string;
};

const PRODUCT_PAGE_COPY: Record<Locale, ProductPageCopy> = {
  en: {
    intro:
      'Resin procurement, recycled-plastics processing, and battery-pack support — Kowa’s offer along a single circular supply.',
    carouselLabel: 'What Kowa supplies',
    carouselTitle: 'From recovered scrap to supply-ready material.',
    carouselBody:
      'Move through Kowa’s product lanes — synthetic resin sourcing, recycling and pellet regeneration, and battery-pack development support — each shown with the real materials and operations behind it.',
    ctaLabel: 'Go further',
    ctaTitle: 'Talk to Kowa, or see the plant equipment.',
    ctaBody:
      'Start an inquiry for sourcing, recycled feedstock, or development support — or open the machines view for factory and line context.',
    inquiryCta: 'Start an inquiry',
    machineCta: 'View machines',
  },
  ja: {
    intro:
      '樹脂調達、再生プラスチック処理、バッテリーパック開発支援——ひとつの循環型サプライに沿ったKowaの提供価値。',
    carouselLabel: 'Kowaが供給するもの',
    carouselTitle: '回収スクラップから、供給可能な素材へ。',
    carouselBody:
      '合成樹脂の調達、再生とペレット化、バッテリーパック開発支援というKowaの製品レーンを、実際の素材とオペレーションとともに巡回できます。',
    ctaLabel: 'さらに進む',
    ctaTitle: 'Kowaに相談する、または設備を見る。',
    ctaBody:
      '調達、再生原料、開発支援についてのお問い合わせ、または工場・ライン文脈を示す設備ページへどうぞ。',
    inquiryCta: 'お問い合わせ',
    machineCta: '設備を見る',
  },
  zh: {
    intro:
      '树脂采购、再生塑料处理、电池组开发支持——Kowa 在同一条循环供应链上的产品能力。',
    carouselLabel: 'Kowa 供应什么',
    carouselTitle: '从回收废料，到可供应的材料。',
    carouselBody:
      '依次浏览 Kowa 的产品通道——合成树脂采购、再生与造粒、电池组开发支持——每一项都配以真实的材料与运营画面。',
    ctaLabel: '继续了解',
    ctaTitle: '联系 Kowa，或查看工厂设备。',
    ctaBody:
      '就采购、再生原料或开发支持发起咨询，或打开设备页查看工厂与产线场景。',
    inquiryCta: '发起咨询',
    machineCta: '查看设备',
  },
};

export default function ProductsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = useMemo(() => SITE_COPY[locale], [locale]);
  const pageCopy = PRODUCT_PAGE_COPY[locale];

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
          <p className="body-copy products-page-intro">{pageCopy.intro}</p>
        </div>

        <ScrollReveal variant="fade-up">
          <section className="products-carousel-shell products-carousel-shell--cinematic" aria-label={pageCopy.carouselLabel}>
            <div className="products-carousel-shell-head">
              <div>
                <p className="section-label">{pageCopy.carouselLabel}</p>
                <h2 className="section-title products-carousel-shell-title">{pageCopy.carouselTitle}</h2>
              </div>
              <p className="body-copy products-carousel-shell-copy">{pageCopy.carouselBody}</p>
            </div>

            <ProductCarousel items={PRODUCT_MEDIA} entries={copy.products.entries} locale={locale} labels={copy.products.carousel} />
          </section>
        </ScrollReveal>

        <section className="products-cta-row" aria-label={pageCopy.ctaLabel}>
          <div className="products-cta-copy">
            <span className="section-label">{pageCopy.ctaLabel}</span>
            <h2 className="section-title">{pageCopy.ctaTitle}</h2>
            <p className="body-copy">{pageCopy.ctaBody}</p>
          </div>
          <div className="products-cta-actions">
            <Link href="/inquiry" className="button-primary">
              {pageCopy.inquiryCta}
            </Link>
            <Link href="/machines" className="button-secondary">
              {pageCopy.machineCta}
            </Link>
          </div>
        </section>
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
