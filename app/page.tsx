'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ChatPopup } from '@/components/chat-popup';
import { ResourceCirculationFlow } from '@/components/resource-circulation-flow';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { SiteFooterMenu } from '@/components/site-footer-menu';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

const HOME_UI: Record<
  Locale,
  {
    heroFlag: string;
    secondaryCta: string;
    snapshotLabels: [string, string, string];
    commandLabel: string;
    commandTitle: string;
    commandBody: string;
    laneLabel: string;
    platformLabel: string;
    platformTitle: string;
    platformBody: string;
    profileLabel: string;
    productLabel: string;
    assistantLabel: string;
    assistantBody: string;
    productsCta: string;
    profileCta: string;
  }
> = {
  en: {
    heroFlag: 'Tokyo, Japan | Global trading and resource circulation',
    secondaryCta: 'View company profile',
    snapshotLabels: ['Head office', 'Business focus', 'Corporate profile'],
    commandLabel: 'Executive overview',
    commandTitle: 'Cross-border materials, machinery, and circular supply operations.',
    commandBody: 'The homepage now leads with corporate clarity first, then hands deeper sourcing and routing questions to Aya.',
    laneLabel: 'Core lanes',
    platformLabel: 'Business platform',
    platformTitle: 'A clearer operating model for buyers, partners, and investors.',
    platformBody: 'Kowa is framed as one coordinated trading platform: procurement, processing, export handling, and multilingual communication in a single corporate narrative.',
    profileLabel: 'Corporate profile',
    productLabel: 'Product and trade lanes',
    assistantLabel: 'Aya assistant desk',
    assistantBody: 'Keep the chatbot secondary to the corporate story. Visitors first understand the business, then open Aya for sourcing, product, and office-routing questions.',
    productsCta: 'Explore products',
    profileCta: 'Read company profile',
  },
  ja: {
    heroFlag: 'Tokyo, Japan | グローバルトレードと資源循環',
    secondaryCta: '会社案内を見る',
    snapshotLabels: ['本社拠点', '事業領域', '会社情報'],
    commandLabel: 'エグゼクティブ概要',
    commandTitle: '樹脂、機械、循環型サプライをつなぐクロスボーダー商流。',
    commandBody: 'まず企業としての信頼感を示し、その後にAyaで詳細な調達・相談導線へ入る構成に整理しています。',
    laneLabel: '主要レーン',
    platformLabel: 'ビジネスプラットフォーム',
    platformTitle: '取引先・提携先に伝わる、明快なオペレーションモデル。',
    platformBody: '調達、加工、輸出入、そして多言語コミュニケーションを、ひとつの商社オペレーションとして見せる構成です。',
    profileLabel: '会社プロフィール',
    productLabel: '製品・商流',
    assistantLabel: 'Ayaアシスタントデスク',
    assistantBody: 'チャットを主役にせず、先に企業情報を理解してもらい、その後にAyaで製品・調達・社内連携の相談へ進めます。',
    productsCta: '製品を見る',
    profileCta: '会社案内へ',
  },
  zh: {
    heroFlag: 'Tokyo, Japan | 全球贸易与资源循环',
    secondaryCta: '查看公司简介',
    snapshotLabels: ['总部', '业务焦点', '企业信息'],
    commandLabel: '管理层概览',
    commandTitle: '连接材料、设备与循环供应链的跨境贸易平台。',
    commandBody: '首页先建立企业级信任感，再把更深入的采购与咨询问题交给 Aya 处理。',
    laneLabel: '核心业务线',
    platformLabel: '业务平台',
    platformTitle: '面向客户、合作方与投资视角的清晰运营模型。',
    platformBody: '把采购、加工、进出口执行与多语言沟通整合成一个统一的企业叙事入口。',
    profileLabel: '企业档案',
    productLabel: '产品与贸易通道',
    assistantLabel: 'Aya 助手台',
    assistantBody: '让聊天保持非阻塞角色。访客先理解公司业务，再通过 Aya 进入产品、采购和办公室转交流程。',
    productsCta: '查看产品',
    profileCta: '阅读公司简介',
  },
};

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const copy = SITE_COPY[locale];
  const ui = HOME_UI[locale];
  const companyBlocks = copy.companyProfile.blocks.slice(0, 2);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (activeFlowIndex >= copy.business.flowSteps.length) {
      setActiveFlowIndex(0);
    }
  }, [activeFlowIndex, copy.business.flowSteps.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || copy.business.flowSteps.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveFlowIndex((current) => (current + 1) % copy.business.flowSteps.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [copy.business.flowSteps.length]);

  return (
    <main className="page shell home-page">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section id="about" className="landing-single">
        <article className="hero-panel landing-main corporate-hero" data-testid="landing-primary-box">
          <div className="corporate-hero-grid">
            <div className="hero-copy corporate-hero-copy">
              <div className="hero-overview-text corporate-hero-text">
                <span className="eyebrow corporate-eyebrow">{ui.heroFlag}</span>
                <p className="executive-kicker">{copy.hero.eyebrow}</p>
                <h1 className="hero-title hero-title-home">{copy.hero.title}</h1>
              </div>
            </div>

            <div className="corporate-hero-summary">
              <p className="lead landing-subtitle executive-lead">{copy.hero.lead}</p>
              <p className="body-copy corporate-body" data-testid="landing-narrative">
                {copy.hero.body}
              </p>
              <div className="hero-actions corporate-hero-actions">
                <ChatPopup
                  triggerLabel={copy.hero.cta}
                  locale={locale}
                  popupAriaLabel={copy.chat.popupAriaLabel}
                  closeAriaLabel={copy.chat.closeAriaLabel}
                  chatLabels={copy.chat}
                />
                <Link href="/company_profile" className="button-secondary">
                  {ui.secondaryCta}
                </Link>
              </div>
            </div>
          </div>

          <section className="business-section corporate-business-section" aria-label={copy.business.title} data-testid="business-section">
            <div className="corporate-section-head">
              <div>
                <p className="section-label">{ui.platformLabel}</p>
                <h2 className="section-title section-title-business">{copy.business.title}</h2>
              </div>
              <p className="body-copy corporate-section-copy">{ui.platformBody}</p>
            </div>

            <p className="body-copy">{copy.business.intro}</p>

            <div className="business-architecture">
              <div className="business-architecture-rail">
                <p className="business-flow-title">{copy.business.flowTitle}</p>
                <ol className="business-step-list">
                  {copy.business.flowSteps.map((step, index) => (
                    <li key={step} className={`business-step-item ${activeFlowIndex === index ? 'is-active' : ''}`}>
                      <button
                        type="button"
                        className="business-step-button"
                        onClick={() => setActiveFlowIndex(index)}
                        aria-pressed={activeFlowIndex === index}
                      >
                        <span className="business-step-index">{String(index + 1).padStart(2, '0')}</span>
                        <span>{step}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="business-architecture-visual">
                <ResourceCirculationFlow
                  brand={copy.brand.name}
                  title={copy.business.flowTitle}
                  intro={copy.business.intro}
                  nodeLabels={copy.business.flowNodeLabels}
                  steps={copy.business.flowSteps}
                  pillars={copy.business.pillars}
                  activeIndex={activeFlowIndex}
                  onSelect={setActiveFlowIndex}
                />
              </div>
            </div>
          </section>

          <section className="corporate-intelligence-grid" aria-label={ui.profileLabel}>
            <div className="corporate-profile-stack">
              <div className="corporate-section-head corporate-section-head-tight">
                <div>
                  <p className="section-label">{ui.profileLabel}</p>
                  <h2 className="section-title corporate-subtitle">{ui.platformTitle}</h2>
                </div>
                <Link href="/company_profile" className="text-link">
                  {ui.profileCta}
                </Link>
              </div>

              <div className="corporate-profile-grid">
                {companyBlocks.map((block) => (
                  <article key={block.heading} className="corporate-profile-card">
                    <p className="corporate-card-label">{block.heading}</p>
                    <ul className="corporate-point-list">
                      {block.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className="corporate-side-stack">
              <article className="corporate-side-card">
                <p className="corporate-card-label">{ui.productLabel}</p>
                <div className="corporate-trade-grid">
                  {copy.products.entries.map((product) => (
                    <div key={product.name} className="corporate-trade-item">
                      <strong>{product.name}</strong>
                      <p>{product.detail}</p>
                    </div>
                  ))}
                </div>
                <Link href="/products" className="text-link">
                  {ui.productsCta}
                </Link>
              </article>

              <article className="corporate-side-card">
                <p className="corporate-card-label">{ui.assistantLabel}</p>
                <p className="body-copy">{ui.assistantBody}</p>
                <div className="video-embed hero-video-embed" aria-label={copy.hero.videoTitle}>
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/ScMzIvxBSi4"
                    title={copy.hero.videoTitle}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </article>
            </div>
          </section>
        </article>
      </section>

      <footer className="site-footer">
        <SiteFooterMenu navAria={copy.footer.navAria} menuGroups={copy.footer.menuGroups} />
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
