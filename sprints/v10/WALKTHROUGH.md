# v10 Walkthrough

## Overview
Sprint v10 delivered the multilingual data foundation for Kowa’s authenticated RAG platform: user profiles, multilingual content ingestion metadata, document/chunk retrieval structures, conversation history, storage security, and Supabase migration hardening with regression tests.

## Scope Delivered
- Added v10 PRD and execution backlog artifacts.
- Delivered Supabase migration:
  - `supabase/migrations/0003_v10_multilingual_auth_rag.sql`
- Added schema coverage for:
  - `user_profiles`
  - `content_items`
  - `content_translations`
  - `rag_documents_v2`
  - `rag_chunks_v2`
  - `rag_conversations`
  - `rag_messages`
  - `rag_feedback`
- Added compatibility bridge:
  - `chat_sessions.user_uuid` FK + index.
- Added security controls:
  - RLS enablement on all user-owned v10 tables.
  - Per-user CRUD policies across profile/content/rag tables.
  - Storage bucket `rag-content` and folder-scoped object policies.
- Added consolidated v10 migration contract regression tests.

## Validation Evidence

### Build
- Command: `npm run build`
- Result: pass
- Notes: Next.js production build succeeded; key routes (`/`, `/news`, `/products`, `/company_profile`) statically generated.

### Lint
- Command: `npm run lint`
- Result: pass (warnings only)
- Warnings:
  - `@next/next/no-img-element` in `app/page.tsx`
  - `@next/next/no-img-element` in `components/product-carousel.tsx`

### v10 Unit Regression Suite
- Command: `node --test tests/unit/v10-*.test.mjs`
- Result: pass (`33 passed`, `0 failed`)
- Coverage areas:
  - Baseline scope/migration order contract
  - User profile auth linkage and defaults
  - Multilingual content upload schema
  - RAG document/chunk schema + vector index
  - Conversation/message/feedback schema
  - `updated_at` trigger function and wiring
  - RLS enablement across all v10 user-owned tables
  - Per-user CRUD policy completeness
  - Storage bucket and folder-scoped object policies
  - Legacy `chat_sessions.user_uuid` compatibility bridge
  - Consolidated migration regression contract

### Security
- Command: `npx semgrep --config auto app/ lib/ --quiet`
- Result: pass
- Command: `npm audit --omit=dev`
- Result: pass (`0 vulnerabilities`)

## Implementation Notes
- During Task 8 verification, a missing `user_profiles_delete_own` policy was detected by test-first checks and patched in the migration.
- Early v10 unit tests included temporary “follow-up task unchecked” assertions. For final regression stability, these were updated to assert durable task-entry presence instead of transient backlog state.

## Key Files
- `sprints/v10/PRD.md`
- `sprints/v10/TASKS.md`
- `sprints/v10/WALKTHROUGH.md`
- `supabase/migrations/0003_v10_multilingual_auth_rag.sql`
- `tests/unit/v10-task*.test.mjs`

## Completion State
- v10 Task 1 through Task 12 are complete in `sprints/v10/TASKS.md`.
