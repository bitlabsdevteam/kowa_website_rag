import { NextResponse } from 'next/server';

import { addOfficeQueueNote, validateAssistantPayload } from '@/lib/assistant/service';
import type { AdminQueueNoteRequest } from '@/lib/assistant/types';
import { assertRuntimeEnvForProduction, getAssistantRuntimeConfig } from '@/lib/runtime-config';
import { isAuthorizedAdminRequest } from '@/lib/admin-auth';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    assertRuntimeEnvForProduction();
    if (!getAssistantRuntimeConfig().flags.adminInboxEnabled) {
      return NextResponse.json({ error: 'admin inbox is disabled' }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Runtime configuration error' },
      { status: 500 },
    );
  }

  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: 'admin authorization required' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = ((await request.json().catch(() => null)) ?? null) as AdminQueueNoteRequest | null;
  if (!body) {
    return NextResponse.json({ error: 'invalid JSON payload' }, { status: 400 });
  }

  try {
    validateAssistantPayload({ note: body.body });
    return NextResponse.json({ item: addOfficeQueueNote(id, body) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to add queue note' },
      { status: 400 },
    );
  }
}
