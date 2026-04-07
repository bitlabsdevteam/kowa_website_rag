import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const RUNTIME_PATH = 'lib/runtime-config.ts';
const STORE_PATH = 'lib/assistant/store.ts';
const TYPES_PATH = 'lib/assistant/types.ts';
const TELEGRAM_SERVICE_PATH = 'lib/telegram/service.ts';
const TELEGRAM_ROUTE_PATH = 'app/api/telegram/webhook/route.ts';
const MIGRATION_PATH = 'supabase/migrations/0008_v16_telegram_adapter.sql';

function requireTerms(haystack, terms, category) {
  for (const term of terms) {
    assert.ok(haystack.includes(term), `Missing ${category}: ${term}`);
  }
}

test('v16 task5: runtime, adapter, and route expose telegram contracts', () => {
  const runtime = readFileSync(RUNTIME_PATH, 'utf8');
  const store = readFileSync(STORE_PATH, 'utf8');
  const types = readFileSync(TYPES_PATH, 'utf8');
  const telegram = readFileSync(TELEGRAM_SERVICE_PATH, 'utf8');
  const route = readFileSync(TELEGRAM_ROUTE_PATH, 'utf8');

  requireTerms(
    `${runtime}\n${store}\n${types}\n${telegram}\n${route}`,
    [
      'telegramAdapterEnabled',
      'telegramDeliveryEnabled',
      'TelegramChannelBinding',
      'TelegramWebhookUpdate',
      'upsertTelegramChannelBinding',
      'getTelegramChannelBinding',
      'handleTelegramWebhook',
      'x-telegram-bot-api-secret-token',
      '/api/telegram/webhook',
    ],
    'telegram adapter contract',
  );
});

test('v16 task5: telegram migration contains adapter schema', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireTerms(
    sql,
    [
      'create table if not exists public.telegram_channel_accounts',
      'assistant_session_id uuid not null references public.assistant_sessions(id) on delete cascade',
      'telegram_user_id bigint not null',
      'telegram_chat_id bigint not null',
      'unique (telegram_user_id, telegram_chat_id)',
      'create index if not exists idx_telegram_channel_accounts_session on public.telegram_channel_accounts(assistant_session_id);',
      'create index if not exists idx_telegram_channel_accounts_lookup on public.telegram_channel_accounts(telegram_user_id, telegram_chat_id);',
    ],
    'telegram adapter migration contract',
  );
});
