# Tasks — v7

- [x] Task 1: Baseline and branch-safe setup for v7 homepage work (P0)
  - Acceptance: Current branch state is recorded, existing homepage renders, and implementation file targets are confirmed.
  - Files: `app/page.tsx`, `components/top-menu.tsx`, `components/chat-popup.tsx`, `app/globals.css`
  - Completed: 2026-04-01 — Captured branch working-tree status, added v7 baseline Playwright check with screenshots, and verified homepage render + popup entry.

- [x] Task 2: Replace top navigation labels with `ABOUT`, `NEWS`, and `PRODUCTS` (P0)
  - Acceptance: Header nav contains exactly these three content links and no legacy nav labels.
  - Files: `components/top-menu.tsx`
  - Completed: 2026-04-01 — Added and passed Playwright nav-label regression with screenshots; verified legacy labels are absent in main navigation.

- [x] Task 3: Route top navigation to dedicated pages for news/products (P0)
  - Acceptance: `ABOUT` goes to `/`, `NEWS` goes to `/news`, and `PRODUCTS` goes to `/products`.
  - Files: `components/top-menu.tsx`, `app/news/page.tsx`, `app/products/page.tsx`
  - Completed: 2026-04-01 — Added and passed route-level Playwright test confirming nav href targets and successful navigation to `/news` and `/products` content pages.

- [x] Task 4: Add elegant reusable Kowa logo component (P0)
  - Acceptance: Header renders new custom mark + wordmark component and style is responsive.
  - Files: `components/kowa-logo.tsx`, `app/globals.css`, `components/top-menu.tsx`
  - Completed: 2026-04-01 — Added and passed Playwright logo-component regression validating mark + wordmark visibility and mobile responsive behavior.

- [x] Task 5: Add language selector with EN default, JP, and Mandarin options (P0)
  - Acceptance: Locale selector is visible in header; default locale is EN.
  - Files: `components/top-menu.tsx`, `app/page.tsx`, `app/news/page.tsx`, `app/products/page.tsx`
  - Completed: 2026-04-01 — Added and passed Playwright locale-selector regression confirming visibility, EN default, and EN/JP/中文 options on home/news/products routes.

- [x] Task 6: Implement shared localized copy dictionaries for hero/news/products/footer (P0)
  - Acceptance: Homepage, news page, and products page switch correctly for `en`, `ja`, and `zh`.
  - Files: `lib/site-copy.ts`, `app/page.tsx`, `app/news/page.tsx`, `app/products/page.tsx`
  - Completed: 2026-04-01 — Added and passed Playwright localized-copy regression verifying EN/JA/ZH content switching on home, news, and products surfaces.

- [x] Task 7: Convert login and online shopping controls to icon buttons (P0)
  - Acceptance: Login and shopping are icon-only controls; `Online Shopping` opens external shop in a new tab.
  - Files: `components/top-menu.tsx`, `app/globals.css`
  - Completed: 2026-04-01 — Added and passed Playwright icon-control regression validating icon-only login/shopping controls and external shop target behavior.

- [x] Task 8: Keep main landing focused on ABOUT content only (P0)
  - Acceptance: Main landing does not render full NEWS or PRODUCTS content blocks.
  - Files: `app/page.tsx`, `app/globals.css`
  - Completed: 2026-04-01 — Added and passed Playwright about-only regression confirming homepage excludes full NEWS/PRODUCTS blocks while dedicated routes remain active.

- [x] Task 9: Add dedicated news and products pages (P0)
  - Acceptance: NEWS content is rendered under `/news`; PRODUCTS content is rendered under `/products`.
  - Files: `app/news/page.tsx`, `app/products/page.tsx`, `app/globals.css`
  - Completed: 2026-04-01 — Added and passed Playwright dedicated-page regression validating NEWS and PRODUCTS route content visibility and representative localized entries.

- [x] Task 10: Enforce popup chatbot presentation and merchant-style compact layout (P0)
  - Acceptance: Clicking `Talk to Aya` opens compact popup chat UI matching the visual pattern (dark intro + light input row), without viewport overflow on mobile/desktop.
  - Files: `components/chat-popup.tsx`, `app/globals.css`
  - Completed: 2026-04-01 — Added and passed Playwright popup-style regression confirming compact merchant layout, no extra Open/Close controls, and viewport-safe desktop/mobile sizing.

- [x] Task 11: Add featured video section to the main landing page (P1)
  - Acceptance: Main landing includes a responsive embedded YouTube/video section.
  - Files: `app/page.tsx`, `app/globals.css`
  - Completed: 2026-04-01 — Added and passed Playwright featured-video regression validating embed visibility, expected YouTube source/title, and responsive desktop/mobile sizing.

- [x] Task 12: Add required footer with corporate note and rights text (P1)
  - Acceptance: Footer appears on homepage and remains readable across breakpoints.
  - Files: `app/page.tsx`, `app/news/page.tsx`, `app/products/page.tsx`, `app/globals.css`
  - Completed: 2026-04-01 — Added and passed Playwright footer regression confirming visibility/readability on home, news, and products, including mobile viewport fit.

- [x] Task 13: Align marketing copy to legacy business facts and normalized profile context (P1)
  - Acceptance: Home/news/products business statements match approved Kowa business scope; no contradictory service claims.
  - Files: `lib/site-copy.ts`, `sprints/v7/PRD.md`
  - Completed: 2026-04-01 — Added failing/green Playwright legacy-alignment regression, then updated footer company/address copy to match normalized legacy profile facts across locales.

- [x] Task 14: Validate build and capture UI regression checks for v7 acceptance criteria (P1)
  - Acceptance: `npm run build` passes and targeted UI checks (routing/icons/popup/video/footer) are documented.
  - Files: `tests/e2e/` (new or updated specs), `sprints/v7/WALKTHROUGH.md`
  - Completed: 2026-04-01 — Build passed, targeted v7 regression pack passed (6 tests), footer regression expectation aligned with legacy-normalized copy, and full evidence documented in `sprints/v7/WALKTHROUGH.md`.

- [x] Task 15: Optional polish pass for typography, spacing, and section rhythm (P2)
  - Acceptance: Final UI polish keeps readability and performance while preserving v7 feature behavior.
  - Files: `app/globals.css`, `app/page.tsx`, `app/news/page.tsx`, `app/products/page.tsx`
  - Completed: 2026-04-01 — Added failing/green Playwright polish regression and applied CSS rhythm improvements (page/section spacing, heading readability, footer cadence) with feature behavior preserved.
