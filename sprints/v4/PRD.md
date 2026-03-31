# PRD — Kowa Website + RAG (v4)

## 1) Sprint Goal
Ship a near-production release focused on trust, usability, and operational control for the Kowa migrated website and landing-page RAG assistant.

## 2) Why v4
v3 established premium direction and ops baseline. v4 closes the loop on production readiness: better user trust UX, stronger admin workflows, and measurable retrieval quality.

## 3) Objectives
- Raise trust quality of answers and citations.
- Improve landing-page conversion and chatbot onboarding.
- Make admin operations fast, auditable, and safe.
- Formalize release checks for repeatable deployments.

## 4) Scope (In)

### V4-R1 Trust-First Chat Experience
- Grounding status indicator per answer (grounded/partial/none)
- Clear citation cards with source metadata + direct links
- Better no-answer handling and recovery suggestions

### V4-R2 Conversion-Grade Landing UX
- Refined hero narrative and CTA hierarchy
- Structured sections: value, trust, capabilities, contact
- Better first-prompt onboarding for chatbot
- Best-in-class top menu redesign (inspired by top company navigation systems)

### V4-R2.1 Mandatory Legacy Menu Crawl/Migration
- Crawl and scrape all content reachable from old website menu entries
- Ensure each old menu item has mapped destination in new IA
- Preserve key content fidelity while rewriting layout for modern UX
- Provide migration parity checklist proving old-menu coverage

### V4-R2.2 Top Menu Design Benchmark Requirements
- Benchmark and adapt elegant top-menu patterns from leading sites (e.g., Stripe, Notion, Intercom style principles)
- Requirements:
  - clean horizontal nav with clear hierarchy
  - compact, credible trust-first visual language
  - predictable hover/active states
  - responsive mobile menu with low friction
  - persistent CTA for chatbot entry

### V4-R3 Admin Reliability Controls
- Admin actions: publish/unpublish/reindex with confirmations
- Source health checks and last-ingestion visibility
- Guarded destructive actions with explicit confirmation

### V4-R4 Retrieval Evaluation Pack
- Golden-query set for regression checks
- Quality scoring output (hit/miss/citation-valid)
- Track unanswered question clusters for source expansion

### V4-R5 Release Process
- E2E suite expanded and mandatory before push
- Release checklist and smoke-test playbook
- Versioned sprint walkthrough

## 5) Out of Scope
- Full enterprise RBAC matrix
- Multi-region disaster recovery
- Advanced analytics warehouse

## 6) Success Metrics
- >92% grounded-response rate on in-scope golden queries
- <1.5% citation link/render failures
- >95% successful admin operations without manual DB patching
- Improved landing interaction-to-chat-start conversion

## 7) Technical Direction
- Next.js + TypeScript
- LangGraph/LangChain orchestration
- Supabase Postgres + pgvector
- Playwright E2E as release gate

## 8) Risks
- UX over-polish delaying core reliability work
- Retrieval quality variance from noisy legacy text
- Admin actions causing accidental source regressions

## 9) Milestones
- v4.1 Trust UX + citation quality pass
- v4.2 Landing conversion polish
- v4.3 Admin reliability controls
- v4.4 Eval pack + release gate hardening
