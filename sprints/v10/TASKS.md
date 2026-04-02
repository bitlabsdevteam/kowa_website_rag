# Tasks — v10

- [x] Task 1: Baseline v10 scope and schema inventory (P0)
  - Acceptance: Inventory confirms current tables, migration order, and v10 target entities for multilingual uploads + auth + RAG history.
  - Files: `sprints/v10/PRD.md`, `sprints/v10/TASKS.md`, `supabase/migrations/`
  - Completed: 2026-04-02 - Added v10 baseline inventory artifact and unit test coverage for migration order, target schema entities, storage scope, and compatibility bridge.

- [x] Task 2: Add user profile domain model linked to `auth.users` (P0)
  - Acceptance: `user_profiles` supports display fields, preferred language, timezone, and timestamp lifecycle.
  - Files: `supabase/migrations/0003_v10_multilingual_auth_rag.sql`
  - Completed: 2026-04-02 - Added unit coverage validating `user_profiles` auth linkage, locale/timezone defaults, timestamp lifecycle, RLS ownership policies, and update trigger contract.

- [x] Task 3: Add multilingual content upload schema (P0)
  - Acceptance: `content_items` and `content_translations` support `en/ja/zh`, upload metadata, processing status, and translation uniqueness.
  - Files: `supabase/migrations/0003_v10_multilingual_auth_rag.sql`
  - Completed: 2026-04-02 - Added unit coverage validating multilingual language/status enums, content upload metadata fields, translation uniqueness constraint, and per-user ownership policies for content tables.

- [x] Task 4: Add RAG document/chunk schema with vector index (P0)
  - Acceptance: `rag_documents_v2` and `rag_chunks_v2` support chunk ordering, embedding storage, and retrieval index.
  - Files: `supabase/migrations/0003_v10_multilingual_auth_rag.sql`
  - Completed: 2026-04-02 - Added unit coverage validating document/chunk schema constraints, embedding column contract, and cosine ivfflat retrieval index presence.

- [x] Task 5: Add conversation/message/feedback schema for authenticated users (P0)
  - Acceptance: `rag_conversations`, `rag_messages`, and `rag_feedback` store full thread history, citations, and feedback tied to users.
  - Files: `supabase/migrations/0003_v10_multilingual_auth_rag.sql`
  - Completed: 2026-04-02 - Added unit coverage validating conversation/message/feedback schema constraints, citation/model telemetry fields, rating contract, and user ownership policy coverage.

- [x] Task 6: Add `updated_at` trigger function and table triggers (P0)
  - Acceptance: Relevant mutable tables auto-maintain `updated_at` on update.
  - Files: `supabase/migrations/0003_v10_multilingual_auth_rag.sql`
  - Completed: 2026-04-02 - Added unit coverage validating reusable `set_updated_at()` trigger function contract and trigger wiring on mutable v10 tables.

- [ ] Task 7: Enable RLS for all new user-owned tables (P0)
  - Acceptance: RLS is enabled and default access is denied without policies.
  - Files: `supabase/migrations/0003_v10_multilingual_auth_rag.sql`

- [ ] Task 8: Add per-user CRUD RLS policies for profiles/content/rag tables (P0)
  - Acceptance: Policies enforce ownership via `auth.uid()` and prevent cross-user reads/writes.
  - Files: `supabase/migrations/0003_v10_multilingual_auth_rag.sql`

- [ ] Task 9: Add storage bucket and folder-scoped object policies (P0)
  - Acceptance: Bucket `rag-content` exists and users can only access objects under their own folder prefix.
  - Files: `supabase/migrations/0003_v10_multilingual_auth_rag.sql`

- [ ] Task 10: Add migration compatibility adjustment for legacy chat sessions (P1)
  - Acceptance: `chat_sessions` includes `user_uuid` FK for bridge compatibility with authenticated user identity.
  - Files: `supabase/migrations/0003_v10_multilingual_auth_rag.sql`

- [ ] Task 11: Add migration verification tests for schema + policy contract (P1)
  - Acceptance: Automated checks assert required tables/types/policies/indexes are present in migration text.
  - Files: `tests/unit/` (new v10 specs), `supabase/migrations/0003_v10_multilingual_auth_rag.sql`

- [ ] Task 12: Publish v10 walkthrough and validation evidence (P2)
  - Acceptance: Build/lint/security checks and v10 test evidence are documented in sprint walkthrough.
  - Files: `sprints/v10/WALKTHROUGH.md`
