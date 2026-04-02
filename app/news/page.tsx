'use client';

import { useMemo, useState } from 'react';

import { TopMenu } from '@/components/top-menu';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

export default function NewsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = useMemo(() => SITE_COPY[locale], [locale]);

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section className="card stack-list page-surface" data-testid="news-page-content">
        <span className="eyebrow">{copy.menu.news}</span>
        <h1 className="page-title">{copy.news.title}</h1>
        {copy.news.entries.map((entry) => (
          <p key={entry} className="body-copy">
            {entry}
          </p>
        ))}
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
