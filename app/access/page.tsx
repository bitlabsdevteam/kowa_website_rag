import { findLegacyExcerpt } from '@/lib/legacy-content';

export default function AccessPage() {
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">Access (Migrated)</span>
        <h1>Access</h1>
        <p>{findLegacyExcerpt('access1.html')}</p>
      </section>
    </main>
  );
}
