import { ChatPopup } from '@/components/chat-popup';
import { TopMenu } from '@/components/top-menu';
import profile from '@/sprints/v1/artifacts/content-normalized.json';

export default function HomePage() {
  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu />
      </section>

      <section className="landing-single">
        <article className="hero-panel landing-main" data-testid="landing-primary-box">
          <div className="hero-copy">
            <span className="eyebrow">Overview</span>
            <h1 className="hero-title">Kowa Trade &amp; Commerce</h1>
            <p className="lead landing-subtitle">Editorial clarity for trade operations, recycling capability, and source-grounded assistant answers.</p>
            <p className="body-copy" data-testid="landing-narrative">
              Kowa handles synthetic resin raw materials, recycled plastics processing, battery pack development support, and industrial machinery
              import/export operations. This overview keeps the core business context in one place so users can move directly into grounded Q&amp;A.
            </p>
            <div className="hero-actions">
              <ChatPopup />
            </div>
            <div className="fact-row">
              <div className="fact-item">
                <strong>Established</strong>
                <span>{profile.normalized_profile.established}</span>
              </div>
              <div className="fact-item">
                <strong>Address</strong>
                <span>{profile.normalized_profile.address_en}</span>
              </div>
              <div className="fact-item">
                <strong>Main line</strong>
                <span>{profile.normalized_profile.tel}</span>
              </div>
            </div>
          </div>

          <section className="landing-assistant">
            <h2 className="section-title">Start with a grounded prompt</h2>
            <p className="body-copy">
              Ask about establishment, address, service areas, or migrated business details. Click the Talk to Aya button to open the popup assistant.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}
