# v16 Walkthrough

## Overview
Sprint v16 adds a Telegram adapter on top of the existing website-first assistant core. The implementation introduces Telegram runtime flags, in-memory channel session bindings, a webhook route that normalizes Telegram updates into the assistant flow, optional outbound Telegram delivery, and an additive schema for future persistence of Telegram channel accounts.

## Scope Delivered
- Added v16 sprint artifacts:
  - `sprints/v16/PRD.md`
  - `sprints/v16/TASKS.md`
  - `sprints/v16/WALKTHROUGH.md`
- Added Telegram runtime and channel-binding contracts:
  - `.env.example`
  - `lib/runtime-config.ts`
  - `lib/assistant/types.ts`
  - `lib/assistant/store.ts`
- Added Telegram adapter service and outbound client:
  - `lib/telegram/service.ts`
  - `lib/telegram/client.ts`
- Added Telegram webhook surface:
  - `app/api/telegram/webhook/route.ts`
- Added additive Telegram schema:
  - `supabase/migrations/0008_v16_telegram_adapter.sql`
- Added v16 Telegram coverage:
  - `tests/unit/v16-task1-baseline-inventory.test.mjs`
  - `tests/unit/v16-task5-telegram-contract.test.mjs`
  - `tests/e2e/v16-task4-telegram-webhook.spec.ts`

## Validation Evidence

### Build
- Command: `npm run build`
- Result: pass
- Notes: Next.js build includes the new `/api/telegram/webhook` route and compiles the Telegram adapter service/client cleanly.

### Lint
- Command: `npm run lint`
- Result: pass with existing warnings
- Warnings:
  - `@next/next/no-img-element` in `app/page.tsx`
  - `@next/next/no-img-element` in `components/product-carousel.tsx`

### v16 Unit Tests
- Command: `node --test tests/unit/v16-*.test.mjs`
- Result: pass (`3 passed`, `0 failed`)
- Coverage:
  - v16 sprint artifact presence and Telegram scope references
  - Telegram runtime/store/service/route contract terms
  - Telegram adapter migration contract

### v16 E2E
- Command: `npx playwright test tests/e2e/v16-task4-telegram-webhook.spec.ts`
- Result: pass (`3 passed`)
- Coverage:
  - normalized reply payload for supported Telegram text messages
  - assistant session reuse for the same Telegram user/chat
  - safe ignore behavior for unsupported Telegram updates

### Security
- Command: `npx semgrep --config auto app/ lib/ --quiet`
- Result: pass
- Command: `npm audit --omit=dev`
- Result: pass (`0 vulnerabilities`)

## Implementation Notes
- Telegram is implemented as an adapter on the same assistant core rather than as a separate agent runtime. Website and Telegram now share the same session, retrieval, qualification, and handoff logic.
- Outbound Telegram delivery is disabled by default and only attempts a real `sendMessage` call when both the Telegram adapter is enabled and delivery is explicitly turned on with a bot token.
- Webhook secret validation is optional in development and enforced only when `TELEGRAM_WEBHOOK_SECRET` is configured.

## Completion State
- v16 Task 1 through Task 6 are complete in `sprints/v16/TASKS.md`.
