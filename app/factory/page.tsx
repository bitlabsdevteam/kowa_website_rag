import { findLegacyExcerpt } from '@/lib/legacy-content';

export default function FactoryPage() {
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">Gunma Store / Factory (Migrated)</span>
        <h1>Gunma Store / Factory</h1>
        <p>{findLegacyExcerpt('history1.html')}</p>
      </section>
    </main>
  );
}
