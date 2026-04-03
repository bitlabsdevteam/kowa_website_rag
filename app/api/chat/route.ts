import { NextResponse } from 'next/server';

import { createAssistantSessionRecord, runAssistantTurn } from '@/lib/assistant/service';
import type { ChatRequest, ChatResponse } from '@/lib/contracts';
import { assertRuntimeEnvForProduction } from '@/lib/runtime-config';

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

  const session = createAssistantSessionRecord({ locale: 'en', entryPage: '/#assistant', channel: 'website' });
  const assistant = await runAssistantTurn({
    sessionId: session.sessionId,
    conversationId: session.conversationId,
    message: body.message.trim(),
    locale: session.language,
  });

  const out: ChatResponse = {
    answer: assistant.answer,
    grounded: assistant.grounded,
    citations: assistant.citations,
    confidence: assistant.confidence,
    recoveryGuidance: assistant.recoveryGuidance,
  };

  return NextResponse.json(out);
}
