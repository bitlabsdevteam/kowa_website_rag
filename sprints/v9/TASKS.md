# Tasks — v9

- [x] Task 1: Baseline v9 scope and deployment context inventory (P0)
  - Acceptance: v9 planning references key runtime files, static asset paths, and footer/hero target files.
  - Files: `sprints/v9/PRD.md`, `sprints/v9/TASKS.md`, `sprints/v9/artifacts/`
  - Completed: 2026-04-01 - Added baseline inventory artifact and unit check for runtime/static/hero/footer references.

- [x] Task 2: Create product media inventory from local `images/` folder (P0)
  - Acceptance: Artifact lists each image asset, normalized display name, and suggested grouping/caption metadata.
  - Files: `sprints/v9/artifacts/product-media-inventory.md`
  - Completed: 2026-04-01 - Added full 13-file inventory with normalized names, grouping model, and caption strategy; covered by unit test.

- [x] Task 3: Ensure Docker runner copies `public/` static assets (P0)
  - Acceptance: `Dockerfile` runner stage includes copy step for `public/`; static asset path is available at runtime.
  - Files: `Dockerfile`
  - Completed: 2026-04-01 - Verified and test-locked Docker runtime copy step for `public/` static assets.

- [x] Task 4: Add v9 artifact documenting hero visual source and blend strategy (P0)
  - Acceptance: Artifact captures asset file path, intended placement, and blend constraints for desktop/mobile.
  - Files: `sprints/v9/artifacts/hero-visual-integration.md`
  - Completed: 2026-04-01 - Added hero visual integration artifact and unit test coverage for source, placement, and blend constraints.

- [x] Task 5: Harden homepage hero image slot next to `Kowa Trade & Commerce` (P0)
  - Acceptance: Hero visual renders beside title/content on desktop and stacks responsively on mobile.
  - Files: `app/page.tsx`, `app/globals.css`
  - Completed: 2026-04-01 - Added desktop/mobile Playwright coverage and screenshot evidence for hero image slot layout behavior.

- [x] Task 6: Implement visual blending polish for hero image (P0)
  - Acceptance: Image appears background-free/blended (no harsh white rectangle), with responsive containment.
  - Files: `app/globals.css`, `public/images/` (asset if adjusted)
  - Completed: 2026-04-01 - Added Playwright blend-style validation (transparent container + multiply blend mode) with screenshot evidence.

- [x] Task 7: Standardize footer bar component contract and locale labels (P0)
  - Acceptance: Footer copy model and component props are consistent across locales and routes.
  - Files: `components/site-footer-bar.tsx`, `lib/site-copy.ts`
  - Completed: 2026-04-01 - Added unit contract check for locale footer labels and removed legacy `note/rights` fields.

- [x] Task 8: Remove legacy homepage footer fact block remnants (P0)
  - Acceptance: Homepage no longer renders `Established / Address / Main line` block.
  - Files: `app/page.tsx`
  - Completed: 2026-04-01 - Added Playwright regression check confirming homepage footer has no legacy fact block labels.

- [x] Task 9: Remove extra bottom divider line on homepage footer area (P0)
  - Acceptance: Main landing page bottom does not display duplicate horizontal lines; footer divider appears only once.
  - Files: `app/globals.css`, `app/page.tsx`
  - Completed: 2026-04-01 - Removed `site-footer` top border so only footer-bar divider remains; verified with Playwright style assertions.

- [x] Task 10: Build product image manifest and static serving path for `/products` gallery (P0)
  - Acceptance: Local assets from `images/` are mapped into app-consumable static URLs with typed metadata.
  - Files: `lib/` (new manifest/helper), `public/images/` (copied/linked assets), `app/products/page.tsx`
  - Completed: 2026-04-01 - Added typed product media manifest, copied 13 source images to web-safe static paths, and rendered manifest-backed media grid on `/products`.

- [x] Task 11: Implement premium 2026-style products carousel UI (P0)
  - Acceptance: `/products` renders an elegant interactive carousel with active-slide focus, smooth transitions, and touch-friendly behavior.
  - Files: `app/products/page.tsx`, `components/` (new gallery/carousel), `app/globals.css`
  - Completed: 2026-04-01 - Added reusable `ProductCarousel` with active-slide focus, smooth animated track transitions, next/prev controls, and touch-swipe handling.

- [x] Task 12: Add products paging model and controls (P0)
  - Acceptance: Users can move through product sets via paging controls and see current position (`x / y`, dots, or progress segments).
  - Files: `app/products/page.tsx`, `components/`, `app/globals.css`
  - Completed: 2026-04-01 - Added `x / y` position indicator, per-slide paging buttons with `aria-current`, and test-backed paging state updates.

- [x] Task 13: Apply footer bar consistently across key route pages (P1)
  - Acceptance: `/`, `/news`, `/products`, `/company_profile` all use `SiteFooterBar`.
  - Files: `app/page.tsx`, `app/news/page.tsx`, `app/products/page.tsx`, `app/company_profile/page.tsx`
  - Completed: 2026-04-01 - Added unit coverage asserting all target route pages import and render `SiteFooterBar`.

- [x] Task 14: Add E2E coverage for hero visual render and responsive placement (P1)
  - Acceptance: Playwright confirms hero visual visibility on desktop/mobile and captures screenshots.
  - Files: `tests/e2e/` (new v9 spec), `tests/screenshots/`
  - Completed: 2026-04-01 - Added dedicated desktop/mobile Playwright hero-visual spec with responsive placement assertion and screenshot artifacts.

- [x] Task 15: Add E2E coverage for footer standard and no-Shopify text (P1)
  - Acceptance: Playwright validates footer structure and asserts absence of `Powered by Shopify`.
  - Files: `tests/e2e/` (new v9 spec), `tests/screenshots/`
  - Completed: 2026-04-01 - Added route-wide Playwright coverage for footer structure on `/`, `/news`, `/products`, and `/company_profile`, including explicit no-Shopify assertion and screenshot evidence.

- [x] Task 16: Add E2E coverage for homepage legacy fact-block removal (P1)
  - Acceptance: Playwright asserts no homepage block containing `Established`, `Address`, `Main line` labels in legacy footer section.
  - Files: `tests/e2e/` (new v9 spec), `tests/screenshots/`
  - Completed: 2026-04-01 - Added dedicated homepage Playwright regression spec asserting legacy fact labels and `.footer-facts` block are absent, with screenshot evidence.

- [ ] Task 17: Add E2E coverage for homepage extra-divider removal (P1)
  - Acceptance: Playwright asserts homepage footer area renders without duplicate bottom horizontal lines.
  - Files: `tests/e2e/` (new v9 spec), `tests/screenshots/`

- [ ] Task 18: Add E2E coverage for products carousel + paging behavior (P1)
  - Acceptance: Playwright validates carousel navigation, active-page indicator updates, and mobile swipe/next behavior.
  - Files: `tests/e2e/` (new v9 spec), `tests/screenshots/`

- [ ] Task 19: Validate build/lint/v9 regressions + security and publish walkthrough (P2)
  - Acceptance: `npm run build`, `npm run lint`, targeted v9 E2E, `semgrep`, and `npm audit --omit=dev` pass; walkthrough is published.
  - Files: `sprints/v9/WALKTHROUGH.md`
