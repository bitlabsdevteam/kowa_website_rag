# PRD — Kowa Website + RAG (v3)

## 1) Sprint Goal
Move from MVP functionality to production-quality user experience and robust content operations.

## 2) Why v3
v2 established migration visibility, auth baseline, and ingestion API. v3 focuses on polished UX, structured content governance, and stronger retrieval confidence at scale.

## 3) Objectives
- Launch premium, conversion-ready landing and content pages.
- Add managed content pipeline with versioning and publish controls.
- Improve answer trust with better retrieval ranking and citation quality.
- Introduce admin observability and operational controls.

## 4) Scope (In)

### V3-R1 Premium Frontend System
- Refined design system (typography, spacing, visual consistency, responsive polish)
- Homepage conversion blocks and stronger chatbot onboarding prompts
- Legacy content pages transformed into curated modern sections
- Explicit benchmark-driven design pass inspired by top AI product websites (Anthropic-style clarity, trust-first layout, minimal friction, editorial readability)

### V3-R1.1 Website Excellence Benchmark Requirements
- Study top company patterns (including Anthropic) for:
  - clear narrative hierarchy (problem -> capability -> trust -> action)
  - restrained but premium visual system
  - high readability and fast comprehension
  - strong CTA placement without visual noise
  - transparent AI safety/trust messaging
- Apply benchmark insights to Kowa branding (not copy-paste clone)

### V3-R2 Content Governance
- Source versioning and publish/unpublish flow
- Source status lifecycle: draft -> review -> published -> archived
- Change history and rollback metadata

### V3-R3 Retrieval Quality v2
- Hybrid retrieval scoring (semantic + keyword boost)
- Better chunk metadata and rerank logic
- Strong citation card UX (source, section, confidence hints)

### V3-R4 Admin Ops Console
- Dashboard for ingestion status, recent failures, and source health
- Quick actions for re-index, disable source, and validate citations

### V3-R5 Reliability & QA
- Expanded E2E suite for admin/content/retrieval workflows
- Pilot regression checklist for every release

## 5) Out of Scope
- Multi-region active-active deployment
- Enterprise SSO / IAM federation
- Full BI warehouse analytics

## 6) Success Metrics
- >90% grounded responses for in-scope questions
- <2% citation render/link failures
- >95% content publish operations without manual DB intervention
- Reduced unanswered query rate over v2 baseline

## 7) Technical Direction
- Next.js + TypeScript (frontend/API)
- LangGraph/LangChain for agent orchestration
- Supabase Postgres + pgvector
- S3-compatible source storage

## 8) Risks
- Overfitting retrieval to legacy wording
- Content governance complexity increase
- UX polish scope creep

## 9) Milestones
- v3.1 Frontend premium redesign + IA hardening
- v3.2 Content lifecycle controls + admin console
- v3.3 Retrieval quality and citation UX v2
- v3.4 E2E hardening + release checklist
