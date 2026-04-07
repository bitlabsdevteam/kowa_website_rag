import { NextResponse } from 'next/server';

import { assertAssistantRateLimit, previewHandoff } from '@/lib/assistant/service';
import type { HandoffPreviewRequest } from '@/lib/assistant/types';
import { assertRuntimeEnvForProduction, getAssistantRuntimeConfig } from '@/lib/runtime-config';

export async function POST(request: Request) {
  try {
    assertRuntimeEnvForProduction();
    if (!getAssistantRuntimeConfig().flags.handoffEnabled) {
      return NextResponse.json({ error: 'handoff is disabled' }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Runtime configuration error' },
      { status: 500 },
    );
  }

  const body = ((await request.json().catch(() => null)) ?? null) as HandoffPreviewRequest | null;
  if (!body) {
    return NextResponse.json({ error: 'invalid JSON payload' }, { status: 400 });
  }

  if (!body?.sessionId?.trim()) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  try {
    assertAssistantRateLimit(`handoff-preview:${body.sessionId}`);
    const response = previewHandoff(body);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to prepare handoff summary' },
      { status: 400 },
    );
  }
}
