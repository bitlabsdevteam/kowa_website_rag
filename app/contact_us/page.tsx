'use client';

import { ContactForm } from '@/components/contact-form';
import { LocationMap } from '@/components/location-map';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

export default function ContactUsPage() {
  const [locale, setLocale] = useLocale();
  const copy = SITE_COPY[locale];
  const contact = copy.contactPage;

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
              <dl className="contact-page-info">
                <div className="contact-page-info-row">
                  <dt>{contact.phoneLabel}</dt>
                  <dd>
                    <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a>
                  </dd>
                </div>
                <div className="contact-page-info-row">
                  <dt>{contact.faxLabel}</dt>
                  <dd>{contact.fax}</dd>
                </div>
                <div className="contact-page-info-row">
                  <dt>{contact.emailRowLabel}</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  </dd>
                </div>
                <div className="contact-page-info-row">
                  <dt>{contact.hoursLabel}</dt>
                  <dd>{contact.hours}</dd>
                </div>
              </dl>
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

      <LocalizedFooter copy={copy} />
    </main>
  );
}
