import { findLegacyExcerpt } from '@/lib/legacy-content';
import { SITE_COPY } from '@/lib/site-copy';

export default function InquiryPage() {
  const copy = SITE_COPY.en.migratedPages;
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">{copy.inquiryBadge}</span>
        <h1>{copy.inquiryTitle}</h1>
        <p>{findLegacyExcerpt('form1.html')}</p>
      </section>
    </main>
  );
}
