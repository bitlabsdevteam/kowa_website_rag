import { NextResponse } from 'next/server';

import { assertRuntimeEnvForProduction } from '@/lib/runtime-config';
import { insertRuntimeSource, listRuntimeSources } from '@/lib/source-runtime';
import { type SourceDoc } from '@/lib/retrieval';

export async function POST(request: Request) {
  try {
    assertRuntimeEnvForProduction();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Runtime configuration error' },
      { status: 500 }
    );
  }

  const body = (await request.json()) as Partial<SourceDoc>;

  if (!body.title || !body.href || !body.content) {
    return NextResponse.json({ error: 'title, href, content are required' }, { status: 400 });
  }

  const doc: SourceDoc = {
    id: body.id ?? `src-${Date.now()}`,
    title: body.title,
    href: body.href,
    content: body.content,
    tags: body.tags ?? [],
  };

  await insertRuntimeSource({
    id: doc.id,
    title: doc.title,
    href: doc.href,
    content: doc.content,
    tags: doc.tags ?? [],
  });
  const sources = await listRuntimeSources();

  return NextResponse.json({ ok: true, id: doc.id, totalSources: sources.length });
}
