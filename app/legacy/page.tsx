import legacyPages from '@/data/legacy-pages.json';
import { SITE_COPY } from '@/lib/site-copy';

export default function LegacyPage() {
  const copy = SITE_COPY.en.migratedPages;
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">{copy.legacyBadge}</span>
        <h1>{copy.legacyTitle}</h1>
        <p>{copy.legacyLead}</p>
      </section>

      <section className="grid">
        {legacyPages.map((p) => (
          <article key={p.url} className="card">
            <h3 className="legacy-title">{p.title || p.url}</h3>
            <p className="legacy-url">{p.url}</p>
            <p>{p.excerpt || copy.legacyNoExcerpt}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
