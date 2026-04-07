# v12 Walkthrough

## Overview
Sprint v12 hardened the website-first assistant by adding multilingual retrieval normalization, recent-turn memory shaping for follow-up prompts, and compact popup rendering for confidence, citation, and recovery metadata. The assistant remains website-first and does not yet submit office handoffs.

## Scope Delivered
- Added v12 sprint artifacts:
  - `sprints/v12/PRD.md`
  - `sprints/v12/TASKS.md`
  - `sprints/v12/WALKTHROUGH.md`
- Hardened assistant policy and retrieval logic:
  - `lib/assistant/policy.ts`
  - `lib/assistant/service.ts`
- Updated popup locale propagation and metadata rendering:
  - `app/page.tsx`
  - `components/chat-popup.tsx`
  - `components/chat-widget.tsx`
  - `app/globals.css`
- Added targeted v12 regression coverage:
  - `tests/unit/v12-task1-baseline-inventory.test.mjs`
  - `tests/unit/v12-task3-service-contract.test.mjs`
  - `tests/e2e/v12-task5-multilingual-memory.spec.ts`

## Validation Evidence

### Build
- Command: `npm run build`
- Result: pass
- Notes: Next.js production build succeeded after the multilingual retrieval and popup metadata changes.

### Lint
- Command: `npm run lint`
- Result: pass with existing warnings
- Warnings:
  - `@next/next/no-img-element` in `app/page.tsx`
  - `@next/next/no-img-element` in `components/product-carousel.tsx`

### v12 Unit Tests
- Command: `node --test tests/unit/v12-*.test.mjs`
- Result: pass (`4 passed`, `0 failed`)
- Coverage:
  - v12 sprint artifact presence
  - multilingual retrieval/memory scope references
  - service/policy contract terms for multilingual detection, retrieval normalization, and follow-up memory shaping

### v12 E2E
- Command: `npx playwright test tests/e2e/v12-task5-multilingual-memory.spec.ts`
- Result: pass (`2 passed`)
- Coverage:
  - Japanese address question returns a localized grounded reply
  - popup renders confidence and citation metadata
  - follow-up English question uses prior turn memory wording

## Implementation Notes
- Multilingual questions were previously failing retrieval because the source corpus is predominantly English. The fix was applied in the assistant service by normalizing Japanese and Chinese question terms into retrieval-friendly English keywords rather than changing the source corpus.
- The popup assistant now receives the active homepage locale directly from page state instead of inferring it from a static root document language value.

## Key Files
- `lib/assistant/policy.ts`
- `lib/assistant/service.ts`
- `components/chat-widget.tsx`
- `components/chat-popup.tsx`
- `app/page.tsx`
- `tests/e2e/v12-task5-multilingual-memory.spec.ts`

## Completion State
- v12 Task 1 through Task 6 are complete in `sprints/v12/TASKS.md`.
