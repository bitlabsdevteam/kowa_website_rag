'use client';

import { HeroParallaxStage } from '@/components/home/hero-parallax-stage';
import { HeroYardParallax } from '@/components/home/hero-yard-parallax';
import { HomeBusinessParallax } from '@/components/home/home-business-parallax';
import { HomeWhatWeDo } from '@/components/home/home-what-we-do';
import { LocalizedFooter } from '@/components/localized-footer';
import { HeroSection } from '@/components/ui/hero-section-2';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY, type Locale } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

const HOME_UI: Record<
  Locale,
  {
    heroFlag: string;
    secondaryCta: string;
  }
> = {
  en: {
    heroFlag: 'Tokyo, Japan | Global trading and resource circulation',
    secondaryCta: 'More Info',
  },
  ja: {
    heroFlag: 'Tokyo, Japan | グローバルトレードと資源循環',
    secondaryCta: '詳細を見る',
  },
  'zh-Hans': {
    heroFlag: 'Tokyo, Japan | 全球贸易与资源循环',
    secondaryCta: '了解更多',
  },
  'zh-Hant': {
    heroFlag: 'Tokyo, Japan | 全球貿易與資源循環',
    secondaryCta: '瞭解更多',
  },
};

export function HomePageClient() {
  const [locale, setLocale] = useLocale();
  const copy = SITE_COPY[locale];
  const ui = HOME_UI[locale];

  return (
    <main className="page shell reference-site">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <HeroParallaxStage>
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
        fullBleed
        media={<HeroYardParallax src="/images/company/container-yard.jpg" alt={copy.hero.visualAlt} />}
        />
      </HeroParallaxStage>

      {/* The 320vh factory scroll track renders inside HomeBusinessParallax,
          between the OUR BUSINESS and PRODUCTS bands. */}
      <HomeBusinessParallax locale={locale} copy={copy} />

      <HomeWhatWeDo copy={copy} />

      <LocalizedFooter copy={copy} />
    </main>
  );
}
