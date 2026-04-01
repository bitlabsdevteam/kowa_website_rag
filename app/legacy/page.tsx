import legacyPages from '@/data/legacy-pages.json';

export default function LegacyPage() {
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">Migrated Legacy Content</span>
        <h1>Legacy Website Crawl Dataset</h1>
        <p>All reachable legacy pages were crawled and transformed into structured excerpts for migration into the new site.</p>
      </section>

      <section className="grid">
        {legacyPages.map((p) => (
          <article key={p.url} className="card">
            <h3 className="legacy-title">{p.title || p.url}</h3>
            <p className="legacy-url">{p.url}</p>
            <p>{p.excerpt || 'No readable text extracted from this asset.'}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
