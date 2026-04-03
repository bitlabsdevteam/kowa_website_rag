import { NextResponse } from 'next/server';

import { confirmHandoff } from '@/lib/assistant/service';
import type { HandoffConfirmRequest } from '@/lib/assistant/types';
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

  const body = (await request.json()) as HandoffConfirmRequest;
  if (!body?.sessionId?.trim()) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  try {
    const response = confirmHandoff(body);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to confirm handoff' },
      { status: 400 },
    );
  }
}
