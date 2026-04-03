# Tasks — v14

- [x] Task 1: Baseline v14 admin inbox and triage scope inventory (P0)
  - Acceptance: v14 planning references admin queue APIs, admin console inbox/detail panels, and the additive inbox migration target.
  - Files: `sprints/v14/PRD.md`, `sprints/v14/TASKS.md`
  - Completed: 2026-04-03 - Added v14 sprint artifacts covering inbox APIs, console integration, and assignment/note schema updates.

- [x] Task 2: Add admin queue list/update/note service operations (P0)
  - Acceptance: Runtime assistant queue supports list, status updates, assignee changes, and internal notes.
  - Files: `lib/assistant/service.ts`, `lib/assistant/store.ts`, `lib/assistant/types.ts`
  - Completed: 2026-04-03 - Added queue note and status contracts plus runtime list/update/note operations.

- [x] Task 3: Add admin handoff APIs with local admin request validation (P0)
  - Acceptance: Admin queue APIs exist and reject requests without the admin auth header.
  - Files: `app/api/admin/handoffs/`, `lib/admin-auth.ts`
  - Completed: 2026-04-03 - Added inbox, status, and note APIs with shared local admin request-header validation.

- [x] Task 4: Extend admin console with assistant inbox and handoff detail workflow (P0)
  - Acceptance: Existing admin console shows queue list, detail panel, assignee update, status actions, transcript preview, and note entry.
  - Files: `app/admin/admin-console.tsx`, `app/globals.css`, `lib/site-copy.ts`, `locales/*.json`
  - Completed: 2026-04-03 - Added inbox/detail workflow and supporting localized admin labels inside the existing admin console.

- [x] Task 5: Add additive admin inbox migration for assignee metadata and notes (P1)
  - Acceptance: Migration adds queue assignment metadata and `admin_handoff_notes` table/indexes without destructive edits.
  - Files: `supabase/migrations/0006_v14_admin_inbox.sql`
  - Completed: 2026-04-03 - Added additive admin inbox schema updates for assignee metadata, updated timestamp, and queue notes.

- [x] Task 6: Add v14 regression coverage and walkthrough evidence (P1)
  - Acceptance: v14 tests assert API/migration contracts and targeted admin inbox Playwright flow passes.
  - Files: `tests/unit/`, `tests/e2e/`, `sprints/v14/WALKTHROUGH.md`
  - Completed: 2026-04-03 - Added v14 contract coverage and a targeted admin inbox Playwright flow; walkthrough will capture validation evidence.
