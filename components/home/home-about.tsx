'use client';

import Link from 'next/link';

import { PRODUCT_SHOWCASE_COPY } from '@/lib/product-showcase-copy';
import type { Locale, SiteCopy } from '@/lib/site-copy';

type HomeAboutProps = {
  copy: SiteCopy;
  locale: Locale;
};

/** Kowa's founding year, per the verified company-profile timeline (companyProfile.timeline[0]). */
const FOUNDING_YEAR = 1993;

export function HomeAbout({ copy, locale }: HomeAboutProps) {
  const ui = copy.home.about;
  const pillars = copy.companyProfile.focusCards;
  const milestoneCount = copy.companyProfile.timeline.length;
  const yearsInOperation = new Date().getFullYear() - FOUNDING_YEAR;
  const businessLineCount = PRODUCT_SHOWCASE_COPY[locale].chapters.length;

  return (
    <section id="home-about" className="home-about" aria-label={ui.display}>
      <div className="home-about-inner">
        <p className="section-heading-display">{ui.display}</p>
        <p className="section-heading-subtitle">{ui.subtitle}</p>
        <p className="home-about-statement">{ui.statement}</p>

        <div className="kpi-strip">
          <div className="kpi-item">
            <p className="kpi-value">{yearsInOperation}+</p>
            <p className="kpi-label">{ui.kpi.yearsLabel}</p>
          </div>
          <div className="kpi-item">
            <p className="kpi-value">{ui.kpi.capitalValue}</p>
            <p className="kpi-label">{ui.kpi.capitalLabel}</p>
          </div>
          <div className="kpi-item">
            <p className="kpi-value">{businessLineCount}</p>
            <p className="kpi-label">{ui.kpi.linesLabel}</p>
          </div>
        </div>

        <p className="about-pillars-label">{ui.pillarsLabel}</p>
        <div className="about-pillars">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="about-pillar-card">
              <h3 className="about-pillar-card-title">{pillar.title}</h3>
              <p className="about-pillar-card-desc">{pillar.detail}</p>
            </div>
          ))}
        </div>

        <Link href="/company_profile#timeline" className="about-history-link">
          {FOUNDING_YEAR} · {milestoneCount} — {ui.historyLinkLabel}
        </Link>

        <nav className="pillar-links" aria-label={ui.linksLabel}>
          <Link href="/company_profile" className="pillar-link">
            {copy.menu.companyProfile}
          </Link>
          <Link href="/business" className="pillar-link">
            {copy.home.business.display}
          </Link>
          <Link href="/contact_us" className="pillar-link">
            {copy.menu.contactUs}
          </Link>
        </nav>
      </div>
    </section>
  );
}
