'use client';

import { useMemo, useState } from 'react';

import { ChatPopup } from '@/components/chat-popup';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY, type Locale } from '@/lib/site-copy';
import profile from '@/sprints/v1/artifacts/content-normalized.json';

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = useMemo(() => SITE_COPY[locale], [locale]);

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section id="about" className="landing-single">
        <article className="hero-panel landing-main" data-testid="landing-primary-box">
          <div className="hero-copy">
            <h1 className="hero-title">{copy.hero.title}</h1>
            <p className="lead landing-subtitle">{copy.hero.lead}</p>
            <p className="body-copy" data-testid="landing-narrative">
              {copy.hero.body}
            </p>
            <section className="business-section" aria-label={copy.business.title} data-testid="business-section">
              <h2 className="section-title">{copy.business.title}</h2>
              <p className="body-copy">{copy.business.intro}</p>
              <div className="business-pillar-grid">
                {copy.business.pillars.map((pillar) => (
                  <article key={pillar.title} className="business-pillar-card">
                    <h3>{pillar.title}</h3>
                    <p>{pillar.detail}</p>
                  </article>
                ))}
              </div>
              <div className="business-flow">
                <p className="business-flow-title">{copy.business.flowTitle}</p>
                <ol>
                  {copy.business.flowSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </section>
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
            <div className="hero-actions">
              <ChatPopup triggerLabel={copy.hero.cta} />
            </div>
          </div>
        </article>
      </section>

      <footer className="site-footer">
        <div className="footer-facts">
          <p>
            <strong>Established</strong>
            <span>{profile.normalized_profile.established}</span>
          </p>
          <p>
            <strong>Address</strong>
            <span>{profile.normalized_profile.address_en}</span>
          </p>
          <p>
            <strong>Main line</strong>
            <span>{profile.normalized_profile.tel}</span>
          </p>
        </div>
        <p>{copy.footer.note}</p>
        <p>{copy.footer.rights}</p>
      </footer>
    </main>
  );
}
