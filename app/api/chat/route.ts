import { NextResponse } from 'next/server';

import { KNOWLEDGE } from '@/lib/knowledge';
import type { ChatRequest, ChatResponse } from '@/lib/contracts';

function groundedAnswer(message: string): ChatResponse {
  const q = message.toLowerCase();
  const source = KNOWLEDGE[0];

  if (q.includes('establish') || q.includes('when') || q.includes('year')) {
    return {
      answer: 'Kowa Trade And Commerce was established in 1994.',
      grounded: true,
      citations: [{ id: source.id, title: source.title, href: source.href, excerpt: 'Established : 1994' }],
    };
  }

  if (q.includes('address') || q.includes('where')) {
    return {
      answer: 'Kowa address is Reoma Bldg. 5F, 2-10-6, Mita, Minato-Ku, Tokyo 108-0073, JAPAN.',
      grounded: true,
      citations: [{ id: source.id, title: source.title, href: source.href, excerpt: 'Reoma Bldg. 5F, 2-10-6, Mita...' }],
    };
  }

  return {
    answer: "I don't know based on the available Kowa sources.",
    grounded: false,
    citations: [],
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;

  if (!body?.message?.trim()) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const res = groundedAnswer(body.message.trim());
  return NextResponse.json(res);
}
