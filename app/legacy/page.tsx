'use client';

import legacyPages from '@/data/legacy-pages.json';
import { LocalizedFooter } from '@/components/localized-footer';
import { LocalizedTopMenu } from '@/components/localized-top-menu';
import { SITE_COPY } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

export default function LegacyPage() {
  const [locale] = useLocale();
  const site = SITE_COPY[locale];
  const copy = site.migratedPages;
  return (
    <main className="page shell">
      <section className="shell-header">
        <LocalizedTopMenu />
      </section>

      <section className="hero-panel">
        <span className="badge">{copy.legacyBadge}</span>
        <h1 className="page-title">{copy.legacyTitle}</h1>
        <p className="body-copy">{copy.legacyLead}</p>
      </section>

      <section className="grid">
        {legacyPages.map((p) => (
          <article key={p.url} className="card">
            <h3 className="legacy-title">{p.title || p.url}</h3>
            <p className="legacy-url">{p.url}</p>
            <p className="body-copy">{p.excerpt || copy.legacyNoExcerpt}</p>
          </article>
        ))}
      </section>

      <LocalizedFooter copy={site} />
    </main>
  );
}
