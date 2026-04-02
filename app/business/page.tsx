import { findLegacyExcerpt } from '@/lib/legacy-content';
import { SITE_COPY } from '@/lib/site-copy';

export default function BusinessPage() {
  const copy = SITE_COPY.en.migratedPages;
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">{copy.businessBadge}</span>
        <h1>{copy.businessTitle}</h1>
        <p>{findLegacyExcerpt('productsindex2.html')}</p>
      </section>
    </main>
  );
}
