import { NextResponse } from 'next/server';

import { getOfficeMetrics } from '@/lib/assistant/service';
import { isAuthorizedAdminRequest } from '@/lib/admin-auth';
import { assertRuntimeEnvForProduction, getAssistantRuntimeConfig } from '@/lib/runtime-config';

export async function GET(request: Request) {
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

  return NextResponse.json({ metrics: getOfficeMetrics() });
}
