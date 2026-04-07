# v11 Walkthrough

## Overview
Sprint v11 established the first website-first assistant foundation for Kowa. The release adds typed assistant session and turn APIs, a shared orchestration/policy layer, popup chat integration on top of the new assistant contract, and an additive Supabase schema for assistant sessions, visitor profiles, and turn telemetry.

## Scope Delivered
- Added v11 sprint artifacts:
  - `sprints/v11/PRD.md`
  - `sprints/v11/TASKS.md`
  - `sprints/v11/WALKTHROUGH.md`
- Added assistant foundation domain and orchestration modules:
  - `lib/assistant/types.ts`
  - `lib/assistant/policy.ts`
  - `lib/assistant/store.ts`
  - `lib/assistant/service.ts`
- Added website-first assistant APIs:
  - `app/api/assistant/session/route.ts`
  - `app/api/assistant/turn/route.ts`
- Kept backward compatibility for existing callers:
  - `app/api/chat/route.ts`
- Refactored popup chat to use assistant session bootstrap + structured turn submission:
  - `components/chat-widget.tsx`
- Added additive assistant schema:
  - `supabase/migrations/0004_v11_assistant_foundation.sql`
- Added v11 contract coverage:
  - `tests/unit/v11-task1-baseline-inventory.test.mjs`
  - `tests/unit/v11-task5-migration-contract.test.mjs`
  - `tests/e2e/v11-task4-assistant-session.spec.ts`

## Validation Evidence

### Build
- Command: `npm run build`
- Result: pass
- Notes: Next.js production build succeeded with assistant session/turn routes included in the app manifest.

### Lint
- Command: `npm run lint`
- Result: pass with existing warnings
- Warnings:
  - `@next/next/no-img-element` in `app/page.tsx`
  - `@next/next/no-img-element` in `components/product-carousel.tsx`

### v11 Unit Tests
- Command: `node --test tests/unit/v11-*.test.mjs`
- Result: pass (`5 passed`, `0 failed`)
- Coverage:
  - v11 sprint artifact presence
  - assistant foundation scope references
  - assistant migration enums/tables
  - assistant migration indexes/triggers
  - task tracker contract

### v11 E2E
- Command: `npx playwright test tests/e2e/v11-task4-assistant-session.spec.ts`
- Result: pass (`1 passed`)
- Coverage:
  - popup chat opens from homepage CTA
  - assistant session/turn flow returns a grounded reply
  - compact popup UI remains operational on the new assistant contract

## Implementation Notes
- The first assistant service version assumed an in-memory session store would always survive separate route invocations. During Playwright verification, that assumption proved too optimistic, so the turn flow was patched to self-bootstrap the session record when necessary.
- The Playwright config was updated to use a dedicated test port to avoid collisions with unrelated local dev servers during branch verification.

## Key Files
- `lib/assistant/types.ts`
- `lib/assistant/service.ts`
- `app/api/assistant/session/route.ts`
- `app/api/assistant/turn/route.ts`
- `components/chat-widget.tsx`
- `supabase/migrations/0004_v11_assistant_foundation.sql`

## Completion State
- v11 Task 1 through Task 6 are complete in `sprints/v11/TASKS.md`.
