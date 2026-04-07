# v13 Walkthrough

## Overview
Sprint v13 upgrades the website assistant into a structured intake flow. The popup can now collect visitor details for qualified commercial requests, prepare an office-facing summary draft, and confirm submission into a queue model that later admin work can consume.

## Scope Delivered
- Added v13 sprint artifacts:
  - `sprints/v13/PRD.md`
  - `sprints/v13/TASKS.md`
  - `sprints/v13/WALKTHROUGH.md`
- Extended assistant state/contracts:
  - `lib/assistant/types.ts`
  - `lib/assistant/store.ts`
- Added handoff preview/confirm APIs:
  - `app/api/assistant/handoff/preview/route.ts`
  - `app/api/assistant/handoff/confirm/route.ts`
- Added handoff service flow:
  - `lib/assistant/service.ts`
- Added popup contact capture and handoff UX:
  - `components/chat-widget.tsx`
  - `app/globals.css`
  - `lib/site-copy.ts`
  - `locales/en.json`
  - `locales/ja.json`
  - `locales/zh.json`
- Added additive queue schema:
  - `supabase/migrations/0005_v13_handoff_queue.sql`
- Added v13 contract and flow coverage:
  - `tests/unit/v13-task1-baseline-inventory.test.mjs`
  - `tests/unit/v13-task5-queue-contract.test.mjs`
  - `tests/e2e/v13-task4-handoff-confirm.spec.ts`

## Validation Evidence

### Build
- Command: `npm run build`
- Result: pass
- Notes: Next.js production build succeeded with the new handoff preview and confirm routes included in the app manifest.

### Lint
- Command: `npm run lint`
- Result: pass with existing warnings
- Warnings:
  - `@next/next/no-img-element` in `app/page.tsx`
  - `@next/next/no-img-element` in `components/product-carousel.tsx`

### v13 Unit Tests
- Command: `node --test tests/unit/v13-*.test.mjs`
- Result: pass (`4 passed`, `0 failed`)
- Coverage:
  - v13 sprint artifact and queue migration presence
  - qualification/handoff planning references
  - handoff preview/confirm service contract terms
  - queue schema contract

### v13 E2E
- Command: `npx playwright test tests/e2e/v13-task4-handoff-confirm.spec.ts`
- Result: pass (`1 passed`)
- Coverage:
  - quote-style prompt triggers contact capture
  - visitor details can be entered in the popup
  - office summary draft can be prepared and confirmed
  - final submission message is shown in the assistant thread

## Implementation Notes
- Runtime queue insertion is currently memory-backed, matching the existing assistant session/message runtime model. The additive Supabase schema prepares the normalized queue structure for later admin integration.

## Completion State
- v13 Task 1 through Task 6 are complete in `sprints/v13/TASKS.md`, subject to final validation evidence.
