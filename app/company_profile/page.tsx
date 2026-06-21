'use client';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

/** Core corporate facts, shown bilingually (JA / EN) regardless of UI locale. */
const COMPANY_FACTS = [
  { jaTerm: '資本金', jaValue: '5000万円', enTerm: 'Capital', enValue: '50 Million Yen' },
  { jaTerm: '設立', jaValue: '1994年', enTerm: 'Established', enValue: '1994' },
];

export default function CompanyProfilePage() {
  const [locale, setLocale] = useLocale();
  const copy = SITE_COPY[locale];

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section
        className="card page-surface company-profile-surface corporate-hero corporate-content-surface"
        data-testid="company-profile-page-content"
      >
        <div className="company-profile-hero company-profile-hero--centered">
          <span className="eyebrow">{copy.menu.companyProfile}</span>
          <h1 className="page-title company-profile-title">{copy.brand.name}</h1>
        </div>

        <ScrollReveal variant="fade-up">
          <div className="company-profile-facts">
            {COMPANY_FACTS.map((fact) => (
              <div key={fact.enTerm} className="cp-fact">
                <p className="cp-fact-lang cp-fact-lang--ja" lang="ja">
                  <span className="cp-fact-term">{fact.jaTerm}</span>
                  <span className="cp-fact-value">{fact.jaValue}</span>
                </p>
                <p className="cp-fact-lang cp-fact-lang--en" lang="en">
                  <span className="cp-fact-term">{fact.enTerm}</span>
                  <span className="cp-fact-value">{fact.enValue}</span>
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <LocalizedFooter copy={copy} />
    </main>
  );
}
