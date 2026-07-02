'use client';

import { Recycle, ShoppingCart, Truck } from 'lucide-react';
import { useEffect } from 'react';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { FeatureGrid, type Feature } from '@/components/ui/modern-feature-grid';
import { HeroSection } from '@/components/ui/hero-section-2';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
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
  'zh-Hans': {
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
  'zh-Hant': {
    heroFlag: 'Tokyo, Japan | 全球貿易與資源循環',
    secondaryCta: '瞭解更多',
    snapshotLabels: ['總部', '運營模型', '企業入口'],
    platformLabel: '我們的運作方式',
    processSteps: [
      {
        title: '採購塑料',
        desc: '採購即將被廢棄的塑料，讓其重新成為資源。',
        points: [
          '來自製造商的生產損耗料與廢塑料',
          '混合及工業來源塑料，以及樹脂採購',
          '在日本國內回收',
        ],
      },
      {
        title: '加工塑料',
        desc: '經過分選與再生，轉化為潔淨、可再利用的原料。',
        points: [
          '按樹脂類型與配合進行分選、拆解',
          '粉碎、壓縮、混合製成原料',
          '在 G.P. Polymer／群馬產線再生',
        ],
      },
      {
        title: '打包與銷售',
        desc: '將再生原料重新打包，送回供應鏈。',
        points: [
          '重新打包為可用原料',
          '以東南亞為主出口海外',
          '面向國內產業供應鏈供給',
        ],
      },
    ],
  },
};

export default function HomePage() {
  const [locale, setLocale] = useLocale();
  const copy = SITE_COPY[locale];
  const ui = HOME_UI[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

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

      <HeroSection
        id="about"
        data-testid="landing-primary-box"
        logo={{ text: copy.brand.name }}
        slogan={ui.heroFlag}
        title={
          <>
            {copy.hero.titlePrefix}
            <br />
            <span className="hero-section-title-accent">{copy.hero.titleTyped[0]}</span>
          </>
        }
        subtitle={copy.hero.lead}
        callToAction={{
          text: ui.secondaryCta,
          href: '#business',
          onClick: (event) => {
            event.preventDefault();
            const target = document.getElementById('business');
            target?.scrollIntoView({ behavior: 'smooth' });
            if (typeof history !== 'undefined') {
              history.replaceState(null, '', '#business');
            }
          },
        }}
        backgroundImage="/hero-recycling.svg"
      />

      <section id="business" className="corporate-business-section is-boxless" aria-label={copy.business.title} data-testid="business-section">
        <ScrollReveal variant="fade-up" testId="reveal-business-head">
          <FeatureGrid sectionTitle={ui.platformLabel} sectionDescription={copy.business.intro} features={features} />
        </ScrollReveal>
      </section>
      <LocalizedFooter copy={copy} />
    </main>
  );
}
