import { findLegacyExcerpt } from '@/lib/legacy-content';
import { SITE_COPY } from '@/lib/site-copy';

export default function AccessPage() {
  const copy = SITE_COPY.en.migratedPages;
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">{copy.accessBadge}</span>
        <h1>{copy.accessTitle}</h1>
        <p>{findLegacyExcerpt('access1.html')}</p>
      </section>
    </main>
  );
}
