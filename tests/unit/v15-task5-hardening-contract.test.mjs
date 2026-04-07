import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const RUNTIME_PATH = 'lib/runtime-config.ts';
const STORE_PATH = 'lib/assistant/store.ts';
const SERVICE_PATH = 'lib/assistant/service.ts';
const HEALTH_PATH = 'app/api/runtime/health/route.ts';
const MIGRATION_PATH = 'supabase/migrations/0007_v15_assistant_ops.sql';

function requireTerms(haystack, terms, category) {
  for (const term of terms) {
    assert.ok(haystack.includes(term), `Missing ${category}: ${term}`);
  }
}

test('v15 task5: runtime, store, and service include flags, limits, metrics, and rate limiting', () => {
  const runtime = readFileSync(RUNTIME_PATH, 'utf8');
  const store = readFileSync(STORE_PATH, 'utf8');
  const service = readFileSync(SERVICE_PATH, 'utf8');
  const health = readFileSync(HEALTH_PATH, 'utf8');

  requireTerms(
    `${runtime}\n${store}\n${service}\n${health}`,
    [
      'getAssistantRuntimeConfig',
      'maxMessageChars',
      'maxNoteChars',
      'maxRequestsPerMinute',
      'checkAndConsumeRateLimit',
      'recordAssistantMetric',
      'getAssistantMetrics',
      'validateAssistantPayload',
      'assertAssistantRateLimit',
      'assistant,',
      'analytics: getAssistantMetrics()',
    ],
    'hardening/runtime contract',
  );
});

test('v15 task5: migration contains assistant ops schema', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireTerms(
    sql,
    [
      'create table if not exists public.assistant_runtime_config',
      'create table if not exists public.assistant_event_analytics',
      'assistant_session_id uuid references public.assistant_sessions(id) on delete set null',
      'event_type text not null',
      'create index if not exists idx_assistant_event_analytics_session on public.assistant_event_analytics(assistant_session_id, created_at desc);',
      'create index if not exists idx_assistant_event_analytics_type on public.assistant_event_analytics(event_type, created_at desc);',
    ],
    'assistant ops migration contract',
  );
});
