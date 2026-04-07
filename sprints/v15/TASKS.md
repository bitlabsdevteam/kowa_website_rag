# Tasks — v15

- [x] Task 1: Baseline v15 hardening and release-readiness scope inventory (P0)
  - Acceptance: v15 planning references runtime flags/limits, assistant metrics, admin KPI display, and the additive ops migration target.
  - Files: `sprints/v15/PRD.md`, `sprints/v15/TASKS.md`
  - Completed: 2026-04-03 - Added v15 sprint artifacts covering hardening controls, metrics surfaces, and operations schema.

- [x] Task 2: Add assistant runtime flags and bounded validation limits (P0)
  - Acceptance: Runtime config exposes assistant flags and size/rate limits used by assistant routes.
  - Files: `lib/runtime-config.ts`, `lib/assistant/service.ts`, `app/api/assistant/`
  - Completed: 2026-04-03 - Added assistant runtime flags, message/note length validation, and per-session request throttling.

- [x] Task 3: Add in-memory assistant analytics summary and admin metrics API (P0)
  - Acceptance: Assistant runtime tracks key funnel counters and exposes them to admins through an API.
  - Files: `lib/assistant/store.ts`, `lib/assistant/types.ts`, `lib/assistant/service.ts`, `app/api/admin/assistant-metrics/route.ts`
  - Completed: 2026-04-03 - Added assistant metrics state, event counting, and the admin metrics endpoint.

- [x] Task 4: Expose runtime flags/analytics in health surface and admin KPI panel (P1)
  - Acceptance: Runtime health shows assistant config/analytics and admin console renders assistant KPIs.
  - Files: `app/api/runtime/health/route.ts`, `app/admin/admin-console.tsx`, `app/globals.css`, `lib/site-copy.ts`, `locales/*.json`
  - Completed: 2026-04-03 - Added runtime health assistant metadata and admin KPI rendering with localized labels.

- [x] Task 5: Add additive ops migration for runtime config and analytics events (P1)
  - Acceptance: Migration adds `assistant_runtime_config` and `assistant_event_analytics` with indexes and no destructive edits.
  - Files: `supabase/migrations/0007_v15_assistant_ops.sql`
  - Completed: 2026-04-03 - Added additive operations schema for runtime config and analytics event persistence.

- [x] Task 6: Add v15 regression coverage and walkthrough evidence (P1)
  - Acceptance: v15 tests assert hardening/runtime contracts and targeted regressions pass; walkthrough documents build/lint/test/security evidence.
  - Files: `tests/unit/`, `tests/e2e/`, `sprints/v15/WALKTHROUGH.md`
  - Completed: 2026-04-03 - Added v15 contract and regression coverage; walkthrough will capture final evidence.
