# PRD — Kowa Website Assistant Foundation (v11)

## 1) Sprint Overview
Sprint v11 establishes the first website-first assistant foundation for Kowa. It replaces the narrow single-turn chat contract with assistant sessions, structured turn handling, visitor profile capture scaffolding, and an additive Supabase schema that prepares the site for qualification and office handoff in later sprints.

## 2) Goals
- Introduce assistant session and turn contracts for the website chat flow.
- Add a server-side assistant orchestration layer with explicit intent and stage handling.
- Preserve the existing popup chat UX while moving it onto the new assistant APIs.
- Add additive Supabase schema for assistant sessions, visitor profiles, and turn telemetry.
- Publish v11 sprint artifacts and validation evidence for the foundation slice.

## 3) User Stories
- As a visitor, I want the website assistant to remember the active conversation session while I continue chatting.
- As an operator, I want assistant turns to carry structured intent and stage metadata so qualification workflows can be built safely.
- As a product engineer, I want a typed assistant API boundary so Telegram and future admin workflows can reuse the same core later.

## 4) Technical Architecture
- Frontend:
  - `components/chat-widget.tsx` uses session bootstrap and assistant turn APIs.
- Backend:
  - `app/api/assistant/session/route.ts`
  - `app/api/assistant/turn/route.ts`
  - `app/api/chat/route.ts` compatibility bridge
- Domain layer:
  - `lib/assistant/types.ts`
  - `lib/assistant/policy.ts`
  - `lib/assistant/store.ts`
  - `lib/assistant/service.ts`
- Persistence:
  - `supabase/migrations/0004_v11_assistant_foundation.sql`

### Component Diagram
```text
[Chat Popup]
  -> POST /api/assistant/session
  -> POST /api/assistant/turn
  -> Assistant service
     -> policy
     -> retrieval
     -> in-memory session store
     -> retrieval event logging

[Compatibility]
  /api/chat
    -> assistant session bootstrap
    -> assistant turn
```

## 5) Out of Scope
- Office queue submission and handoff confirmation UX.
- Full Dify workflow execution against external models.
- Telegram webhook/channel integration.
- Admin inbox for assistant handoffs.

## 6) Dependencies
- Existing retrieval flow and runtime source store.
- Existing multilingual copy and popup chat entrypoint.
- Existing Supabase `app_language` and `rag_conversations` schema from v10.

## 7) Locked Acceptance Criteria
- The site exposes assistant session and turn APIs with typed structured responses.
- The popup chat uses assistant sessions rather than the old single-request-only flow.
- `/api/chat` remains available as a backward-compatible bridge.
- The migration adds assistant session, visitor profile, and turn-event tables without destructive changes.
- Build, lint, and targeted v11 tests pass.
