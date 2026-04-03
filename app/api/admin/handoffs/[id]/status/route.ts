import { NextResponse } from 'next/server';

import { updateOfficeQueueStatus } from '@/lib/assistant/service';
import type { AdminQueueStatusRequest } from '@/lib/assistant/types';
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
  const body = (await request.json()) as AdminQueueStatusRequest;

  if (!body?.status) {
    return NextResponse.json({ error: 'status is required' }, { status: 400 });
  }

  try {
    return NextResponse.json({ item: updateOfficeQueueStatus(id, body) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update queue status' },
      { status: 400 },
    );
  }
}
