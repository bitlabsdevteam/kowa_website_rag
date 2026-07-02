import { LocalizedFooter } from '@/components/localized-footer';
import { LocalizedTopMenu } from '@/components/localized-top-menu';
import { findLegacyExcerpt } from '@/lib/legacy-content';
import { SITE_COPY } from '@/lib/site-copy';

export default function WelcomePage() {
  const site = SITE_COPY.en;
  const copy = site.migratedPages;
  return (
    <main className="page shell">
      <section className="shell-header">
        <LocalizedTopMenu />
      </section>

      <section className="hero-panel">
        <span className="badge">{copy.welcomeBadge}</span>
        <h1 className="page-title">{copy.welcomeTitle}</h1>
        <p className="body-copy">{findLegacyExcerpt('new1.html')}</p>
      </section>

      <LocalizedFooter copy={site} />
    </main>
  );
}
