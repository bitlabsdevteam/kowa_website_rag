# PRD — Kowa Website + RAG (v6)

## 1) Sprint Overview
Sprint v6 simplifies the public-facing experience to reduce navigation noise and tighten the landing narrative. The top menu is reduced to three actions only, and the landing page is collapsed into a single primary content box that combines the core Kowa overview with a clear entry to the assistant.

## 2) Goals
- Reduce top navigation to exactly `Overview`, `Business`, and `Talk to Aya`.
- Ensure removed menu items are no longer visible in desktop or mobile navigation.
- Redesign the landing surface to a single primary box containing Kowa overview content.
- Preserve responsive behavior and visual quality on desktop and mobile.
- Keep `Talk to Aya` as the primary CTA path into the chatbot section.

## 3) User Stories
- As a first-time visitor, I want a minimal top menu, so that I can understand where to start quickly.
- As a business user, I want a single clear overview panel, so that I can scan Kowa context without reading multiple cards.
- As a prospect, I want a direct `Talk to Aya` action, so that I can begin grounded Q&A immediately.

## 4) Technical Architecture
- Frontend: Next.js App Router + TypeScript.
- UI composition:
  - `components/top-menu.tsx` for desktop/mobile nav link set.
  - `app/page.tsx` for landing structure and single-box content.
  - `app/globals.css` for layout token/style adjustments.
- Validation:
  - Playwright E2E for menu visibility, route behavior, and single-box landing assertions.

### Component Diagram
```text
[Browser]
   |
   v
[Next.js App Router]
   |-- app/page.tsx ------------------------------.
   |                                              |
   |-- components/top-menu.tsx                    |
   |                                              v
   '-- app/globals.css ------------------> [Single Landing Box UI]
                                                |
                                                v
                                         [Chat Widget Entry (Talk to Aya)]
```

### Data / Interaction Flow
```text
User opens /
  -> TopMenu renders only: Overview | Business | Talk to Aya
  -> Landing renders one primary overview box
  -> User clicks Talk to Aya
  -> Browser scrolls/jumps to assistant section
```

## 5) Out of Scope
- Admin workflow redesign.
- Retrieval/RAG pipeline logic changes.
- Supabase schema or migration changes.
- Docker/runtime infrastructure updates.
- Additional marketing sections beyond the single-box landing requirement.

## 6) Dependencies
- Existing v5 frontend foundation and shared styles.
- Existing chat widget anchor/section support on home page.
- Existing Playwright test harness.

## 7) Locked Acceptance Criteria for v6 Task 1

### AC-NAV Minimal Top Menu
- Top navigation shows exactly three items: `Overview`, `Business`, and `Talk to Aya`.
- Removed links from prior sprint navigation are absent from both desktop and mobile menu variants.
- `Overview` resolves to `/`, `Business` resolves to `/business`, and `Talk to Aya` targets assistant entry on `/`.

### AC-LANDING Single Primary Box
- Landing page main content is consolidated into one primary box surface for Kowa overview narrative.
- The primary box includes `Kowa Trade & Commerce` identity and overview copy aligned to legacy business context.
- No secondary marketing boxes remain in the main landing content area.

### AC-CTA Talk to Aya Entry
- `Talk to Aya` is visible as a primary CTA path in top navigation and/or landing primary box.
- CTA interaction consistently reaches the assistant section on desktop and mobile breakpoints.
