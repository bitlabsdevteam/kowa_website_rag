import { NextResponse } from 'next/server';

import { isAuthorizedAdminRequest } from '@/lib/admin-auth';
import { updateNewsArticleStatus } from '@/lib/news/service';
import type { NewsArticleStatus } from '@/lib/news/types';
import { assertRuntimeEnvForProduction } from '@/lib/runtime-config';

type StatusPayload = {
  status: NewsArticleStatus;
  publishAt?: string | null;
  publishedAt?: string | null;
  updatedBy?: string | null;
};

function isStatusPayload(value: unknown): value is StatusPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<StatusPayload>;
  return (
    candidate.status === 'draft' ||
    candidate.status === 'review' ||
    candidate.status === 'scheduled' ||
    candidate.status === 'published' ||
    candidate.status === 'archived'
  );
}

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

  const payload = await request.json().catch(() => null);
  if (!isStatusPayload(payload)) {
    return NextResponse.json({ error: 'status is required' }, { status: 400 });
  }

  try {
    const { id } = await context.params;
    const article = await updateNewsArticleStatus(id, payload);
    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update news article status' },
      { status: 400 },
    );
  }
}
