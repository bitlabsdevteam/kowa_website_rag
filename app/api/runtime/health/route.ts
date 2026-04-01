import { NextResponse } from 'next/server';

import { getRuntimeEnvStatus } from '@/lib/runtime-config';
import { getSourceStoreMode } from '@/lib/source-runtime';

export async function GET() {
  const env = getRuntimeEnvStatus();

  return NextResponse.json({
    ok: true,
    mode: getSourceStoreMode(),
    required: env.required,
    missing: env.missing,
  });
}

