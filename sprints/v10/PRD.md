# PRD — Kowa Website + RAG (v10)

## 1) Sprint Overview
Sprint v10 introduces a multilingual content ingestion foundation and production-grade data model for authenticated users and RAG history. Users can upload business content in English, Japanese, and Mandarin, while the platform tracks language-aware content processing and preserves conversation lineage for the Aya assistant.

## 2) Goals
- Support multilingual content upload and storage (`en`, `ja`, `zh`).
- Add durable user profile schema linked to `auth.users`.
- Add normalized RAG conversation and message history for each authenticated user.
- Add secure RLS policies so users can only access their own data.
- Provide migration-first setup for Supabase deployment.

## 3) User Stories
- As a user, I want to upload content in my language so my assistant answers remain grounded in relevant sources.
- As a user, I want my profile and preferred language persisted so the UI and chat behavior feel consistent.
- As a user, I want my chat threads and messages saved so I can revisit prior Q&A.
- As an operator, I want strict data-access controls so one user cannot read another user's files or chat history.

## 4) Technical Architecture
- Supabase Postgres schema additions:
  - User profile table (`public.user_profiles`) keyed by `auth.users(id)`.
  - Multilingual upload/content tables (`public.content_items`, `public.content_translations`).
  - RAG document/chunk pipeline tables (`public.rag_documents_v2`, `public.rag_chunks_v2`).
  - Conversation history tables (`public.rag_conversations`, `public.rag_messages`, `public.rag_feedback`).
- Supabase Storage:
  - Bucket: `rag-content`.
  - User-folder ownership convention: `<auth.uid()>/<filename>`.
- Security:
  - RLS enabled for all user-owned tables.
  - Policies enforce `auth.uid()` ownership.
  - Trigger-based `updated_at` management.

## 5) Out of Scope
- UI implementation for uploader wizard and chat-history screens.
- Dify prompt routing and orchestration changes.
- Automatic translation engine implementation.
- Backfill migration from all legacy tables into v10 model.

## 6) Dependencies
- Existing Supabase project with `auth.users` and `vector` extension support.
- Existing Kowa app auth flow migrated to Supabase auth tokens in API calls.
- Service role usage for backend ingestion jobs where needed.

## 7) Locked Acceptance Criteria
- Migration applies successfully on Supabase with no manual edits.
- `user_profiles` references `auth.users(id)` and supports per-user locale.
- Content upload schema supports language tagging (`en`, `ja`, `zh`) and processing state.
- RAG conversation schema stores threads, messages, citations, and model/runtime metadata.
- RLS prevents cross-user reads/writes across profiles, content, and chats.
- Storage bucket and policies allow users to access only their own folder objects.
