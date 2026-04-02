import { findLegacyExcerpt } from '@/lib/legacy-content';
import { SITE_COPY } from '@/lib/site-copy';

export default function FactoryPage() {
  const copy = SITE_COPY.en.migratedPages;
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">{copy.factoryBadge}</span>
        <h1>{copy.factoryTitle}</h1>
        <p>{findLegacyExcerpt('history1.html')}</p>
      </section>
    </main>
  );
}
