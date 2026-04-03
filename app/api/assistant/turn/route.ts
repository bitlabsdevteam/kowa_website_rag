import { NextResponse } from 'next/server';

import { runAssistantTurn } from '@/lib/assistant/service';
import type { AssistantTurnRequest } from '@/lib/assistant/types';
import { assertRuntimeEnvForProduction } from '@/lib/runtime-config';

export async function POST(request: Request) {
  try {
    assertRuntimeEnvForProduction();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Runtime configuration error' },
      { status: 500 },
    );
  }

  const body = (await request.json()) as AssistantTurnRequest;

  if (!body?.sessionId?.trim()) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  if (!body?.message?.trim()) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  try {
    const response = await runAssistantTurn(body);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to process assistant turn' },
      { status: 400 },
    );
  }
}
