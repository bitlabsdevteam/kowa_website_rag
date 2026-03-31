# PRD — Kowa Website + RAG (v2)

## 1) Sprint Goal
Upgrade v1 MVP into a production-credible system with real persistence, admin workflows, and stronger retrieval quality.

## 2) Why v2
v1 delivered core migration artifacts, TypeScript site scaffold, and baseline grounded chat. v2 focuses on reliability and operational readiness.

## 3) Objectives
- Replace local file-based ingestion with real Supabase-backed source management.
- Improve retrieval quality and citation fidelity.
- Add role-based admin workflow for content ingestion and publication.
- Strengthen observability and testing.

## 4) Scope (In)

### V2-R1 Supabase-First Data Path
- Persist sources/chunks/sessions/messages in Supabase.
- Remove reliance on local `data/sources.json` for production mode.

### V2-R2 Admin Ingestion Console
- Admin-only UI for source upload/edit/publish/unpublish.
- Ingestion status tracking and failure diagnostics.

### V2-R3 Retrieval & Citation Quality
- Better chunking and scoring strategy.
- Deterministic citation payload (source title + link + excerpt + metadata).
- Strict abstention when evidence is weak.

### V2-R4 Security & Access
- Basic auth gate for admin routes.
- API input validation and least-privilege env usage.

### V2-R5 QA & Release Readiness
- E2E tests for chat grounding, ingestion, and citation rendering.
- Walkthrough and runbook for staging release.

## 5) Out of Scope
- Full enterprise IAM/SSO
- Multi-region deployment
- Advanced BI analytics

## 6) Success Metrics
- >95% ingestion jobs complete without manual rerun
- >85% answer-grounding rate for in-scope queries
- <3% citation rendering failures
- 0 secret leaks in repo checks

## 7) Technical Direction
- Frontend/API: Next.js + TypeScript
- Orchestration: LangGraph/LangChain
- Data/vector: Supabase Postgres + pgvector
- Storage: S3-compatible object store

## 8) Risks
- Supabase schema drift or migration mismatch
- Inconsistent chunk quality from mixed legacy content
- Admin misuse without strict validation

## 9) Milestones
- v2.1 Supabase persistence wiring
- v2.2 Admin ingestion console
- v2.3 Retrieval/citation hardening
- v2.4 QA + release checklist
