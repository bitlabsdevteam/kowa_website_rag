# Tasks — v13

- [x] Task 1: Baseline v13 qualification and handoff scope inventory (P0)
  - Acceptance: v13 planning references contact capture UI, handoff preview/confirm APIs, and the additive queue migration target.
  - Files: `sprints/v13/PRD.md`, `sprints/v13/TASKS.md`
  - Completed: 2026-04-03 - Added v13 sprint artifacts covering qualification, preview/confirm flow, and queue schema additions.

- [x] Task 2: Extend assistant state with pending handoff draft and queue contracts (P0)
  - Acceptance: Assistant session state tracks pending drafts and exposes typed queue/confirm request-response contracts.
  - Files: `lib/assistant/types.ts`, `lib/assistant/store.ts`
  - Completed: 2026-04-03 - Added pending draft, queue item, and handoff preview/confirm contracts to the assistant domain layer.

- [x] Task 3: Add handoff preview and confirm service flows (P0)
  - Acceptance: Service can preview a qualified office summary and confirm it into the runtime office queue.
  - Files: `lib/assistant/service.ts`, `app/api/assistant/handoff/preview/route.ts`, `app/api/assistant/handoff/confirm/route.ts`
  - Completed: 2026-04-03 - Added preview/confirm APIs and service logic for summary generation, pending draft state, and queue insertion.

- [x] Task 4: Add popup contact capture and handoff confirmation UX (P0)
  - Acceptance: Popup chat can capture contact fields, prepare a draft, and confirm submission inside the compact assistant surface.
  - Files: `components/chat-widget.tsx`, `app/globals.css`, `locales/*.json`, `lib/site-copy.ts`
  - Completed: 2026-04-03 - Added localized contact fields, preview card, and confirm action inside the popup assistant UI.

- [x] Task 5: Add additive office handoff queue migration (P1)
  - Acceptance: Migration introduces `handoff_status` and `admin_handoff_queue` with indexes and no destructive edits.
  - Files: `supabase/migrations/0005_v13_handoff_queue.sql`
  - Completed: 2026-04-03 - Added additive queue schema for assistant handoff records and queue indexing.

- [x] Task 6: Add v13 regression coverage and walkthrough evidence (P1)
  - Acceptance: v13 tests assert queue contracts and targeted Playwright flow passes from qualification to confirmed submission.
  - Files: `tests/unit/`, `tests/e2e/`, `sprints/v13/WALKTHROUGH.md`
  - Completed: 2026-04-03 - Added v13 contract and Playwright coverage; walkthrough will capture verification evidence.
