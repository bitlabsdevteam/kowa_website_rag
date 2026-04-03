import { NextResponse } from 'next/server';

import { getAssistantMetrics } from '@/lib/assistant/store';
import { getAssistantRuntimeConfig, getRuntimeEnvStatus } from '@/lib/runtime-config';
import { getSourceStoreMode } from '@/lib/source-runtime';

export async function GET() {
  const env = getRuntimeEnvStatus();
  const assistant = getAssistantRuntimeConfig();

  return NextResponse.json({
    ok: true,
    mode: getSourceStoreMode(),
    required: env.required,
    missing: env.missing,
    assistant,
    analytics: getAssistantMetrics(),
  });
}
