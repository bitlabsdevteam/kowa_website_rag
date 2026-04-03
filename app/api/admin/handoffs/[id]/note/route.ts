import { NextResponse } from 'next/server';

import { addOfficeQueueNote } from '@/lib/assistant/service';
import type { AdminQueueNoteRequest } from '@/lib/assistant/types';
import { assertRuntimeEnvForProduction } from '@/lib/runtime-config';
import { isAuthorizedAdminRequest } from '@/lib/admin-auth';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    assertRuntimeEnvForProduction();
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
  const body = (await request.json()) as AdminQueueNoteRequest;

  try {
    return NextResponse.json({ item: addOfficeQueueNote(id, body) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to add queue note' },
      { status: 400 },
    );
  }
}
