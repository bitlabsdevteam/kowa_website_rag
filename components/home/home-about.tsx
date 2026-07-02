'use client';

import Link from 'next/link';

import type { SiteCopy } from '@/lib/site-copy';

type HomeAboutProps = {
  copy: SiteCopy;
};

export function HomeAbout({ copy }: HomeAboutProps) {
  const ui = copy.home.about;
  // Founded / Capital / Head office — the first three verified facts on the
  // company-profile fact sheet (lib/site-copy.ts -> companyProfile.facts).
  const stats = copy.companyProfile.facts.slice(0, 3);

  return (
    <section id="home-about" className="home-about" aria-label={ui.display}>
      <div className="home-about-inner">
        <p className="section-heading-display">{ui.display}</p>
        <p className="section-heading-subtitle">{ui.subtitle}</p>
        <p className="home-about-statement">{ui.statement}</p>

        <div className="stat-cards">
          {stats.map((fact) => (
            <div key={fact.label} className="stat-card">
              <p className="stat-card-value">{fact.value}</p>
              <p className="stat-card-label">{fact.label}</p>
            </div>
          ))}
        </div>

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
