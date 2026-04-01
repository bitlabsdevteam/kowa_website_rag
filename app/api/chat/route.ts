import { NextResponse } from 'next/server';

import { retrieveTopSource } from '@/lib/retrieval';
import type { ChatRequest, ChatResponse } from '@/lib/contracts';
import { assertRuntimeEnvForProduction } from '@/lib/runtime-config';
import { recordRetrievalEvent } from '@/lib/source-runtime';

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
  try {
    assertRuntimeEnvForProduction();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Runtime configuration error' },
      { status: 500 }
    );
  }

  const body = (await request.json()) as ChatRequest;

  if (!body?.message?.trim()) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const source = await retrieveTopSource(body.message.trim());
  if (!source) {
    await recordRetrievalEvent({ query: body.message.trim(), sourceId: null, grounded: false });
    const out: ChatResponse = {
      answer: "I don't know based on the available Kowa sources.",
      grounded: false,
      citations: [],
      confidence: 'none',
      recoveryGuidance: [
        'Try asking about Kowa company profile details (establishment, address, contact info).',
        'Ask about business scope using migrated legacy website content.',
        'Review legacy coverage and rephrase with terms found in source pages.',
      ],
    };
    return NextResponse.json(out);
  }

  const heuristicAnswer = heuristics(source.content, body.message.trim());
  const concise = heuristicAnswer ?? `Based on available Kowa sources, relevant information is: ${source.content.slice(0, 180)}...`;

  const out: ChatResponse = {
    answer: concise,
    grounded: true,
    citations: [{ id: source.id, title: source.title, href: source.href, excerpt: source.content.slice(0, 160) }],
    confidence: heuristicAnswer ? 'high' : 'low',
    recoveryGuidance: heuristicAnswer
      ? undefined
      : [
          'The answer is grounded but low confidence. Confirm details using the citation card.',
          'Try a narrower question (for example: establishment year, address, or business category).',
        ],
  };
  await recordRetrievalEvent({ query: body.message.trim(), sourceId: source.id, grounded: true });

  return NextResponse.json(out);
}
