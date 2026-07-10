'use client';

import { useEffect } from 'react';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { HomeBusinessGrid } from '@/components/home/home-business-grid';
import { HomeBusinessStory } from '@/components/home/home-business-story';
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

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

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

      <ScrollReveal variant="fade-up" testId="reveal-home-business-story">
        <HomeBusinessStory copy={copy} />
      </ScrollReveal>

      <ScrollReveal variant="fade-up" testId="reveal-business-head">
        <HomeBusinessGrid locale={locale} copy={copy} />
      </ScrollReveal>

      <ScrollReveal variant="fade-up" testId="reveal-home-about">
        <HomeWhatWeDo copy={copy} />
      </ScrollReveal>

      <LocalizedFooter copy={copy} />
    </main>
  );
}
