# v10 Baseline Scope Inventory

Date: 2026-04-02
Sprint: v10

## Migration Order
1. `supabase/migrations/0001_core.sql`
2. `supabase/migrations/0002_source_runtime.sql`
3. `supabase/migrations/0003_v10_multilingual_auth_rag.sql`

## Existing Core Tables (Pre-v10)
- `documents`
- `chunks`
- `chat_sessions`
- `chat_messages`
- `sources`
- `retrieval_events`

## v10 New Domain Targets
- User identity/profile:
  - `public.user_profiles`
- Multilingual upload/content:
  - `public.content_items`
  - `public.content_translations`
- RAG indexing pipeline:
  - `public.rag_documents_v2`
  - `public.rag_chunks_v2`
- Conversation and quality loop:
  - `public.rag_conversations`
  - `public.rag_messages`
  - `public.rag_feedback`

## v10 Security and Storage Targets
- Row-level security enabled for all user-owned v10 tables.
- Ownership policies based on `auth.uid()`.
- Storage bucket `rag-content` with folder-scoped object policies (`<auth.uid()>/...`).

## Compatibility Bridge
- `public.chat_sessions.user_uuid` (FK to `auth.users(id)`) added for migration compatibility.
