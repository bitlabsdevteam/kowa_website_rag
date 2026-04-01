import { insertRuntimeSource, listRuntimeSources } from '@/lib/source-runtime';

export type SourceDoc = {
  id: string;
  title: string;
  href: string;
  content: string;
  tags?: string[];
};

export async function loadSources(): Promise<SourceDoc[]> {
  return listRuntimeSources();
}

export async function saveSources(sources: SourceDoc[]): Promise<void> {
  for (const source of sources) {
    await insertRuntimeSource({
      id: source.id,
      title: source.title,
      href: source.href,
      content: source.content,
      tags: source.tags ?? [],
    });
  }
}

export async function retrieveTopSource(query: string): Promise<SourceDoc | null> {
  const normalized = query.toLowerCase();
  const sources = await loadSources();

  let best: { doc: SourceDoc; score: number } | null = null;
  for (const doc of sources) {
    const haystack = `${doc.title} ${doc.content} ${(doc.tags ?? []).join(' ')}`.toLowerCase();
    const score = normalized.split(/\s+/).filter((t) => t && haystack.includes(t)).length;
    if (!best || score > best.score) best = { doc, score };
  }

  return best && best.score > 0 ? best.doc : null;
}
