# Tasks — v12

- [x] Task 1: Baseline v12 retrieval/memory/multilingual scope and file inventory (P0)
  - Acceptance: v12 planning references assistant policy/service changes, popup locale propagation, and new UI metadata coverage.
  - Files: `sprints/v12/PRD.md`, `sprints/v12/TASKS.md`
  - Completed: 2026-04-03 - Added v12 sprint artifacts covering multilingual retrieval normalization, memory-aware follow-up handling, and popup metadata rendering.

- [x] Task 2: Harden assistant language detection and multilingual intent coverage (P0)
  - Acceptance: Assistant language detection differentiates English, Japanese, and Chinese more reliably and recognizes core business-intent terms across those languages.
  - Files: `lib/assistant/policy.ts`
  - Completed: 2026-04-03 - Expanded language and intent keyword handling for Japanese and Chinese website prompts.

- [x] Task 3: Add multilingual retrieval-query normalization and localized answer templates (P0)
  - Acceptance: Japanese and Chinese questions are normalized into retrieval-friendly terms and localized answer/recovery templates are returned.
  - Files: `lib/assistant/service.ts`
  - Completed: 2026-04-03 - Added retrieval keyword normalization, localized answer/guidance templates, and multilingual heuristic answer rendering.

- [x] Task 4: Use recent conversation memory for follow-up query shaping (P0)
  - Acceptance: Follow-up prompts use prior user turns to shape retrieval and the assistant signals that it is continuing the earlier thread.
  - Files: `lib/assistant/service.ts`, `lib/assistant/store.ts`
  - Completed: 2026-04-03 - Added contextual query building from recent turn history and localized follow-up lead-in handling.

- [x] Task 5: Propagate active locale into popup chat and render assistant metadata (P1)
  - Acceptance: Popup chat uses the selected homepage locale and renders confidence, citation, and recovery metadata in the compact assistant surface.
  - Files: `app/page.tsx`, `components/chat-popup.tsx`, `components/chat-widget.tsx`, `app/globals.css`
  - Completed: 2026-04-03 - Passed locale from the page into chat session/turn requests, updated `document.documentElement.lang`, and rendered confidence/citation/guidance metadata in the popup UI.

- [x] Task 6: Add v12 regression coverage and walkthrough evidence (P1)
  - Acceptance: v12 tests assert artifact/service contracts and targeted Playwright coverage passes for localized reply and follow-up memory behavior.
  - Files: `tests/unit/`, `tests/e2e/`, `sprints/v12/WALKTHROUGH.md`
  - Completed: 2026-04-03 - Added v12 contract tests and targeted Playwright coverage; walkthrough will record the validation evidence.
