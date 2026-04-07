# PRD — Kowa Website Assistant Qualification + Handoff Confirmation (v13)

## 1) Sprint Overview
Sprint v13 upgrades the website-first assistant from informational chat into a structured intake assistant. It adds contact capture inside the popup, generates an office-facing handoff draft for qualified conversations, and confirms submission into an internal queue model that later admin tools can consume.

## 2) Goals
- Capture visitor contact details needed for quote, sourcing, support, and partnership requests.
- Generate a structured office handoff draft only when required contact fields are complete.
- Add explicit handoff preview and confirm APIs.
- Add an additive queue schema for office handoff records.
- Preserve the compact popup chat UX while introducing preview/confirm controls.

## 3) User Stories
- As a visitor with a commercial question, I want to provide my details in the chat so Kowa can follow up accurately.
- As a visitor, I want to review the office summary before it is submitted.
- As an operator, I want confirmed handoffs written to a normalized queue structure that can later power an admin inbox.

## 4) Technical Architecture
- Frontend:
  - popup contact card for visitor details
  - handoff preview card
  - handoff confirm action
- Backend:
  - `POST /api/assistant/handoff/preview`
  - `POST /api/assistant/handoff/confirm`
- Domain/state:
  - assistant session stores pending handoff draft
  - in-memory admin queue store for current runtime behavior
- Persistence:
  - `supabase/migrations/0005_v13_handoff_queue.sql`
  - `public.admin_handoff_queue`

## 5) Out of Scope
- Admin inbox UI for reviewing the queue.
- Email or CRM side effects.
- Telegram handoff flow.
- Full Supabase-backed runtime queue persistence in the application layer.

## 6) Dependencies
- Completed v11 assistant session/turn foundation.
- Completed v12 multilingual retrieval, memory, and popup metadata work.
- Existing assistant session store and popup locale propagation.

## 7) Locked Acceptance Criteria
- Commercial or support prompts can trigger contact collection in the popup.
- Handoff preview requires complete visitor details before returning a draft.
- Handoff confirm returns a successful queue submission response and clears the pending draft.
- The additive migration defines the office queue table and status enum without destructive changes.
- Build, lint, v13 unit tests, and targeted v13 Playwright coverage pass.
