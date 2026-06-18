import { NextResponse } from 'next/server';

import { isAuthorizedAdminRequest } from '@/lib/admin-auth';
import { ingestNewsArticle } from '@/lib/news/service';
import type { NewsBodyBlock, NewsIngestInput } from '@/lib/news/types';
import { assertRuntimeEnvForProduction } from '@/lib/runtime-config';
import type { Locale } from '@/lib/site-copy';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBodyBlocks(value: unknown): value is NewsBodyBlock[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((entry) => isRecord(entry) && typeof entry.type === 'string');
}

function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'ja' || value === 'zh';
}

function validateIngestPayload(value: unknown): NewsIngestInput {
  if (!isRecord(value)) {
    throw new Error('invalid JSON payload');
  }

  if (typeof value.agentName !== 'string' || !value.agentName.trim()) {
    throw new Error('agentName is required');
  }

  if (typeof value.idempotencyKey !== 'string' || !value.idempotencyKey.trim()) {
    throw new Error('idempotencyKey is required');
  }

  if (!Array.isArray(value.localizations) || value.localizations.length === 0) {
    throw new Error('localizations are required');
  }

  const localizations = value.localizations.map((entry) => {
    if (!isRecord(entry)) {
      throw new Error('localizations must be objects');
    }

    if (!isLocale(entry.locale)) {
      throw new Error('localization locale must be en, ja, or zh');
    }

    if (typeof entry.title !== 'string' || !entry.title.trim()) {
      throw new Error('localization title is required');
    }

    if (!isBodyBlocks(entry.bodyBlocks)) {
      throw new Error('localization bodyBlocks are required');
    }

    return {
      locale: entry.locale,
      title: entry.title,
      excerpt: typeof entry.excerpt === 'string' ? entry.excerpt : undefined,
      seoTitle: typeof entry.seoTitle === 'string' ? entry.seoTitle : null,
      seoDescription: typeof entry.seoDescription === 'string' ? entry.seoDescription : null,
      bodyBlocks: entry.bodyBlocks,
      plainText: typeof entry.plainText === 'string' ? entry.plainText : undefined,
    };
  });

  return {
    slug: typeof value.slug === 'string' ? value.slug : undefined,
    status:
      value.status === 'draft' ||
      value.status === 'review' ||
      value.status === 'scheduled' ||
      value.status === 'published' ||
      value.status === 'archived'
        ? value.status
        : undefined,
    primaryLocale: isLocale(value.primaryLocale) ? value.primaryLocale : 'en',
    coverImageUrl: typeof value.coverImageUrl === 'string' ? value.coverImageUrl : null,
    publishAt: typeof value.publishAt === 'string' ? value.publishAt : null,
    publishedAt: typeof value.publishedAt === 'string' ? value.publishedAt : null,
    sourceType: value.sourceType === 'human' || value.sourceType === 'hybrid' ? value.sourceType : 'ai',
    provenance: isRecord(value.provenance) ? value.provenance : {},
    localizations,
    externalJobId: typeof value.externalJobId === 'string' ? value.externalJobId : null,
    agentName: value.agentName,
    idempotencyKey: value.idempotencyKey,
    changeSummary: typeof value.changeSummary === 'string' ? value.changeSummary : undefined,
  };
}

export async function POST(request: Request) {
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

  try {
    const payload = validateIngestPayload(await request.json().catch(() => null));
    const result = await ingestNewsArticle(payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to ingest news article' },
      { status: 400 },
    );
  }
}
