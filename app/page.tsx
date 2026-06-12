'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { HeroFallback, supportsHero3DScene } from '@/components/hero-3d/hero-fallback';
import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';
import { ResourceCirculationFlow } from '@/components/resource-circulation-flow';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { SiteFooterMenu } from '@/components/site-footer-menu';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

const Hero3DScene = dynamic(() => import('@/components/hero-3d/hero-3d-scene'), { ssr: false });

const HOME_UI: Record<
  Locale,
  {
    heroFlag: string;
    secondaryCta: string;
    snapshotLabels: [string, string, string];
    platformLabel: string;
    platformTitle: string;
    platformBody: string;
  }
> = {
  en: {
    heroFlag: 'Tokyo, Japan | Global trading and resource circulation',
    secondaryCta: 'View company profile',
    snapshotLabels: ['Head office', 'Operating model', 'Corporate route'],
    platformLabel: 'Business platform',
    platformTitle: 'WHAT IS KOWA’S BUSINESS?',
    platformBody:
      'Kowa combines procurement, processing coordination, recycling flows, and multilingual trade execution in one business platform.',
  },
  ja: {
    heroFlag: 'Tokyo, Japan | グローバルトレードと資源循環',
    secondaryCta: '会社案内を見る',
    snapshotLabels: ['本社拠点', '運営モデル', '企業導線'],
    platformLabel: 'Business platform',
    platformTitle: 'WHAT IS KOWA’S BUSINESS?',
    platformBody:
      'Kowaは、調達、加工連携、資源循環、そして多言語での商流実行を一体として扱う事業プラットフォームです。',
  },
  zh: {
    heroFlag: 'Tokyo, Japan | 全球贸易与资源循环',
    secondaryCta: '查看公司简介',
    snapshotLabels: ['总部', '运营模型', '企业入口'],
    platformLabel: 'Business platform',
    platformTitle: 'WHAT IS KOWA’S BUSINESS?',
    platformBody:
      'Kowa 把采购、加工协同、资源循环与多语言贸易执行整合成一个统一的业务平台。',
  },
};

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [heroVisual, setHeroVisual] = useState<'fallback' | '3d'>('fallback');
  const heroRef = useRef<HTMLElement | null>(null);
  const heroProgress = useScrollProgress(heroRef);
  const copy = SITE_COPY[locale];
  const ui = HOME_UI[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (supportsHero3DScene()) {
      setHeroVisual('3d');
    }
  }, []);

  useEffect(() => {
    if (activeFlowIndex >= copy.business.flowPhases.length) {
      setActiveFlowIndex(0);
    }
  }, [activeFlowIndex, copy.business.flowPhases.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || copy.business.flowPhases.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveFlowIndex((current) => (current + 1) % copy.business.flowPhases.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [copy.business.flowPhases.length]);

  return (
    <main className="page shell reference-site">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section
        id="about"
        ref={heroRef}
        className="hero-panel reference-hero cinematic-hero"
        data-testid="landing-primary-box"
        style={{ '--hero-parallax': heroProgress } as CSSProperties}
      >
        <div className="hero-parallax-background" data-testid="hero-parallax-background" aria-hidden="true">
          {heroVisual === '3d' ? <Hero3DScene /> : <HeroFallback />}
        </div>
        <div className="hero-parallax-mid" data-testid="hero-parallax-mid" aria-hidden="true" />
        <div className="reference-hero-grid hero-parallax-foreground" data-testid="hero-parallax-foreground">
          <div className="reference-hero-copy">
            <span className="eyebrow corporate-eyebrow">{ui.heroFlag}</span>
            <p className="executive-kicker">{copy.hero.eyebrow}</p>
            <h1 className="hero-title reference-hero-title">{copy.hero.title}</h1>
            <p className="lead reference-hero-lead">{copy.hero.lead}</p>
            <p className="body-copy reference-hero-body" data-testid="landing-narrative">
              {copy.hero.body}
            </p>
            <div className="hero-actions">
              <Link href="/company_profile" className="button-secondary">
                {ui.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="reference-hero-media">
            <div className="reference-stat-grid">
              <article className="reference-stat-card" data-testid="hero-stat-card">
                <span>{ui.snapshotLabels[0]}</span>
                <strong>{copy.brand.location}</strong>
              </article>
              <article className="reference-stat-card" data-testid="hero-stat-card">
                <span>{ui.snapshotLabels[1]}</span>
                <strong>{copy.business.flowTitle}</strong>
              </article>
              <article className="reference-stat-card" data-testid="hero-stat-card">
                <span>{ui.snapshotLabels[2]}</span>
                <strong>{copy.menu.companyProfile}</strong>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="card reference-section-card corporate-business-section" aria-label={copy.business.title} data-testid="business-section">
        <div className="reference-section-head">
          <div>
            <p className="section-label">{ui.platformLabel}</p>
            <h2 className="section-title reference-section-title">{ui.platformTitle}</h2>
          </div>
          <p className="body-copy reference-section-copy">{ui.platformBody}</p>
        </div>

        <div className="reference-business-grid">
          <div className="business-architecture-rail">
            <p className="business-flow-title">{copy.business.flowTitle}</p>
            <p className="body-copy">{copy.business.intro}</p>
            <ol className="business-step-list">
              {copy.business.flowPhases.map((phase, index) => (
                <li key={`${phase.title}-${phase.step}`} className={`business-step-item ${activeFlowIndex === index ? 'is-active' : ''}`}>
                  <button
                    type="button"
                    className="business-step-button"
                    onClick={() => setActiveFlowIndex(index)}
                    aria-pressed={activeFlowIndex === index}
                  >
                    <span className="business-step-index">{String(index + 1).padStart(2, '0')}</span>
                    <span>{phase.step}</span>
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
              phases={copy.business.flowPhases}
              activeIndex={activeFlowIndex}
              onSelect={setActiveFlowIndex}
            />
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <SiteFooterMenu navAria={copy.footer.navAria} menuGroups={copy.footer.menuGroups} />
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
