import { SiteFooterBar } from '@/components/site-footer-bar';
import { TopMenu } from '@/components/top-menu';
import { findLegacyExcerpt } from '@/lib/legacy-content';
import { SITE_COPY } from '@/lib/site-copy';

export default function InquiryPage() {
  const site = SITE_COPY.en;
  const copy = site.migratedPages;
  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={site.menu} brand={site.brand} locale="en" localeLabel={site.menu.localeLabel} />
      </section>

      <section className="hero-panel">
        <span className="badge">{copy.inquiryBadge}</span>
        <h1 className="page-title">{copy.inquiryTitle}</h1>
        <p className="body-copy">{findLegacyExcerpt('form1.html')}</p>
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={site.footer.copyright} termsLabel={site.footer.termsLabel} social={site.footer.social} />
      </footer>
    </main>
  );
}
