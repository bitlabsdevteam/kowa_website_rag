'use client';

import { LocalizedFooter } from '@/components/localized-footer';
import { LocalizedTopMenu } from '@/components/localized-top-menu';
import { findLegacyExcerpt } from '@/lib/legacy-content';
import { SITE_COPY } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

export default function AccessPage() {
  const [locale] = useLocale();
  const site = SITE_COPY[locale];
  const copy = site.migratedPages;
  return (
    <main className="page shell">
      <section className="shell-header">
        <LocalizedTopMenu />
      </section>

      <section className="hero-panel">
        <span className="badge">{copy.accessBadge}</span>
        <h1 className="page-title">{copy.accessTitle}</h1>
        <p className="body-copy">{findLegacyExcerpt('access1.html')}</p>
      </section>

      <LocalizedFooter copy={site} />
    </main>
  );
}
