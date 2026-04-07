# v15 Walkthrough

## Overview
Sprint v15 hardens the website assistant and admin inbox for safer release. The implementation adds bounded runtime flags and limits, basic rate limiting and payload validation, lightweight funnel analytics, runtime-health visibility for assistant policy, and admin KPI visibility for the office team.

## Scope Delivered
- Added v15 sprint artifacts:
  - `sprints/v15/PRD.md`
  - `sprints/v15/TASKS.md`
  - `sprints/v15/WALKTHROUGH.md`
- Added assistant runtime config and request guards:
  - `lib/runtime-config.ts`
  - `lib/assistant/service.ts`
  - `app/api/assistant/turn/route.ts`
  - `app/api/assistant/handoff/preview/route.ts`
  - `app/api/assistant/handoff/confirm/route.ts`
  - `app/api/admin/handoffs/route.ts`
  - `app/api/admin/handoffs/[id]/status/route.ts`
  - `app/api/admin/handoffs/[id]/note/route.ts`
- Added assistant analytics state and admin metrics API:
  - `lib/assistant/store.ts`
  - `lib/assistant/types.ts`
  - `app/api/admin/assistant-metrics/route.ts`
- Extended runtime health and admin KPI display:
  - `app/api/runtime/health/route.ts`
  - `app/admin/admin-console.tsx`
  - `app/globals.css`
  - `lib/site-copy.ts`
  - `locales/en.json`
  - `locales/ja.json`
  - `locales/zh.json`
- Added additive ops schema:
  - `supabase/migrations/0007_v15_assistant_ops.sql`
- Added v15 contract and runtime guardrail coverage:
  - `tests/unit/v15-task1-baseline-inventory.test.mjs`
  - `tests/unit/v15-task5-hardening-contract.test.mjs`
  - `tests/e2e/v15-task4-runtime-guardrails.spec.ts`

## Validation Evidence

### Build
- Command: `npm run build`
- Result: pass
- Notes: Next.js production build succeeded with the new admin metrics endpoint and runtime-health assistant metadata.

### Lint
- Command: `npm run lint`
- Result: pass with existing warnings
- Warnings:
  - `@next/next/no-img-element` in `app/page.tsx`
  - `@next/next/no-img-element` in `components/product-carousel.tsx`

### v15 Unit Tests
- Command: `node --test tests/unit/v15-*.test.mjs`
- Result: pass (`4 passed`, `0 failed`)
- Coverage:
  - v15 sprint artifact and ops migration presence
  - hardening/runtime planning references
  - runtime flag/limit/metrics contract terms
  - assistant ops migration contract

### v15 E2E
- Command: `npx playwright test tests/e2e/v15-task4-runtime-guardrails.spec.ts`
- Result: pass (`2 passed`)
- Coverage:
  - runtime health exposes assistant flags, limits, and analytics
  - assistant turn route rejects burst traffic for one session

### Security
- Command: `npx semgrep --config auto app/ lib/ --quiet`
- Result: pass
- Command: `npm audit --omit=dev`
- Result: pass (`0 vulnerabilities`)

## Implementation Notes
- The rate limiter is intentionally lightweight and memory-backed. It is scoped to the current runtime and session-oriented request keys, which is appropriate for the current single-instance development and branch-validation model.
- Runtime health now exposes assistant policy and analytics directly so release reviewers can validate that the public assistant, handoff flow, and admin inbox flags are aligned before deployment.
- Mutable assistant and admin inbox routes now reject malformed JSON payloads with `400` responses rather than surfacing parser failures, and admin inbox endpoints honor the `adminInboxEnabled` runtime flag.

## Completion State
- v15 Task 1 through Task 6 are complete in `sprints/v15/TASKS.md`, subject to final validation evidence.
