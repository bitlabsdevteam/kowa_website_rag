'use client';

import Image from 'next/image';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import { LocalizedFooter } from '@/components/localized-footer';
import { TopMenu } from '@/components/top-menu';
import { type Locale, SITE_COPY } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

/** Gunma factory exterior — the G.P. Polymer regeneration line site. Caption
 * shown in the visitor's own locale, plus an English line underneath for
 * non-English locales (matching the COMPANY_FACTS bilingual pattern). */
const FACTORY_PHOTO = {
  src: '/images/company/kowa-gunma-factory-street.jpg',
  jaEyebrow: '生産拠点',
  enEyebrow: 'Production Site',
  jaTitle: '群馬工場',
  enTitle: 'Gunma Factory',
  jaCaption: 'ジー・ピー・ポリマー株式会社の再生ライン拠点。',
  enCaption: 'G.P. Polymer Co.,LTD — circular supply line.',
  zhHantCaption: 'G.P. Polymer Co.,LTD 再生產線據點。',
  zhHansCaption: 'G.P. Polymer Co.,LTD 再生产线据点。',
};

const FACTORY_CAPTION_BY_LOCALE: Record<Locale, string> = {
  ja: FACTORY_PHOTO.jaCaption,
  en: FACTORY_PHOTO.enCaption,
  'zh-Hant': FACTORY_PHOTO.zhHantCaption,
  'zh-Hans': FACTORY_PHOTO.zhHansCaption,
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
  { ja: 'ジー・イー・ティ株式会社', en: 'Green Eco technology Co.,LTD' },
  { ja: 'ジー・ピー・ポリマー株式会社', en: 'G.P. Polymer Co.,LTD' },
];

export default function CompanyProfilePage() {
  const [locale, setLocale] = useLocale();
  const copy = SITE_COPY[locale];
  const profile = copy.companyProfile;

  const factoryPrimaryCaption = FACTORY_CAPTION_BY_LOCALE[locale];

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
              <span lang={locale}>{factoryPrimaryCaption}</span>
              {locale !== 'en' && (
                <span className="cp-factory-caption-en" lang="en">
                  {FACTORY_PHOTO.enCaption}
                </span>
              )}
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

        <ScrollReveal variant="fade-up">
          <section className="cp-timeline" aria-labelledby="cp-timeline-heading">
            <p className="cp-timeline-eyebrow" id="cp-timeline-heading">
              {profile.timelineLabel}
            </p>
            <p className="cp-timeline-intro">{profile.timelineIntro}</p>
            <ol className="cp-timeline-list">
              {profile.timeline.map((item) => (
                <li key={`${item.year}-${item.title}`} className="cp-timeline-item">
                  <div className="cp-timeline-year">{item.year}</div>
                  <article className="cp-timeline-card">
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        </ScrollReveal>
      </section>

      <LocalizedFooter copy={copy} />
    </main>
  );
}
