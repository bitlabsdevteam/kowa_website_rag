import { NextResponse } from 'next/server';

import { listOfficeQueue } from '@/lib/assistant/service';
import { assertRuntimeEnvForProduction } from '@/lib/runtime-config';
import { isAuthorizedAdminRequest } from '@/lib/admin-auth';

export async function GET(request: Request) {
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

  return NextResponse.json({ items: listOfficeQueue() });
}
