import { findLegacyExcerpt } from '@/lib/legacy-content';
import { SITE_COPY } from '@/lib/site-copy';

export default function WelcomePage() {
  const copy = SITE_COPY.en.migratedPages;
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">{copy.welcomeBadge}</span>
        <h1>{copy.welcomeTitle}</h1>
        <p>{findLegacyExcerpt('new1.html')}</p>
      </section>
    </main>
  );
}
