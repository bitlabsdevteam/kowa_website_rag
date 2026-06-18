'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { HeroFallback, supportsHero3DScene } from '@/components/hero-3d/hero-fallback';
import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';
import { ResourceCirculationFlow } from '@/components/resource-circulation-flow';
import { SiteFooterBar } from '@/components/site-footer-bar';
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
  // Whole-document progress drives the page-level backdrop camera; the
  // hero-scoped progress keeps driving the copy-layer parallax drift.
  const pageProgress = useScrollProgress();
  // Mutable mirror so the 3D camera rig can read the latest value inside
  // useFrame without re-rendering the canvas per scroll frame.
  const pageProgressRef = useRef(0);
  const copy = SITE_COPY[locale];
  const ui = HOME_UI[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    pageProgressRef.current = pageProgress;
  }, [pageProgress]);

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
      <div className="page-backdrop" data-testid="page-backdrop" aria-hidden="true">
        {/* The fallback stays mounted as a poster underlay so the backdrop
            never flashes empty while the 3D chunk loads. */}
        <HeroFallback />
        {heroVisual === '3d' ? <Hero3DScene progressRef={pageProgressRef} /> : null}
      </div>
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section
        id="about"
        ref={heroRef}
        className="reference-hero cinematic-hero"
        data-testid="landing-primary-box"
        style={{ '--hero-parallax': heroProgress } as CSSProperties}
      >
        <div className="hero-parallax-background" data-testid="hero-parallax-background" aria-hidden="true" />
        <div className="hero-parallax-mid" data-testid="hero-parallax-mid" aria-hidden="true" />
        <div className="reference-hero-grid hero-parallax-foreground" data-testid="hero-parallax-foreground">
          <div className="reference-hero-copy">
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
        </div>
      </section>

      <section className="card reference-section-card corporate-business-section" aria-label={copy.business.title} data-testid="business-section">
        <ScrollReveal variant="fade-up" testId="reveal-business-head">
          <div className="reference-section-head">
            <div>
              <p className="section-label">{ui.platformLabel}</p>
              <h2 className="section-title reference-section-title">{ui.platformTitle}</h2>
            </div>
            <p className="body-copy reference-section-copy">{ui.platformBody}</p>
          </div>
        </ScrollReveal>

        <div className="reference-business-grid">
          <ScrollReveal variant="fly-left" testId="reveal-business-rail" className="business-architecture-rail">
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
          </ScrollReveal>

          <ScrollReveal variant="fly-right" testId="reveal-business-visual" className="business-architecture-visual">
            <ResourceCirculationFlow
              brand={copy.brand.name}
              title={copy.business.flowTitle}
              intro={copy.business.intro}
              phases={copy.business.flowPhases}
              activeIndex={activeFlowIndex}
              onSelect={setActiveFlowIndex}
            />
          </ScrollReveal>
        </div>
      </section>
      <footer className="site-footer" data-testid="landing-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
