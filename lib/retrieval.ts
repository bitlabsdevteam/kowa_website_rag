import fs from 'node:fs/promises';
import path from 'node:path';

export type SourceDoc = {
  id: string;
  title: string;
  href: string;
  content: string;
  tags?: string[];
};

const DATA_PATH = path.join(process.cwd(), 'data', 'sources.json');

export async function loadSources(): Promise<SourceDoc[]> {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw) as SourceDoc[];
}

export async function saveSources(sources: SourceDoc[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(sources, null, 2), 'utf8');
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
