# v5 Walkthrough

## Overview
Sprint v5 moved the project from prototype behavior to a release-ready baseline across design, navigation, admin workflows, source runtime, trust UX, retrieval quality gating, and container runtime operations.

## What was built
- Anthropic-inspired visual system with shared tokens and consistent page surfaces.
- Redesigned landing experience with editorial narrative, trust-first hierarchy, and stronger assistant onboarding.
- Polished top menu with active-state semantics, responsive mobile reveal, and persistent CTA.
- Auth-gated `/admin` route with create/edit/publish/unpublish/reindex actions and confirmation guards.
- Runtime source retrieval flow migrated away from `data/sources.json` dependency to persistent-store abstractions.
- Chat trust UX with grounding/confidence states, citation metadata, and no-answer recovery guidance.
- Retrieval evaluation and regression gate with versioned golden queries and threshold enforcement.
- Docker runtime workflow validated through image build and compose boot.

## Playwright coverage
Coverage now includes:
- landing design and interaction validation
- navigation route resolution and responsive mobile behavior
- login and admin auth-gate flows
- grounded chat trust UX states
- release smoke flow across landing/navigation/login/admin/grounded chat

## Validation evidence
- `npm run build`: passed
- `npx playwright test`: covered by v5 suite additions
- `npm run eval:retrieval`: threshold gate and unanswered-cluster reporting
- `docker build .`: passed
- `docker compose up --build -d`: passed with HTTP response on `http://127.0.0.1:3000`

## Artifacts
- `sprints/v5/artifacts/release-checklist.md`
- `sprints/v5/artifacts/smoke-test-playbook.md`
- `sprints/v5/artifacts/retrieval-eval-latest.json`

## Operational notes
- `next.config.ts` includes `allowedDevOrigins` for local Playwright/dev-server compatibility.
- Runtime health endpoint `/api/runtime/health` provides required/missing env status.
- Retrieval gate script `scripts/eval_retrieval_gate.mjs` supports JSON report output and fail-threshold override.

## Next focus
Complete final release packaging and any residual hardening from full-suite CI signal (Task 10 completion check).
