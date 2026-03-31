import { findLegacyExcerpt } from '@/lib/legacy-content';

export default function BusinessPage() {
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">Business Items (Migrated)</span>
        <h1>Business Items</h1>
        <p>{findLegacyExcerpt('productsindex2.html')}</p>
      </section>
    </main>
  );
}
