import { NextResponse } from 'next/server';

import type { TelegramWebhookUpdate } from '@/lib/assistant/types';
import { handleTelegramWebhook, isAuthorizedTelegramWebhookRequest } from '@/lib/telegram/service';
import { assertRuntimeEnvForProduction, getAssistantRuntimeConfig } from '@/lib/runtime-config';

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/telegram/webhook',
    telegramAdapterEnabled: getAssistantRuntimeConfig().flags.telegramAdapterEnabled,
  });
}

export async function POST(request: Request) {
  try {
    assertRuntimeEnvForProduction();
    if (!getAssistantRuntimeConfig().flags.telegramAdapterEnabled) {
      return NextResponse.json({ error: 'telegram adapter is disabled' }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Runtime configuration error' },
      { status: 500 },
    );
  }

  if (!isAuthorizedTelegramWebhookRequest(request)) {
    return NextResponse.json({ error: 'telegram webhook authorization failed' }, { status: 401 });
  }

  const body = ((await request.json().catch(() => null)) ?? null) as TelegramWebhookUpdate | null;
  if (!body) {
    return NextResponse.json({ error: 'invalid JSON payload' }, { status: 400 });
  }

  try {
    const response = await handleTelegramWebhook(body);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to process telegram webhook' },
      { status: 400 },
    );
  }
}
