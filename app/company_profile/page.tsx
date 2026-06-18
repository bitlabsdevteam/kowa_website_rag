'use client';

import { useEffect, useState } from 'react';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

export default function CompanyProfilePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = SITE_COPY[locale];
  const profile = copy.companyProfile;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section
        className="card page-surface company-profile-surface corporate-hero corporate-content-surface"
        data-testid="company-profile-page-content"
      >
        <div className="company-profile-hero">
          <div className="company-profile-hero-copy">
            <span className="eyebrow">{profile.introLabel}</span>
            <h1 className="page-title company-profile-title">{profile.title}</h1>
            <p className="body-copy company-profile-summary">{profile.summary}</p>
          </div>
        </div>

        <ScrollReveal variant="fade-up">
          <section className="company-profile-dossier company-profile-dossier--cinematic">
        <section className="company-profile-timeline-section" aria-labelledby="company-profile-timeline-heading">
          <div className="company-profile-section-head">
            <div>
              <p className="section-label">{profile.timelineLabel}</p>
              <h2 id="company-profile-timeline-heading" className="section-title company-profile-section-title">
                {profile.timelineTitle}
              </h2>
            </div>
            <p className="body-copy company-profile-timeline-intro">{profile.timelineIntro}</p>
          </div>

          <ol className="company-profile-timeline">
            {profile.timeline.map((item) => (
              <li key={`${item.year}-${item.title}`} className="company-profile-timeline-item">
                <div className="company-profile-timeline-year">{item.year}</div>
                <article className="company-profile-timeline-card">
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              </li>
            ))}
          </ol>
        </section>
          </section>
        </ScrollReveal>
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
