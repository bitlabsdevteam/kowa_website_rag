import profile from '@/sprints/v1/artifacts/content-normalized.json';
import { ChatWidget } from '@/components/chat-widget';
import { AuthControls } from '@/components/auth-controls';

export default function HomePage() {
  return (
    <main className="page">
      <section className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Kowa Trade</strong>
        <AuthControls />
      </section>

      <section className="hero">
        <span className="badge">Kowa Website Migration v1</span>
        <h1>Kowa Trade & Commerce</h1>
        <p>Modernized corporate website rebuilt from legacy content with an embedded grounded RAG assistant on the landing page.</p>
      </section>

      <section className="grid">
        <article className="card">
          <span className="badge">Company Profile</span>
          <p>
            <strong>{profile.normalized_profile.company_name_en}</strong>
          </p>
          <p>{profile.normalized_profile.address_en}</p>
          <p>{profile.normalized_profile.tel}</p>
          <p>{profile.normalized_profile.fax}</p>
          <p>{profile.normalized_profile.capital}</p>
          <p>{profile.normalized_profile.established}</p>
        </article>

        <article className="card">
          <span className="badge">RAG Assistant</span>
          <ChatWidget />
        </article>
      </section>
    </main>
  );
}
