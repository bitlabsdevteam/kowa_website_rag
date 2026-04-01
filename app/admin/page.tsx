export default function AdminPage() {
  return (
    <main className="page shell">
      <section className="hero-panel admin-hero">
        <span className="eyebrow">Admin console</span>
        <h1 className="page-title">Source operations are now part of the main product surface.</h1>
        <p className="lead">
          This route closes the broken navigation gap and establishes the v5 admin landing area for source management, ingestion visibility,
          publishing controls, and release-safe operational actions.
        </p>
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <span className="badge">Operational focus</span>
          <div className="kpi-row">
            <div className="kpi">
              <strong>Publish</strong>
              <span>Move reviewed sources into the live retrieval set.</span>
            </div>
            <div className="kpi">
              <strong>Reindex</strong>
              <span>Refresh retrieval data after source updates.</span>
            </div>
            <div className="kpi">
              <strong>Health</strong>
              <span>Track ingestion status and source coverage quality.</span>
            </div>
          </div>
          <ul className="admin-list">
            <li>
              <strong>Current state</strong>
              This is a production-aligned landing page for the admin surface. Full CRUD and reindex actions are the next implementation slice.
            </li>
            <li>
              <strong>Immediate value</strong>
              Main navigation now resolves cleanly, and the route can host protected workflows instead of acting as a broken link.
            </li>
          </ul>
        </article>

        <article className="card">
          <span className="badge">Planned actions</span>
          <div className="form-grid">
            <input className="field" placeholder="Source title" disabled />
            <input className="field" placeholder="Source URL" disabled />
            <textarea className="text-area" placeholder="Source content preview" disabled />
            <button type="button" className="field-button" disabled>
              Admin actions coming next
            </button>
          </div>
          <p className="footer-note">This placeholder is intentional. It reserves the real `/admin` surface while the underlying source workflow is implemented.</p>
        </article>
      </section>
    </main>
  );
}
