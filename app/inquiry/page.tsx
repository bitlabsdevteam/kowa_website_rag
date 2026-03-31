import { findLegacyExcerpt } from '@/lib/legacy-content';

export default function InquiryPage() {
  return (
    <main className="page">
      <section className="hero">
        <span className="badge">Inquiry (Migrated)</span>
        <h1>Inquiry</h1>
        <p>{findLegacyExcerpt('form1.html')}</p>
      </section>
    </main>
  );
}
