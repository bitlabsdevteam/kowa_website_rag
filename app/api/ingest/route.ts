import { NextResponse } from 'next/server';

import { loadSources, saveSources, type SourceDoc } from '@/lib/retrieval';

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<SourceDoc>;

  if (!body.title || !body.href || !body.content) {
    return NextResponse.json({ error: 'title, href, content are required' }, { status: 400 });
  }

  const sources = await loadSources();
  const doc: SourceDoc = {
    id: body.id ?? `src-${Date.now()}`,
    title: body.title,
    href: body.href,
    content: body.content,
    tags: body.tags ?? [],
  };

  sources.push(doc);
  await saveSources(sources);

  return NextResponse.json({ ok: true, id: doc.id, totalSources: sources.length });
}
