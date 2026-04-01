'use client';

import { useMemo, useState } from 'react';

import { TopMenu } from '@/components/top-menu';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

export default function CompanyProfilePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = useMemo(() => SITE_COPY[locale], [locale]);

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section className="card page-surface company-profile-surface" data-testid="company-profile-page-content">
        <span className="eyebrow">{copy.menu.companyProfile}</span>
        <h1 className="page-title">{copy.companyProfile.title}</h1>
        <p className="body-copy">{copy.companyProfile.summary}</p>

        <div className="company-profile-grid">
          {copy.companyProfile.blocks.map((block) => (
            <article key={block.heading} className="company-profile-card">
              <h2>{block.heading}</h2>
              <ul>
                {block.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} />
      </footer>
    </main>
  );
}
