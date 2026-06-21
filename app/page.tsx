'use client';

import { Recycle, ShoppingCart, Truck } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';
import { FeatureGrid, type Feature } from '@/components/ui/modern-feature-grid';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
import { OriginButton } from '@/components/ui/origin-button';
import { Typewriter } from '@/components/ui/typewriter';
import { SITE_COPY, type Locale } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

const HOME_UI: Record<
  Locale,
  {
    heroFlag: string;
    secondaryCta: string;
    snapshotLabels: [string, string, string];
    platformLabel: string;
    processSteps: [
      { title: string; desc: string; points: string[] },
      { title: string; desc: string; points: string[] },
      { title: string; desc: string; points: string[] },
    ];
  }
> = {
  en: {
    heroFlag: 'Tokyo, Japan | Global trading and resource circulation',
    secondaryCta: 'More Info',
    snapshotLabels: ['Head office', 'Operating model', 'Corporate route'],
    platformLabel: 'How We Work',
    processSteps: [
      {
        title: 'Buy plastics',
        desc: 'We source plastics destined for waste and bring them back into productive use.',
        points: [
          'Production-loss material & waste plastic from manufacturers',
          'Mixed and post-industrial plastics, plus resin procurement',
          'Collected domestically across Japan',
        ],
      },
      {
        title: 'Process the plastics',
        desc: 'Material is sorted and regenerated into clean, reusable raw stock.',
        points: [
          'Sort & dismantle by resin type and blend',
          'Crush, compress, and mix into raw material',
          'Regenerated on the G.P. Polymer / Gunma line',
        ],
      },
      {
        title: 'Package & sell',
        desc: 'Regenerated stock is repackaged and routed back into supply chains.',
        points: [
          'Repackaged into reusable raw material',
          'Exported overseas, with a focus on Southeast Asia',
          'Supplied to domestic industrial supply chains',
        ],
      },
    ],
  },
  ja: {
    heroFlag: 'Tokyo, Japan | グローバルトレードと資源循環',
    secondaryCta: '詳細を見る',
    snapshotLabels: ['本社拠点', '運営モデル', '企業導線'],
    platformLabel: '私たちの進め方',
    processSteps: [
      {
        title: 'プラスチックを仕入れる',
        desc: '廃棄されるプラスチックを仕入れ、再び資源として活かします。',
        points: [
          'メーカーからの生産ロス材・廃プラスチック',
          '混合・産業系プラスチック、樹脂の調達',
          '日本国内での回収',
        ],
      },
      {
        title: 'プラスチックを加工する',
        desc: '選別・再生を経て、清潔で再利用可能な原料に戻します。',
        points: [
          '樹脂特性・配合ごとの選別と解体',
          '粉砕・圧縮・混合により原料化',
          'G.P.ポリマー／群馬ラインで再生',
        ],
      },
      {
        title: '梱包して販売する',
        desc: '再生した原料を梱包し、サプライチェーンへ戻します。',
        points: [
          '再利用可能な原料へ再梱包',
          '東南アジアを中心に海外へ輸出',
          '国内の産業向けサプライへ供給',
        ],
      },
    ],
  },
  zh: {
    heroFlag: 'Tokyo, Japan | 全球贸易与资源循环',
    secondaryCta: '了解更多',
    snapshotLabels: ['总部', '运营模型', '企业入口'],
    platformLabel: '我们的运作方式',
    processSteps: [
      {
        title: '采购塑料',
        desc: '采购即将被废弃的塑料，让其重新成为资源。',
        points: [
          '来自制造商的生产损耗料与废塑料',
          '混合及工业来源塑料，以及树脂采购',
          '在日本国内回收',
        ],
      },
      {
        title: '加工塑料',
        desc: '经过分选与再生，转化为洁净、可再利用的原料。',
        points: [
          '按树脂类型与配合进行分选、拆解',
          '粉碎、压缩、混合制成原料',
          '在 G.P. Polymer／群马产线再生',
        ],
      },
      {
        title: '打包与销售',
        desc: '将再生原料重新打包，送回供应链。',
        points: [
          '重新打包为可用原料',
          '以东南亚为主出口海外',
          '面向国内产业供应链供给',
        ],
      },
    ],
  },
};

export default function HomePage() {
  const [locale, setLocale] = useLocale();
  // When reduced motion is preferred we render the full headline statically
  // instead of the looping typewriter.
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  // Hero-scoped scroll progress drives the copy-layer parallax drift.
  const heroProgress = useScrollProgress(heroRef);
  const copy = SITE_COPY[locale];
  const ui = HOME_UI[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  // Map the localized process steps into feature-grid cards (one lucide icon
  // per stage).
  const STEP_ICONS = [ShoppingCart, Recycle, Truck];
  const features: Feature[] = ui.processSteps.map((step, index) => ({
    Icon: STEP_ICONS[index % STEP_ICONS.length],
    title: step.title,
    description: step.desc,
  }));

  return (
    <main className="page shell reference-site">
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
            <h1 className="hero-title reference-hero-title">
              {reducedMotion ? (
                copy.hero.title
              ) : (
                <>
                  {copy.hero.titlePrefix}
                  <Typewriter
                    text={copy.hero.titleTyped}
                    speed={55}
                    deleteSpeed={32}
                    waitTime={2200}
                    initialDelay={600}
                    className="hero-title-typed"
                    cursorClassName="hero-title-cursor"
                  />
                </>
              )}
            </h1>
            <p className="lead reference-hero-lead">{copy.hero.lead}</p>
            <p className="body-copy reference-hero-body" data-testid="landing-narrative">
              {copy.hero.body}
            </p>
            <div className="hero-actions">
              <OriginButton
                onClick={() => {
                  const target = document.getElementById('business');
                  if (target) {
                    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
                  }
                  if (typeof history !== 'undefined') {
                    history.replaceState(null, '', '#business');
                  }
                }}
              >
                {ui.secondaryCta}
              </OriginButton>
            </div>
          </div>
        </div>
      </section>

      <section id="business" className="corporate-business-section is-boxless" aria-label={copy.business.title} data-testid="business-section">
        <ScrollReveal variant="fade-up" testId="reveal-business-head">
          <FeatureGrid sectionTitle={ui.platformLabel} sectionDescription={copy.business.intro} features={features} />
        </ScrollReveal>
      </section>
      <LocalizedFooter copy={copy} />
    </main>
  );
}
