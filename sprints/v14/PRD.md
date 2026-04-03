# PRD — Kowa Assistant Admin Inbox + Office Triage (v14)

## 1) Sprint Overview
Sprint v14 brings the website assistant into the existing admin console. Confirmed visitor handoffs can now be listed, assigned, annotated, and moved through office triage states from one internal surface, while source operations remain available in the same admin area.

## 2) Goals
- Expose confirmed assistant handoffs through admin-only APIs.
- Add inbox and detail panels to the existing admin console.
- Allow office users to assign owners, update handoff status, and attach internal notes.
- Add additive schema for assignment metadata and queue notes.
- Publish v14 sprint artifacts and validation evidence.

## 3) User Stories
- As an office user, I want to see all confirmed assistant handoffs in one queue so I can triage them quickly.
- As an office user, I want to assign a handoff and mark it resolved or dismissed so the queue reflects operational reality.
- As an office user, I want to attach internal notes without losing the original visitor transcript context.

## 4) Technical Architecture
- Admin APIs:
  - `GET /api/admin/handoffs`
  - `POST /api/admin/handoffs/:id/status`
  - `POST /api/admin/handoffs/:id/note`
- Runtime layer:
  - assistant queue list/update/note operations in the shared assistant service/store
  - admin request header check aligned to existing local admin auth model
- UI:
  - extend `app/admin/admin-console.tsx` with inbox and detail panels
- Persistence:
  - `supabase/migrations/0006_v14_admin_inbox.sql`

## 5) Out of Scope
- Full Supabase-backed runtime persistence for admin queue mutations.
- Email notifications or CRM sync from the inbox.
- Multi-user office RBAC beyond the current local admin gate model.
- Telegram admin queue filtering.

## 6) Dependencies
- Completed v13 qualification and handoff confirmation flow.
- Existing admin console route and local admin auth model.
- Existing additive queue schema from v13.

## 7) Locked Acceptance Criteria
- Admin console shows confirmed handoffs in an inbox list.
- Admin console can update status, save assignee, and add notes for a selected handoff.
- Admin queue APIs reject requests without the admin header.
- The additive migration adds assignment metadata and `admin_handoff_notes` without destructive edits.
- Build, lint, v14 unit tests, and targeted v14 Playwright coverage pass.
