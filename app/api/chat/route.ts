import { NextResponse } from 'next/server';

import { retrieveTopSource } from '@/lib/retrieval';
import type { ChatRequest, ChatResponse } from '@/lib/contracts';

function heuristics(sourceContent: string, query: string): string | null {
  const q = query.toLowerCase();
  const c = sourceContent;

  if (q.includes('establish') || q.includes('year')) {
    const m = c.match(/Established\s*:\s*([^\.\n]+)/i);
    if (m) return `Kowa was established in ${m[1].trim()}.`;
  }

  if (q.includes('address') || q.includes('where')) {
    const m = c.match(/Reoma Bldg\.[^\.\n]+/i);
    if (m) return `Kowa address is ${m[0].trim()}.`;
  }

  return null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;

  if (!body?.message?.trim()) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const source = await retrieveTopSource(body.message.trim());
  if (!source) {
    const out: ChatResponse = { answer: "I don't know based on the available Kowa sources.", grounded: false, citations: [] };
    return NextResponse.json(out);
  }

  const concise = heuristics(source.content, body.message.trim()) ?? `Based on available Kowa sources, relevant information is: ${source.content.slice(0, 180)}...`;

  const out: ChatResponse = {
    answer: concise,
    grounded: true,
    citations: [{ id: source.id, title: source.title, href: source.href, excerpt: source.content.slice(0, 160) }],
  };

  return NextResponse.json(out);
}
