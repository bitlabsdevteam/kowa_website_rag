'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ProductCarousel } from '@/components/product-carousel';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { TopMenu } from '@/components/top-menu';
import { PRODUCT_MEDIA } from '@/lib/product-media';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

type ProductFeature = {
  id: string;
  title: string;
  summary: string;
  image: string;
  points: string[];
};

type ProductPageCopy = {
  intro: string;
  lead: string;
  body: string;
  evidenceLabel: string;
  evidenceItems: string[];
  featureLabel: string;
  features: ProductFeature[];
  merchandisingLabel: string;
  merchandisingTitle: string;
  merchandisingBody: string;
  merchandisingPoints: string[];
  carouselLabel: string;
  carouselTitle: string;
  carouselBody: string;
  machineLabel: string;
  machineTitle: string;
  machineBody: string;
  machineCta: string;
};

const PRODUCT_PAGE_COPY: Record<Locale, ProductPageCopy> = {
  en: {
    intro: 'A cleaner merchandising surface for Kowa’s resin, recycled-material, and circular-supply offer.',
    lead: 'The page now separates commercial product stories from machine-heavy factory context, so buyers can scan materials first and dive into plant capabilities only when needed.',
    body:
      'The layout borrows the strongest patterns from major ecommerce leaders: narrative hero framing, card-based category merchandising, and quick-scan proof points before the deeper media gallery.',
    evidenceLabel: 'Presentation principles',
    evidenceItems: ['Editorial lead visual', 'Assortment-first category cards', 'Operational proof before inquiry'],
    featureLabel: 'Product lanes',
    features: [
      {
        id: 'synthetic-resins',
        title: 'Synthetic Resin Raw Materials',
        summary: 'Lot-based resin sourcing presented like a premium assortment rather than a flat image dump.',
        image: '/images/products/86969_0_0.jpg',
        points: ['Stable procurement routes', 'Warehouse-ready lot handling', 'Domestic and export support'],
      },
      {
        id: 'recycled-feedstock',
        title: 'Recycled Feedstock',
        summary: 'Scrap, flakes, and reprocessed material visualized as a transformation story from intake to reuse.',
        image: '/images/products/plastic-scrap.jpg',
        points: ['Post-industrial intake', 'Sorting and crushing context', 'Circular material recovery'],
      },
      {
        id: 'pellet-output',
        title: 'Pellet Output',
        summary: 'Recovered material moves into a more commerce-ready finish with cleaner visual framing for downstream buyers.',
        image: '/images/products/cop-pellet.jpg',
        points: ['Pelletized output', 'Blend-ready presentation', 'Supply continuity cues'],
      },
      {
        id: 'processing-flow',
        title: 'Processing Flow',
        summary: 'Operational visuals remain visible, but they now support the product story instead of overwhelming it.',
        image: '/images/products/pe-crushing.jpg',
        points: ['Crushing-stage visibility', 'Process-backed trust', 'Buyer-friendly sequencing'],
      },
    ],
    merchandisingLabel: 'Merchandising layer',
    merchandisingTitle: 'Stronger scanability before the full media gallery.',
    merchandisingBody:
      'This first layer works like a refined category landing page: one large lead story, a structured set of product lanes, and compact proof points that answer what Kowa handles and why it matters.',
    merchandisingPoints: [
      'Lead with the most commercial images, not the densest factory scenes.',
      'Group materials by buyer intent: resin, recycled feedstock, pellets, and processing proof.',
      'Keep deeper operations below the fold so the page reads like a premium B2B assortment.',
    ],
    carouselLabel: 'Operational gallery',
    carouselTitle: 'Full media stream',
    carouselBody: 'The complete gallery remains available for visitors who want the broader visual inventory across materials, processing, and plant operations.',
    machineLabel: 'Machines page',
    machineTitle: 'Need the factory and warehouse equipment view?',
    machineBody:
      'Machine-specific visuals and research now live on a dedicated route, so the product page can stay commercial while the equipment page goes deeper on plant hardware.',
    machineCta: 'Open machines',
  },
  ja: {
    intro: '樹脂原料、再生材、循環型サプライを、より見やすく整理した製品ページです。',
    lead: '製品情報と機械設備の文脈を分け、来訪者がまず素材と商流を理解し、その後に設備詳細へ進める構成へ整理しました。',
    body:
      '主要ECサイトの強い見せ方を参考に、ヒーロー訴求、カテゴリ単位の整理、短時間で把握できる根拠表示を先に置き、その後に詳細ギャラリーへ接続します。',
    evidenceLabel: '見せ方の原則',
    evidenceItems: ['大きな主役ビジュアル', 'カテゴリ単位の整理', '問い合わせ前に要点を把握'],
    featureLabel: '製品レーン',
    features: [
      {
        id: 'synthetic-resins',
        title: '合成樹脂原料',
        summary: '樹脂ロットを単なる画像一覧ではなく、調達商材として見せる構成に変更。',
        image: '/images/products/86969_0_0.jpg',
        points: ['安定した調達ルート', '倉庫対応のロット管理', '国内外供給に対応'],
      },
      {
        id: 'recycled-feedstock',
        title: '再生原料',
        summary: 'スクラップから再利用原料へ至る流れを、素材ストーリーとして可視化。',
        image: '/images/products/plastic-scrap.jpg',
        points: ['産業系スクラップ受入れ', '選別・粉砕の文脈', '資源循環の回収力'],
      },
      {
        id: 'pellet-output',
        title: 'ペレット出力',
        summary: '回収材の仕上がりを、下流顧客が判断しやすいビジュアルで整理。',
        image: '/images/products/cop-pellet.jpg',
        points: ['ペレット化された出力', 'ブレンド前提の見せ方', '供給継続性の訴求'],
      },
      {
        id: 'processing-flow',
        title: '加工フロー',
        summary: '工場ビジュアルは残しつつ、製品理解を支える証拠として位置づけます。',
        image: '/images/products/pe-crushing.jpg',
        points: ['粉砕工程の可視化', '工程裏付けによる信頼', '買い手向けの順序設計'],
      },
    ],
    merchandisingLabel: 'マーチャンダイジング',
    merchandisingTitle: '詳細ギャラリー前に、把握しやすい整理を追加。',
    merchandisingBody:
      '最初のレイヤーでは、主役となる製品像、カテゴリごとの整理、短い証拠情報を組み合わせ、Kowaが何を扱うかを素早く理解できるようにします。',
    merchandisingPoints: [
      '最初に工場写真よりも商材性の高いビジュアルを見せる。',
      '樹脂、再生原料、ペレット、加工根拠の順で整理する。',
      '製品ページは営業的に、設備詳細は別ページで深掘りする。',
    ],
    carouselLabel: '詳細ギャラリー',
    carouselTitle: 'フルメディア閲覧',
    carouselBody: '原料、加工、再生、工場オペレーションまで含めた全ビジュアルは、そのまま下段のギャラリーで確認できます。',
    machineLabel: '設備ページ',
    machineTitle: '倉庫・工場の設備を詳しく見たい場合',
    machineBody: '機械ごとの写真とリサーチ情報は専用の `/machines` ページへ分離し、製品ページは商材理解を優先する構成にしました。',
    machineCta: '設備を見る',
  },
  zh: {
    intro: '把树脂原料、再生材料与循环供应能力整理成更清晰的产品展示页。',
    lead: '现在先讲清产品和材料，再把设备与工厂信息放到单独页面，方便访客先理解业务，再深入产线能力。',
    body:
      '展示方式参考了头部电商常见的强势结构：先有主视觉与分类，再给出快速证明点，最后进入完整媒体画廊。',
    evidenceLabel: '展示原则',
    evidenceItems: ['主视觉先行', '按类别组织', '先看要点再深入'],
    featureLabel: '产品通道',
    features: [
      {
        id: 'synthetic-resins',
        title: '合成树脂原料',
        summary: '把树脂批次展示成可采购的商业货盘，而不是松散图片列表。',
        image: '/images/products/86969_0_0.jpg',
        points: ['稳定采购路径', '仓储级批次管理', '支持国内与出口供应'],
      },
      {
        id: 'recycled-feedstock',
        title: '再生原料',
        summary: '从废料接收到可再利用原料的转化过程，被整理成更清楚的材料故事。',
        image: '/images/products/plastic-scrap.jpg',
        points: ['工业废料接收', '分选与粉碎语境', '循环材料回收'],
      },
      {
        id: 'pellet-output',
        title: '颗粒产出',
        summary: '把回收材料的成品状态展示得更利于下游客户判断。',
        image: '/images/products/cop-pellet.jpg',
        points: ['颗粒化产出', '适合混配展示', '强调持续供给'],
      },
      {
        id: 'processing-flow',
        title: '加工流程',
        summary: '工厂画面继续保留，但现在作为支持产品可信度的证据层存在。',
        image: '/images/products/pe-crushing.jpg',
        points: ['粉碎阶段可视化', '流程可信度', '更利于买方理解'],
      },
    ],
    merchandisingLabel: '陈列层',
    merchandisingTitle: '先增强可扫读性，再进入完整画廊。',
    merchandisingBody:
      '第一层像一个更成熟的分类落地页：先给主打产品故事，再给分类卡片和证明点，让访客快速看懂 Kowa 在卖什么、如何交付。',
    merchandisingPoints: [
      '先展示更具商业价值的材料视觉，而不是最复杂的工厂画面。',
      '按树脂、再生原料、颗粒和加工证明来组织内容。',
      '产品页保持销售导向，设备页负责深度解释工厂硬件。',
    ],
    carouselLabel: '完整画廊',
    carouselTitle: '全媒体浏览',
    carouselBody: '如果访客希望继续查看全部原料、加工和工厂视觉，可以直接在下方完整画廊中继续浏览。',
    machineLabel: '设备页',
    machineTitle: '想单独看仓库与工厂设备？',
    machineBody: '机器照片和研究说明已整理到独立的 `/machines` 页面，让产品页保持更强的商业表达。',
    machineCta: '打开设备页',
  },
};

export default function ProductsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = useMemo(() => SITE_COPY[locale], [locale]);
  const pageCopy = PRODUCT_PAGE_COPY[locale];
  const leadFeature = pageCopy.features[0];
  const supportingFeatures = pageCopy.features.slice(1);

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

        <section className="products-merch-hero" aria-label={pageCopy.featureLabel}>
          <article className="products-merch-lead">
            <div className="products-merch-copy">
              <p className="section-label">{pageCopy.merchandisingLabel}</p>
              <h2 className="section-title products-merch-title">{pageCopy.merchandisingTitle}</h2>
              <p className="lead products-merch-lead-copy">{pageCopy.lead}</p>
              <p className="body-copy">{pageCopy.body}</p>
            </div>

            <div className="products-merch-proof">
              <span>{pageCopy.evidenceLabel}</span>
              <ul className="products-merch-proof-list">
                {pageCopy.evidenceItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>

          <article className="products-lead-card">
            <div className="products-lead-image-shell">
              <Image
                src={leadFeature.image}
                alt={leadFeature.title}
                fill
                priority
                sizes="(max-width: 980px) 100vw, 42vw"
                className="products-lead-image"
              />
            </div>
            <div className="products-lead-card-copy">
              <p className="section-label">{pageCopy.featureLabel}</p>
              <h3>{leadFeature.title}</h3>
              <p>{leadFeature.summary}</p>
              <ul className="products-chip-list">
                {leadFeature.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section className="products-feature-grid" aria-label={pageCopy.featureLabel}>
          {supportingFeatures.map((feature) => (
            <article key={feature.id} className="products-feature-card">
              <div className="products-feature-image-shell">
                <Image src={feature.image} alt={feature.title} fill sizes="(max-width: 980px) 100vw, 28vw" className="products-feature-image" />
              </div>
              <div className="products-feature-copy">
                <h3>{feature.title}</h3>
                <p>{feature.summary}</p>
                <ul className="products-feature-points">
                  {feature.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="products-guidance-strip" aria-label={pageCopy.merchandisingLabel}>
          <article className="products-guidance-card">
            <p className="section-label">{pageCopy.merchandisingLabel}</p>
            <h2>{pageCopy.merchandisingTitle}</h2>
            <p>{pageCopy.merchandisingBody}</p>
          </article>
          <article className="products-guidance-card products-guidance-list-card">
            <ul className="products-guidance-list">
              {pageCopy.merchandisingPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
          <article className="products-machine-cta">
            <span>{pageCopy.machineLabel}</span>
            <h3>{pageCopy.machineTitle}</h3>
            <p>{pageCopy.machineBody}</p>
            <Link href="/machines" className="button-secondary">
              {pageCopy.machineCta}
            </Link>
          </article>
        </section>

        <section className="products-carousel-shell" aria-label={pageCopy.carouselLabel}>
          <div className="products-carousel-shell-head">
            <div>
              <p className="section-label">{pageCopy.carouselLabel}</p>
              <h2 className="section-title products-carousel-shell-title">{pageCopy.carouselTitle}</h2>
            </div>
            <p className="body-copy products-carousel-shell-copy">{pageCopy.carouselBody}</p>
          </div>

          <ProductCarousel items={PRODUCT_MEDIA} entries={copy.products.entries} locale={locale} labels={copy.products.carousel} />
        </section>
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
