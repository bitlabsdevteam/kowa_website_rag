# v14 Walkthrough

## Overview
Sprint v14 brings the assistant handoff queue into the existing admin console. Office users can now view confirmed visitor handoffs, review transcript context, assign owners, update queue status, and add internal notes without leaving the current admin route.

## Scope Delivered
- Added v14 sprint artifacts:
  - `sprints/v14/PRD.md`
  - `sprints/v14/TASKS.md`
  - `sprints/v14/WALKTHROUGH.md`
- Added admin inbox runtime operations and auth helpers:
  - `lib/assistant/service.ts`
  - `lib/assistant/store.ts`
  - `lib/assistant/types.ts`
  - `lib/admin-auth.ts`
- Added admin queue APIs:
  - `app/api/admin/handoffs/route.ts`
  - `app/api/admin/handoffs/[id]/status/route.ts`
  - `app/api/admin/handoffs/[id]/note/route.ts`
- Extended admin console and styles:
  - `app/admin/admin-console.tsx`
  - `app/globals.css`
  - `lib/site-copy.ts`
  - `locales/en.json`
  - `locales/ja.json`
  - `locales/zh.json`
- Added additive inbox migration:
  - `supabase/migrations/0006_v14_admin_inbox.sql`
- Added v14 contract and inbox flow coverage:
  - `tests/unit/v14-task1-baseline-inventory.test.mjs`
  - `tests/unit/v14-task5-admin-inbox-contract.test.mjs`
  - `tests/e2e/v14-task4-admin-inbox.spec.ts`

## Validation Evidence

### Build
- Command: `npm run build`
- Result: pass
- Notes: Next.js production build succeeded with the admin inbox APIs and updated admin route surface.

### Lint
- Command: `npm run lint`
- Result: pass with existing warnings
- Warnings:
  - `@next/next/no-img-element` in `app/page.tsx`
  - `@next/next/no-img-element` in `components/product-carousel.tsx`

### v14 Unit Tests
- Command: `node --test tests/unit/v14-*.test.mjs`
- Result: pass (`4 passed`, `0 failed`)
- Coverage:
  - v14 sprint artifact and inbox migration presence
  - admin inbox planning references
  - admin queue service/auth helper contract
  - assignment/note migration contract

### v14 E2E
- Command: `npx playwright test tests/e2e/v14-task4-admin-inbox.spec.ts`
- Result: pass (`1 passed`)
- Coverage:
  - website assistant confirms a handoff
  - admin console loads the inbox after local admin auth
  - office user can assign owner, add note, and mark the handoff triaged

## Implementation Notes
- The admin queue remains runtime-memory-backed for now, consistent with the current assistant store model. The additive database migration captures the intended long-term schema for assignment metadata and office notes.

## Completion State
- v14 Task 1 through Task 6 are complete in `sprints/v14/TASKS.md`, subject to final validation evidence.
