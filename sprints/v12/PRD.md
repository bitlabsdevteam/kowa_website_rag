# PRD — Kowa Website Assistant Retrieval + Memory + Multilingual Flow (v12)

## 1) Sprint Overview
Sprint v12 hardens the website assistant foundation by improving retrieval quality for multilingual prompts, using recent conversation memory for follow-up turns, and exposing structured citation and recovery metadata in the popup chat UI. The assistant remains website-first and keeps the office-handoff work for later sprints.

## 2) Goals
- Normalize Japanese and Chinese queries into retrieval-friendly English terms without changing source-of-truth content.
- Use recent conversation memory to improve follow-up turns.
- Return and render localized assistant replies and guidance for `en`, `ja`, and `zh`.
- Keep the compact popup chat UX stable while surfacing citations and confidence metadata.
- Publish v12 sprint artifacts and validation evidence.

## 3) User Stories
- As a Japanese or Chinese visitor, I want to ask Kowa questions in my language and get a useful answer without switching to English.
- As a visitor continuing a conversation, I want the assistant to interpret follow-up questions in context.
- As a cautious visitor, I want to see confidence and citation cues so I can judge how grounded the answer is.

## 4) Technical Architecture
- Assistant policy/service improvements:
  - multilingual language detection
  - multilingual retrieval-query normalization
  - contextual follow-up query building from recent turn memory
  - localized answer and recovery-guidance templates
- UI improvements:
  - popup receives active page locale
  - popup renders confidence chip, citation chip, and recovery-guidance list
- Target files:
  - `lib/assistant/policy.ts`
  - `lib/assistant/service.ts`
  - `components/chat-popup.tsx`
  - `components/chat-widget.tsx`
  - `app/page.tsx`
  - `app/globals.css`

## 5) Out of Scope
- Office handoff confirmation and queue submission.
- Telegram channel integration.
- Full database persistence of assistant turns into Supabase RAG tables.
- Replacing the retrieval engine with embeddings or external search.

## 6) Dependencies
- Completed v11 assistant session/turn foundation.
- Existing Kowa normalized source artifacts and retrieval store.
- Existing locale selector and homepage locale state.

## 7) Locked Acceptance Criteria
- Japanese and Chinese business questions can retrieve grounded Kowa answers.
- Follow-up wording like “And what about…” uses recent turn memory in the assistant service.
- Popup chat displays confidence/citation metadata for assistant responses.
- Homepage locale selection propagates into the popup assistant session flow.
- Build, lint, v12 unit checks, and targeted v12 Playwright specs pass.
