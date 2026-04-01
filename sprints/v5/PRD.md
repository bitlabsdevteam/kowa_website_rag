# PRD — Kowa Website + RAG (v5)

## 1) Sprint Goal
Convert the current near-production prototype into a production-ready system with Anthropic-inspired premium UI, beautiful top-navigation, real admin workflows, persistent source management, trustworthy answer UX, containerized runtime support, and measurable release quality.

## 2) Why v5
v4 defined the right product direction, but the current implementation still has critical delivery gaps: local file-based retrieval is still in use, the top menu links to an unimplemented admin route, trust UX is only partially realized, the UI system is not yet aligned to the desired Anthropic-style design language, and release validation is not yet tied to a full operational runbook or containerized deployment path. v5 focuses on closing those gaps with concrete, shippable product and platform work.

## 3) Objectives
- Replace prototype data flows with durable source and retrieval infrastructure.
- Redesign the landing and navigation experience to feel close to Anthropic's editorial, calm, premium website pattern without directly cloning it.
- Deliver a top menu that is visually refined, highly readable, and responsive across desktop and mobile.
- Deliver a real authenticated admin surface for source operations.
- Upgrade chat trust UX from basic citations to explicit grounding feedback and recovery paths.
- Make `kowa_website_rag` runnable in Docker with a `docker-compose` workflow for local and deployment-like validation.
- Establish measurable eval and release gates that block regressions.

## 4) Scope (In)

### V5-R1 Anthropic-Inspired Frontend Redesign
- Redesign the UI system to follow Anthropic-like design principles:
  - calm neutral palette
  - editorial typography
  - restrained premium spacing
  - soft surfaces and high readability
  - trust-first narrative layout
- Apply the design system consistently across landing page, content pages, login, and chat surfaces.
- Use a reusable stylesheet/token approach so the visual system is coherent rather than page-specific.
- Keep the design inspiration recognizable while avoiding copy-paste reproduction of Anthropic assets or exact layouts.

### V5-R1.1 Beautiful Top Menu System
- Replace the current simple pill-link navigation with a more polished top navigation experience.
- Requirements:
  - elegant desktop layout with clear hierarchy
  - strong spacing and hover states
  - visible active-state treatment
  - responsive mobile behavior with low-friction menu reveal
  - persistent CTA entry into chatbot or key action
  - all menu links must resolve to real pages

### V5-R2 Production Source Management
- Replace `data/sources.json` runtime dependency with Supabase-backed source storage.
- Persist source metadata, publish status, chunk records, and ingestion timestamps.
- Support deterministic reindex flow without manual file editing.
- Add environment validation so missing production dependencies fail early.

### V5-R3 Admin Console That Actually Ships
- Implement `/admin` route linked from the main navigation.
- Require authenticated access for admin-only actions.
- Admin workflows:
  - create/edit source
  - publish/unpublish source
  - trigger reindex
  - inspect source health and last ingestion result
- Add explicit confirmations for destructive or state-changing actions.

### V5-R4 Trust UX Completion
- Show answer grounding status in the chat UI.
- Upgrade citation rendering to card-style source blocks with clearer metadata.
- Provide clear no-answer and low-confidence recovery suggestions.
- Improve first-message onboarding so users know what questions are in scope.

### V5-R5 Retrieval Quality and Regression Evaluation
- Introduce a versioned golden-query set for business-critical questions.
- Score answers for:
  - grounded / ungrounded
  - citation present / missing
  - citation valid / broken
  - correct / partial / miss
- Track unanswered query clusters for source expansion.
- Fail release validation when regression thresholds are missed.

### V5-R6 Containerized Runtime and Release Hardening
- Add a production-ready `Dockerfile` for the app runtime.
- Add `docker-compose.yml` to run the website locally in a containerized workflow.
- Ensure the app can boot in Docker with documented environment expectations.
- Make container startup part of validation so deployment-like regressions are caught early.
- Expand Playwright coverage to include:
  - landing page trust UX
  - migrated legacy route validation
  - login flow
  - admin happy path
  - chat grounding behavior
- Add release checklist and smoke-test playbook aligned to actual deployed flows.
- Add versioned walkthrough artifact for v5.

## 5) Out of Scope
- Enterprise-grade RBAC matrix
- Multi-region failover
- Advanced analytics warehouse
- Fully autonomous content rewriting pipeline
- Pixel-perfect cloning of Anthropic's website

## 6) Success Metrics
- 100% of admin menu links resolve to implemented routes
- 100% of primary navigation states render cleanly on desktop and mobile breakpoints
- Landing page and top menu meet the new design-system acceptance criteria for readability, spacing, and visual hierarchy
- >95% successful source publish/reindex operations without manual data patching
- >93% grounded-response rate on approved golden queries
- <1% citation link/render failures in release validation
- Docker image builds successfully and `docker-compose` boots the app without manual source edits
- 0 release approvals when required smoke tests or eval thresholds fail

## 7) Technical Direction
- Next.js + TypeScript for app and route handlers
- Centralized design tokens and shared CSS system for Anthropic-inspired visual consistency
- Supabase Postgres + pgvector for source, chunk, and retrieval persistence
- LangGraph/LangChain-compatible orchestration for future retrieval evolution
- Dockerfile + Docker Compose for local container runtime
- Playwright E2E as mandatory release gate

## 8) Risks
- Over-indexing on visual mimicry instead of adapting the design pattern to Kowa's brand and content
- Navigation polish may expand scope if menu architecture changes late
- Migration from file-based sources to Supabase may expose schema gaps
- Admin workflow complexity can slow delivery if the first cut is too broad
- Eval dataset quality may lag behind implementation and reduce signal
- UI trust improvements may hide retrieval weaknesses if metrics are not enforced
- Container runtime may expose environment-variable or filesystem assumptions not visible in local dev

## 9) Milestones
- v5.1 Anthropic-inspired design system + top menu redesign
- v5.2 Persistent source model + environment validation
- v5.3 Authenticated admin console + operational actions
- v5.4 Trust UX completion + citation upgrades
- v5.5 Docker runtime + Compose workflow + eval/release gate enforcement

## 10) Locked Acceptance Criteria for v5 Task 1

### AC-UI Anthropic-Inspired UI System
- A shared tokenized design system exists and is applied to landing, content pages, login, and chat surfaces.
- The UI presents an editorial, calm, premium style with clear reading hierarchy and restrained color contrast.
- Core page shells use consistent spacing scale, typography scale, and component surface styles.
- The landing page includes a clear trust-first narrative and a primary chatbot CTA above the fold on desktop.

### AC-NAV Top Navigation
- Top navigation renders all primary destinations with implemented route targets; no dead links are allowed.
- Desktop navigation visibly communicates hover and active states for each primary menu item.
- Mobile navigation supports low-friction reveal/dismiss behavior and preserves clear information hierarchy.
- A persistent CTA entry point to chat or equivalent primary action is visible in both desktop and mobile nav contexts.

### AC-ADMIN Admin Workflow
- `/admin` exists as a real route and enforces authenticated access before privileged actions.
- Admin users can create and edit source records through the shipped UI without direct file editing.
- Admin users can publish/unpublish and trigger reindex operations with explicit confirmation on state-changing actions.
- Admin surfaces expose source health and last ingestion/reindex outcomes for operational visibility.

### AC-DOCKER Docker Runtime
- `docker build .` completes successfully using the repository's `Dockerfile`.
- `docker compose up --build` boots the application with documented required environment variables.
- Container runtime does not depend on editable local source files for core source/retrieval operations.
- Docker workflow and required environment settings are documented in sprint artifacts/release docs.
