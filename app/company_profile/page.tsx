'use client';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

/** Core corporate facts, shown bilingually (JA / EN) regardless of UI locale. */
const COMPANY_FACTS = [
  { jaTerm: '社名', jaValue: '広和通商株式会社', enTerm: 'Company', enValue: 'Kowa Trade And Commerce Co., Ltd.' },
  {
    jaTerm: '住所',
    jaValue: '東京都港区三田2-10-6 レオマビル5F',
    enTerm: 'Address',
    enValue: 'Reoma Bldg. 5F, 2-10-6, Mita, Minato-Ku, Tokyo 108-0073, JAPAN',
  },
  { jaTerm: '電話', jaValue: '03-3455-1699', enTerm: 'TEL', enValue: '+81-3-3455-1699' },
  { jaTerm: 'FAX', jaValue: '03-3455-1691', enTerm: 'FAX', enValue: '+81-3-3455-1691' },
  { jaTerm: '代表取締役', jaValue: '李 耀聡（リー・ヤオチョン）', enTerm: 'Managing Director', enValue: 'Y.C. Lee' },
  { jaTerm: '資本金', jaValue: '5000万円', enTerm: 'Capital', enValue: '50 Million Yen' },
  { jaTerm: '設立', jaValue: '1994年', enTerm: 'Established', enValue: '1994' },
];

/** Affiliated / group companies, shown bilingually under the corporate facts. */
const RELATED_COMPANIES = [
  { ja: 'ジーピーポリマー株式会社', en: 'G.P. Polymer Co., Ltd.' },
  { ja: 'ジーイーティ株式会社', en: 'Green EcoTechnology Co., Ltd. (G.E.T)' },
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

        <ScrollReveal variant="fade-up">
          <div className="company-profile-facts company-profile-related">
            <div className="cp-fact cp-fact--group">
              <p className="cp-fact-lang cp-fact-lang--ja" lang="ja">
                <span className="cp-fact-term">関連会社</span>
              </p>
              <p className="cp-fact-lang cp-fact-lang--en" lang="en">
                <span className="cp-fact-term">Corporate Companies</span>
              </p>
            </div>
            {RELATED_COMPANIES.map((company) => (
              <div key={company.en} className="cp-fact">
                <p className="cp-fact-lang cp-fact-lang--ja" lang="ja">
                  <span className="cp-fact-value">{company.ja}</span>
                </p>
                <p className="cp-fact-lang cp-fact-lang--en" lang="en">
                  <span className="cp-fact-value">{company.en}</span>
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
