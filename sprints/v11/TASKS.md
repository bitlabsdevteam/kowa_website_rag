# Tasks — v11

- [x] Task 1: Baseline v11 assistant foundation scope and file inventory (P0)
  - Acceptance: v11 planning references the assistant API routes, domain modules, chat widget integration point, and additive migration target.
  - Files: `sprints/v11/PRD.md`, `sprints/v11/TASKS.md`, `supabase/migrations/`
  - Completed: 2026-04-03 - Added v11 sprint artifacts covering assistant session/turn routes, domain-layer boundaries, popup chat integration, and the new migration target.

- [x] Task 2: Add assistant domain contracts and policy layer (P0)
  - Acceptance: Typed assistant request/response, intent, stage, and visitor-profile models exist with deterministic policy helpers.
  - Files: `lib/assistant/types.ts`, `lib/assistant/policy.ts`
  - Completed: 2026-04-03 - Added assistant types and deterministic intent/stage/qualification helpers for the website-first assistant core.

- [x] Task 3: Implement session-backed assistant service and API routes (P0)
  - Acceptance: Server routes create assistant sessions and process structured turns through a shared service layer.
  - Files: `app/api/assistant/session/route.ts`, `app/api/assistant/turn/route.ts`, `lib/assistant/store.ts`, `lib/assistant/service.ts`
  - Completed: 2026-04-03 - Added in-memory assistant session/message store, shared turn service, and website-first session/turn APIs.

- [x] Task 4: Refactor popup chat onto assistant session + turn flow (P0)
  - Acceptance: Chat popup bootstraps a reusable session, submits turns to the new API, and remains compatible with the existing compact layout.
  - Files: `components/chat-widget.tsx`, `app/api/chat/route.ts`
  - Completed: 2026-04-03 - Updated the popup chat to create assistant sessions, submit structured turns, cache the active session in browser storage, and keep `/api/chat` as a compatibility bridge.

- [x] Task 5: Add additive Supabase migration for assistant foundation data (P1)
  - Acceptance: Migration introduces assistant session, visitor profile, and turn-event tables plus indexes/triggers without destructive edits.
  - Files: `supabase/migrations/0004_v11_assistant_foundation.sql`
  - Completed: 2026-04-03 - Added assistant foundation schema with enums, tables, indexes, and `updated_at` trigger wiring.

- [x] Task 6: Add v11 contract tests and walkthrough evidence (P1)
  - Acceptance: v11 tests assert sprint artifacts and migration contracts; walkthrough records validation evidence.
  - Files: `tests/unit/`, `sprints/v11/WALKTHROUGH.md`
  - Completed: 2026-04-03 - Added v11 baseline/migration contract tests; walkthrough will record build/lint/test outcomes for the foundation release.
