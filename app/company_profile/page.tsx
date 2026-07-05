'use client';

import Image from 'next/image';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
import { SITE_COPY } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

/** Gunma factory exterior — the G.P. Polymer regeneration line site. Bilingual
 * caption shown regardless of UI locale, matching the COMPANY_FACTS pattern. */
const FACTORY_PHOTO = {
  src: '/images/company/kowa-gunma-factory-exterior.jpg',
  jaEyebrow: '生産拠点',
  enEyebrow: 'Production Site',
  jaTitle: '群馬工場',
  enTitle: 'Gunma Factory',
  jaCaption: 'ジーピーポリマー株式会社の再生ラインを擁する、資源循環の現場。',
  enCaption: 'Home to the G.P. Polymer regeneration line — where collected material re-enters Kowa’s circular supply.',
};

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
          <figure className="cp-factory" data-testid="company-profile-factory">
            <div className="cp-factory-frame">
              <Image
                src={FACTORY_PHOTO.src}
                alt={`${FACTORY_PHOTO.enTitle} exterior`}
                fill
                sizes="(max-width: 860px) 100vw, 860px"
                className="cp-factory-image"
                priority={false}
              />
              <div className="cp-factory-scrim" aria-hidden="true" />
              <figcaption className="cp-factory-caption">
                <span className="cp-factory-eyebrow">
                  <span lang="ja">{FACTORY_PHOTO.jaEyebrow}</span>
                  <span className="cp-factory-eyebrow-divider" aria-hidden="true" />
                  <span lang="en">{FACTORY_PHOTO.enEyebrow}</span>
                </span>
                <span className="cp-factory-title" lang="ja">
                  {FACTORY_PHOTO.jaTitle}
                </span>
                <span className="cp-factory-title cp-factory-title--en" lang="en">
                  {FACTORY_PHOTO.enTitle}
                </span>
              </figcaption>
            </div>
            <p className="cp-factory-caption-body">
              <span lang="ja">{FACTORY_PHOTO.jaCaption}</span>
              <span className="cp-factory-caption-en" lang="en">
                {FACTORY_PHOTO.enCaption}
              </span>
            </p>
          </figure>
        </ScrollReveal>

        <ScrollReveal variant="fade-up">
          <dl className="company-profile-facts">
            {COMPANY_FACTS.map((fact) => (
              <div key={fact.enTerm} className="cp-fact">
                <dt className="cp-fact-label">
                  <span className="cp-fact-term cp-fact-term--ja" lang="ja">
                    {fact.jaTerm}
                  </span>
                  <span className="cp-fact-term cp-fact-term--en" lang="en">
                    {fact.enTerm}
                  </span>
                </dt>
                <dd className="cp-fact-values">
                  <span className="cp-fact-value cp-fact-value--ja" lang="ja">
                    {fact.jaValue}
                  </span>
                  <span className="cp-fact-value cp-fact-value--en" lang="en">
                    {fact.enValue}
                  </span>
                </dd>
              </div>
            ))}

            <div className="cp-fact">
              <dt className="cp-fact-label">
                <span className="cp-fact-term cp-fact-term--ja" lang="ja">
                  関連会社
                </span>
                <span className="cp-fact-term cp-fact-term--en" lang="en">
                  Corporate Companies
                </span>
              </dt>
              <dd className="cp-fact-values cp-fact-values--list">
                {RELATED_COMPANIES.map((company) => (
                  <span key={company.en} className="cp-related">
                    <span className="cp-fact-value cp-fact-value--ja" lang="ja">
                      {company.ja}
                    </span>
                    <span className="cp-fact-value cp-fact-value--en" lang="en">
                      {company.en}
                    </span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </ScrollReveal>
      </section>

      <LocalizedFooter copy={copy} />
    </main>
  );
}
