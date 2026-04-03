# Tasks — v16

- [x] Task 1: Baseline v16 Telegram adapter scope inventory (P0)
  - Acceptance: v16 sprint artifacts define webhook routing, channel mapping, session resume, optional delivery, and additive schema targets.
  - Files: `sprints/v16/PRD.md`, `sprints/v16/TASKS.md`
  - Completed: 2026-04-03 - Added v16 sprint artifacts covering Telegram webhook routing, mapping, delivery controls, and additive schema targets.

- [x] Task 2: Add Telegram runtime flags and channel binding contracts (P0)
  - Acceptance: Runtime config and assistant types/store expose Telegram adapter flags, delivery toggles, and channel session bindings.
  - Files: `lib/runtime-config.ts`, `lib/assistant/types.ts`, `lib/assistant/store.ts`
  - Completed: 2026-04-03 - Added Telegram runtime flags, env helpers, and in-memory channel binding contracts for session reuse.

- [x] Task 3: Add Telegram adapter service and optional outbound client (P0)
  - Acceptance: Adapter service can normalize Telegram text updates, resume/create sessions, run assistant turns, and prepare Telegram-compatible reply payloads.
  - Files: `lib/telegram/service.ts`, `lib/telegram/client.ts`, `lib/assistant/service.ts`
  - Completed: 2026-04-03 - Added Telegram webhook normalization, assistant turn reuse, reply formatting, and optional outbound delivery client.

- [x] Task 4: Add Telegram webhook route with ignored-update and resume behavior (P0)
  - Acceptance: Webhook route enforces runtime controls, ignores unsupported updates safely, and returns normalized Telegram reply metadata for supported text messages.
  - Files: `app/api/telegram/webhook/route.ts`
  - Completed: 2026-04-03 - Added Telegram webhook GET/POST route with runtime gating, secret validation support, and ignored-update handling.

- [x] Task 5: Add additive Telegram adapter schema (P1)
  - Acceptance: Migration adds `telegram_channel_accounts` with session linkage and lookup indexes without destructive edits.
  - Files: `supabase/migrations/0008_v16_telegram_adapter.sql`
  - Completed: 2026-04-03 - Added Telegram channel account mapping schema with unique lookup and updated-at trigger.

- [x] Task 6: Add v16 regression coverage and walkthrough evidence (P1)
  - Acceptance: Tests assert Telegram adapter contracts and webhook resume behavior; walkthrough documents build/lint/test/security evidence.
  - Files: `tests/unit/`, `tests/e2e/`, `sprints/v16/WALKTHROUGH.md`
  - Completed: 2026-04-03 - Added v16 contract tests, webhook regression tests, and sprint walkthrough evidence.
