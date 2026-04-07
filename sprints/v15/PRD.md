# PRD — Kowa Assistant Hardening + Analytics + Release Readiness (v15)

## 1) Sprint Overview
Sprint v15 hardens the website assistant and admin inbox for safer release. It adds bounded feature flags and request limits, simple funnel analytics, admin metrics visibility, runtime-health exposure of assistant policy, and additive operations schema for future persistence of runtime config and analytics events.

## 2) Goals
- Add bounded message/note validation and per-session request rate limiting for assistant actions.
- Expose assistant flags, limits, and analytics through existing runtime/admin surfaces.
- Add an admin metrics summary so office users can see sessions, turns, handoffs, and rate-limit events.
- Add additive operations schema for runtime config and analytics events.
- Publish v15 walkthrough evidence including security checks.

## 3) User Stories
- As an operator, I want the assistant protected from oversized payloads and burst misuse so the public site is harder to abuse.
- As an office user, I want a lightweight metrics view so I can tell whether the assistant is generating real engagement and handoffs.
- As a release owner, I want runtime health and security evidence documented before treating the assistant/admin flow as release-ready.

## 4) Technical Architecture
- Runtime policy:
  - `lib/runtime-config.ts` exposes assistant flags and limits
  - assistant service/store enforce validation, metrics, and rate limiting
- Public APIs:
  - assistant turn and handoff routes check feature flags and rate limits
- Admin APIs:
  - new assistant metrics endpoint for inbox operators
- UI:
  - admin console KPI strip for assistant metrics
- Persistence:
  - `supabase/migrations/0007_v15_assistant_ops.sql`
  - `public.assistant_runtime_config`
  - `public.assistant_event_analytics`

## 5) Out of Scope
- Persistent distributed rate limiting.
- External analytics/BI warehouse export.
- Full production observability stack integration.
- Replacing the in-memory queue/store runtime with Supabase-backed live mutations.

## 6) Dependencies
- Completed v11-v14 assistant, handoff, and admin inbox work.
- Existing runtime health endpoint and admin console.
- Existing release-checklist pattern from earlier sprints.

## 7) Locked Acceptance Criteria
- Oversized assistant messages and admin notes are rejected.
- Repeated assistant turn requests for the same session eventually hit a rate limit.
- Runtime health includes assistant flags, limits, and analytics summary.
- Admin console shows assistant KPI metrics.
- Security checks (`semgrep`, `npm audit --omit=dev`) pass and are documented in the walkthrough.
