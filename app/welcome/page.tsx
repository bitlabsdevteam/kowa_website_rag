import { findLegacyExcerpt } from '@/lib/legacy-content';

export default function WelcomePage() {
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">Welcome Note (Migrated)</span>
        <h1>Welcome</h1>
        <p>{findLegacyExcerpt('new1.html')}</p>
      </section>
    </main>
  );
}
