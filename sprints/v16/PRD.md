# PRD — Kowa Telegram Adapter On Assistant Core (v16)

## 1) Sprint Overview
Sprint v16 extends the existing website-first assistant core to Telegram without forking assistant logic. It adds a Telegram webhook adapter, channel identity mapping, session resume behavior, and normalized outbound reply generation so Telegram can use the same retrieval, qualification, and handoff flow already established on the website.

## 2) Goals
- Add a Telegram webhook route that normalizes inbound Telegram messages into the assistant turn contract.
- Reuse and resume assistant sessions per Telegram user/chat instead of creating isolated one-off sessions.
- Add channel binding and adapter contracts in code and additive schema for future persistence.
- Support safe Telegram reply delivery with optional outbound transport and explicit disabled/ignored behavior.
- Publish v16 walkthrough evidence covering route, mapping, and regression validation.

## 3) User Stories
- As a Telegram user, I want to ask Kowa questions in Telegram so that I can interact with the same assistant outside the website.
- As an operator, I want Telegram conversations mapped into the same assistant core so that business logic, qualification, and queueing remain consistent.
- As a release owner, I want Telegram webhook auth and disabled-mode behavior controlled by runtime flags so that the adapter can be staged safely.

## 4) Technical Architecture
- Runtime:
  - `lib/runtime-config.ts` exposes Telegram adapter and delivery flags.
- Channel adapter:
  - `lib/telegram/service.ts` parses Telegram updates, resumes/creates channel sessions, runs assistant turns, and prepares outbound messages.
  - `lib/telegram/client.ts` optionally delivers replies to Telegram when token-based delivery is enabled.
- In-memory channel state:
  - `lib/assistant/store.ts` maintains Telegram channel bindings for current runtime behavior.
- Routes:
  - `app/api/telegram/webhook/route.ts`
- Schema:
  - `supabase/migrations/0008_v16_telegram_adapter.sql`
  - `public.telegram_channel_accounts`

```text
Telegram Update
  -> /api/telegram/webhook
  -> Telegram adapter service
  -> channel session binding lookup
  -> assistant session/turn core
  -> outbound Telegram message payload
  -> optional Telegram sendMessage delivery
```

## 5) Out of Scope
- Telegram inline keyboards, media messages, and file uploads.
- Persistent Supabase-backed Telegram session runtime writes.
- Multi-bot routing or OpenClaw-style gateway fan-out.
- Telegram admin inbox actions from chat commands.

## 6) Dependencies
- Completed v11-v15 assistant session, memory, handoff, admin inbox, and runtime hardening work.
- Existing `AssistantChannel = 'website' | 'telegram'` contract and assistant session model.
- Optional env values for live Telegram delivery: bot token and webhook secret.

## 7) Locked Acceptance Criteria
- Telegram webhook accepts supported text updates and returns a normalized outbound reply payload.
- Repeated Telegram messages from the same user/chat reuse the same assistant session and conversation.
- Unsupported Telegram updates are ignored safely with `200` responses.
- Telegram runtime flags control adapter enablement and optional delivery.
- Additive migration defines a Telegram channel account mapping table with indexes.
