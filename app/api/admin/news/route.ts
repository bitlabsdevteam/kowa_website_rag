import { NextResponse } from 'next/server';

import { isAuthorizedAdminRequest } from '@/lib/admin-auth';
import { listAdminNewsArticles } from '@/lib/news/service';
import { assertRuntimeEnvForProduction } from '@/lib/runtime-config';

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

  return NextResponse.json({ items: await listAdminNewsArticles() });
}
