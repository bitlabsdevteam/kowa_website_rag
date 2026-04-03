import { NextResponse } from 'next/server';

import { assertAssistantRateLimit, runAssistantTurn, validateAssistantPayload } from '@/lib/assistant/service';
import type { AssistantTurnRequest } from '@/lib/assistant/types';
import { assertRuntimeEnvForProduction, getAssistantRuntimeConfig } from '@/lib/runtime-config';

export async function POST(request: Request) {
  try {
    assertRuntimeEnvForProduction();
    if (!getAssistantRuntimeConfig().flags.publicAssistantEnabled) {
      return NextResponse.json({ error: 'assistant is disabled' }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Runtime configuration error' },
      { status: 500 },
    );
  }

  const body = ((await request.json().catch(() => null)) ?? null) as AssistantTurnRequest | null;
  if (!body) {
    return NextResponse.json({ error: 'invalid JSON payload' }, { status: 400 });
  }

  if (!body?.sessionId?.trim()) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  if (!body?.message?.trim()) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  try {
    validateAssistantPayload({ message: body.message });
    assertAssistantRateLimit(`turn:${body.sessionId}`);
    const response = await runAssistantTurn(body);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to process assistant turn' },
      { status: 400 },
    );
  }
}
