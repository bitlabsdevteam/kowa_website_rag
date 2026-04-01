import Link from 'next/link';

import { AuthControls } from '@/components/auth-controls';
import { ChatWidget } from '@/components/chat-widget';
import { TopMenu } from '@/components/top-menu';
import profile from '@/sprints/v1/artifacts/content-normalized.json';

export default function HomePage() {
  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu />
        <AuthControls />
      </section>

      <section className="hero-grid">
        <article className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">Kowa Website + grounded retrieval</span>
            <h1 className="hero-title">Modern trade intelligence with source-backed answers.</h1>
            <p className="lead">
              Kowa&apos;s public website is being reshaped into a calmer, more trustworthy experience: modern editorial design, clearer navigation,
              and a retrieval assistant that points back to approved source material.
            </p>
            <div className="hero-actions">
              <Link href="#assistant" className="button-primary">
                Open assistant
              </Link>
              <Link href="/legacy" className="button-secondary">
                Review legacy coverage
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-value">5</span>
                <span className="stat-label">Migrated legacy destination pages now mapped into the new information architecture.</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">1</span>
                <span className="stat-label">Grounded assistant entry point embedded directly into the landing experience.</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">v5</span>
                <span className="stat-label">Current sprint direction for design quality, admin operations, and containerized delivery.</span>
              </div>
            </div>
          </div>
        </article>

        <aside className="hero-aside">
          <article className="card">
            <span className="badge">Current direction</span>
            <h2 className="section-title">Trust before polish.</h2>
            <p className="body-copy">
              The product direction is intentionally calm and editorial: better reading rhythm, restrained color, cleaner navigation, and explicit
              evidence behind assistant answers.
            </p>
          </article>

          <article className="mini-note">
            <strong>What this release is fixing</strong>
            <p>Broken admin navigation, inconsistent UI surfaces, and low-signal chat citations are being replaced by a more coherent v5 system.</p>
          </article>
        </aside>
      </section>

      <section className="section-split">
        <article className="card">
          <span className="badge">Company profile</span>
          <h2 className="section-title">{profile.normalized_profile.company_name_en}</h2>
          <p className="body-copy">
            Migrated company information remains accessible as structured source data while the front-end evolves toward a more premium corporate
            presentation.
          </p>
          <div className="meta-grid">
            <div className="meta-item">
              <strong>Address</strong>
              <span>{profile.normalized_profile.address_en}</span>
            </div>
            <div className="meta-item">
              <strong>Established</strong>
              <span>{profile.normalized_profile.established}</span>
            </div>
            <div className="meta-item">
              <strong>Telephone</strong>
              <span>{profile.normalized_profile.tel}</span>
            </div>
            <div className="meta-item">
              <strong>Fax</strong>
              <span>{profile.normalized_profile.fax}</span>
            </div>
            <div className="meta-item">
              <strong>Capital</strong>
              <span>{profile.normalized_profile.capital}</span>
            </div>
            <div className="meta-item">
              <strong>Coverage</strong>
              <span>Legacy migration artifacts, profile data, and source-backed question handling.</span>
            </div>
          </div>
        </article>

        <article className="card">
          <span className="badge">Trust model</span>
          <h2 className="section-title">What users should expect from answers.</h2>
          <ul className="trust-list">
            <li>
              <strong>Grounded by default</strong>
              Answers are tied to available Kowa source content and presented with linked citations.
            </li>
            <li>
              <strong>Clear scope</strong>
              The assistant is optimized for company profile, migrated business information, and covered legacy source material.
            </li>
            <li>
              <strong>Graceful fallback</strong>
              Unsupported questions should return an explicit no-answer state instead of invented content.
            </li>
          </ul>
        </article>
      </section>

      <section id="assistant" className="content-grid">
        <article className="card">
          <span className="badge">Assistant</span>
          <h2 className="section-title">Ask the grounded RAG assistant.</h2>
          <p className="body-copy">
            The chat surface has been refocused around evidence visibility, simpler prompting, and a clearer distinction between grounded and
            unsupported responses.
          </p>
        </article>

        <article className="card">
          <ChatWidget />
        </article>
      </section>
    </main>
  );
}
