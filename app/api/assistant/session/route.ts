import { NextResponse } from 'next/server';

import { createAssistantSessionRecord } from '@/lib/assistant/service';
import type { AssistantSessionRequest } from '@/lib/assistant/types';
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

  const body = ((await request.json().catch(() => ({}))) ?? {}) as AssistantSessionRequest;
  const session = createAssistantSessionRecord(body);

  return NextResponse.json(session);
}
