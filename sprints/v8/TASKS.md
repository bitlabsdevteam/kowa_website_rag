# Tasks — v8

- [x] Task 1: Baseline and source-ingestion setup for v8 scope (P0)
  - Acceptance: Target files and PDF source files are enumerated; v8 artifact path for source mapping is created.
  - Files: `sprints/v8/PRD.md`, `sprints/v8/TASKS.md`, `sprints/v8/artifacts/`
  - Completed: 2026-04-01 - Added baseline inventory artifact and a unit existence-check test for v8 planning/source inputs.

- [x] Task 2: Curate PDF-derived business statements into a traceable artifact (P0)
  - Acceptance: A new artifact records business claims for homepage/profile plus source mapping and extraction limitations (if any).
  - Files: `sprints/v8/artifacts/pdf-company-profile-business.md`
  - Completed: 2026-04-01 - Added explicit claim-to-source matrix and test-backed traceability checks.

- [x] Task 3: Add `Company profile` menu entry to top navigation (P0)
  - Acceptance: Header shows `Company profile`; click navigates to `/company_profile`.
  - Files: `components/top-menu.tsx`
  - Completed: 2026-04-01 - Added Playwright routing coverage with screenshots and validated nav behavior on a fresh server.

- [x] Task 4: Add `/company_profile` route scaffold (P0)
  - Acceptance: Route exists and renders correctly on desktop/mobile.
  - Files: `app/company_profile/page.tsx`
  - Completed: 2026-04-01 - Added desktop/mobile Playwright coverage with screenshot evidence for direct `/company_profile` rendering.

- [x] Task 5: Implement structured company profile content on `/company_profile` (P0)
  - Acceptance: Page includes overview, business domains, and operational/context section based on curated profile artifact.
  - Files: `app/company_profile/page.tsx`, `lib/site-copy.ts`
  - Completed: 2026-04-01 - Added Playwright validation for structured section headings/content and captured screenshot evidence.

- [x] Task 6: Add homepage section `WHAT IS KOWA'S BUSINESS?` under hero narrative (P0)
  - Acceptance: Section is placed under hero narrative and above lower-page blocks, with clear heading copy.
  - Files: `app/page.tsx`
  - Completed: 2026-04-01 - Added E2E placement assertions (narrative -> business section -> footer) and screenshot evidence.

- [x] Task 7: Implement premium visual treatment for business section (P0)
  - Acceptance: Business section uses intuitive visual structure (for example pillars + flowline), responsive across breakpoints.
  - Files: `app/page.tsx`, `app/globals.css`
  - Completed: 2026-04-01 - Added desktop/mobile Playwright assertions for card-grid + flow layout behavior with screenshot artifacts.

- [x] Task 8: Preserve prior v8 quick fixes (hero/video/footer/chat behavior) while integrating new section (P0)
  - Acceptance: Hero eyebrow remains removed, featured video stays in hero flow, footer fact group remains, chat popup close (`×`) still works.
  - Files: `app/page.tsx`, `components/chat-popup.tsx`, `app/globals.css`
  - Completed: 2026-04-01 - Added continuity regression test covering eyebrow removal, video-vs-footer ordering, footer facts, and popup close behavior.

- [x] Task 9: Keep content-route separation for `/news` and `/products` (P1)
  - Acceptance: News and products content do not leak into homepage after new section integration.
  - Files: `app/page.tsx`, `app/news/page.tsx`, `app/products/page.tsx`
  - Completed: 2026-04-01 - Added E2E route-separation checks across `/`, `/news`, and `/products` with screenshot evidence.

- [x] Task 10: Add E2E coverage for new navigation and company profile route (P1)
  - Acceptance: Playwright validates `Company profile` nav visibility and successful routing to `/company_profile`.
  - Files: `tests/e2e/` (new/updated spec), `tests/screenshots/`
  - Completed: 2026-04-01 - Added dedicated desktop/mobile Playwright spec with three screenshot checkpoints.

- [x] Task 11: Add E2E coverage for homepage business section placement and popup close continuity (P1)
  - Acceptance: Tests verify business section appears under hero and popup close still dismisses chat.
  - Files: `tests/e2e/` (new/updated spec), `tests/screenshots/`
  - Completed: 2026-04-01 - Added dedicated desktop/mobile Playwright assertions for section ordering and popup close continuity with screenshots.

- [x] Task 12: Validate build + lint + targeted regressions and publish walkthrough (P2)
  - Acceptance: `npm run build`, `npm run lint`, and targeted E2E pass; `sprints/v8/WALKTHROUGH.md` documents evidence and residual risks.
  - Files: `sprints/v8/WALKTHROUGH.md`
  - Completed: 2026-04-01 - Ran build/lint/v8 test suite/security checks and published walkthrough with command evidence.
