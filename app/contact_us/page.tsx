'use client';

import { useEffect, useState } from 'react';

import { ContactForm } from '@/components/contact-form';
import { LocationMap } from '@/components/location-map';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

export default function ContactUsPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = SITE_COPY[locale];
  const contact = copy.contactPage;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section className="card page-surface contact-page-surface" data-testid="contact-page-content">
        <div className="contact-page-layout">
          <div className="contact-page-intro">
            <span className="eyebrow">{contact.eyebrow}</span>
            <h1 className="page-title contact-page-title">{contact.title}</h1>
            <p className="body-copy contact-page-lead">{contact.lead}</p>

            <div className="contact-page-detail">
              <p className="section-label">{contact.detailLabel}</p>
              <a className="contact-page-email" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>
          </div>

          <aside className="contact-page-form-card">
            <ContactForm copy={contact} />
          </aside>
        </div>
      </section>

      <section className="card page-surface contact-map-surface" data-testid="contact-map-section">
        <LocationMap copy={contact} />
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}
