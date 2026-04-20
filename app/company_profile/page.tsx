'use client';

import { useEffect, useState } from 'react';

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
            <span className="eyebrow">{copy.menu.companyProfile}</span>
            <p className="executive-kicker">{profile.introLabel}</p>
            <h1 className="page-title company-profile-title">{profile.title}</h1>
            <p className="body-copy company-profile-summary">{profile.summary}</p>

            <article className="company-profile-intro-panel">
              <p className="section-label">{profile.introLabel}</p>
              <h2 className="company-profile-intro-title">{profile.introTitle}</h2>
              <p className="body-copy">{profile.introBody}</p>
            </article>
          </div>

          <aside className="company-profile-facts-panel" aria-label={profile.factLabel}>
            <h2 className="company-profile-facts-title">{profile.factLabel}</h2>
            <dl className="company-profile-facts-list">
              {profile.facts.map((fact) => (
                <div key={fact.label} className="company-profile-fact-row">
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <section className="company-profile-statement-section" aria-labelledby="company-profile-statement-heading">
          <div className="company-profile-section-head">
            <p className="section-label">{profile.statementLabel}</p>
            <h2 id="company-profile-statement-heading" className="section-title company-profile-section-title">
              {profile.statementLabel}
            </h2>
          </div>

          <div className="company-profile-statement-grid">
            {profile.statements.map((statement) => (
              <article key={statement.language} className="company-profile-statement-card">
                <p className="company-profile-statement-language">{statement.language}</p>
                <p>{statement.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="company-profile-focus-section" aria-labelledby="company-profile-focus-heading">
          <div className="company-profile-section-head">
            <p className="section-label">{profile.focusLabel}</p>
            <h2 id="company-profile-focus-heading" className="section-title company-profile-section-title">
              {profile.focusLabel}
            </h2>
          </div>

          <div className="company-profile-focus-grid">
            {profile.focusCards.map((card) => (
              <article key={card.title} className="company-profile-focus-card">
                <h3>{card.title}</h3>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </section>

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

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
