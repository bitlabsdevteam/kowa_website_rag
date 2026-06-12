# Sprint v18 — Tasks

## Status: In Progress

- [x] Task 1: Switch scroll progress from hero-scoped to whole-document (P0)
  - Acceptance: `use-scroll-progress.ts` gains a document mode (no target element) returning normalized 0–1 progress across the full page scroll height; existing element mode and reduced-motion guard untouched; new unit tests pass alongside the v17 ones
  - Files: components/hero-3d/use-scroll-progress.ts, tests/unit/v18-task1-document-progress.test.mjs
  - Completed: 2026-06-12 — Added pure computeDocumentScrollProgress (scrollY / (scrollHeight − viewportHeight), clamped, degenerate-safe) and made targetRef optional on useScrollProgress: omitted → document mode measuring window.scrollY/document scrollHeight/innerHeight. Element mode, rAF throttle, passive listeners, and reduced-motion guard unchanged. TDD: 3 new unit tests failed first, now 16/16 pass (incl. all v17). Build, lint, semgrep, npm audit clean.

- [ ] Task 2: Promote the 3D scene to a fixed full-viewport page backdrop (P0)
  - Acceptance: `Hero3DScene`/`HeroFallback` render inside a `position: fixed; inset: 0; z-index: 0` `.page-backdrop` div mounted once in `app/page.tsx`; no rounded corners, borders, or panel box around the canvas; canvas covers the viewport at any scroll position; e2e spec asserts backdrop bounding box equals viewport
  - Files: app/page.tsx, app/globals.css, tests/e2e/v18-task2-fullpage-backdrop.spec.ts

- [ ] Task 3: Restyle the hero as a boxless full-viewport copy layer (P0)
  - Acceptance: Hero section is 100svh of copy + CTAs directly over the backdrop (no `hero-panel` card background); `--hero-parallax` foreground/mid drift still works from document progress; locale switching still works
  - Files: app/page.tsx, app/globals.css

- [ ] Task 4: Re-theme below-hero sections onto the dark backdrop (P0)
  - Acceptance: All landing sections below the hero (stats, narrative, CTA/links) sit on translucent glass surfaces over the fixed scene — no opaque light page background anywhere on the landing route; text meets contrast against the dark backdrop
  - Files: app/page.tsx, app/globals.css

- [ ] Task 5: Extend the camera rig to travel across the full page scroll (P0)
  - Acceptance: `computeCameraTarget` (or a v18 variant) maps 0–1 document progress to a longer dolly/tilt path so the scene visibly evolves from top to bottom of the page; eased via the existing `MathUtils.damp` rig; unit tests for the new mapping pass
  - Files: components/hero-3d/camera-rig-math.ts, components/hero-3d/hero-3d-scene.tsx, tests/unit/v18-task5-camera-path.test.mjs

- [ ] Task 6: Create `useScrollReveal` hook + reveal CSS variants (P0)
  - Acceptance: IntersectionObserver-based hook sets `data-revealed="true"` once when an element enters the viewport; CSS classes `reveal-fade-up`, `reveal-fly-left`, `reveal-fly-right` transition opacity/transform; with `prefers-reduced-motion` elements are visible immediately (no transition); unit test covers the observer wiring
  - Files: components/hero-3d/use-scroll-reveal.ts, app/globals.css, tests/unit/v18-task6-scroll-reveal.test.mjs

- [ ] Task 7: Apply reveal choreography to landing sections (P1)
  - Acceptance: Scrolling down reveals each section — headlines fade up, paired cards/columns fly in from left and right and meet at center; e2e spec asserts `data-revealed` flips after scroll and elements end at their resting transform
  - Files: app/page.tsx, tests/e2e/v18-task7-scroll-reveal.spec.ts

- [ ] Task 8: Typography refresh — Fraunces display + Space Grotesk body (P1)
  - Acceptance: Headlines use Fraunces (via `next/font/google`, `--font-display`), body/UI uses Space Grotesk replacing Manrope, Noto Sans JP retained for `ja` locale; type scale tuned (oversized hero headline, tightened tracking); no FOUT regressions; build passes
  - Files: app/layout.tsx, app/globals.css

- [ ] Task 9: Update affected v17/legacy e2e specs and run full validation (P1)
  - Acceptance: Specs encoding the boxed hero (hero-panel bounding, hero-scoped progress, fallback/mobile/parallax-layer specs) updated to the v18 full-page contract; `npm run build`, `npm run lint`, all unit tests, and the full landing Playwright suite pass; semgrep and npm audit clean
  - Files: tests/e2e/v17-*.spec.ts (as needed), tests/e2e/v5/v6/v7 landing specs (as needed)

- [ ] Task 10: Polish — mobile, contrast, and motion accessibility pass (P2)
  - Acceptance: At 375px width no horizontal overflow and reveal fly-in distances are reduced; canvas DPR cap (≤2) and `aria-hidden` preserved; reduced-motion run shows all content without animation over the static fallback; screenshots captured for desktop + mobile
  - Files: app/globals.css, tests/e2e/v18-task10-polish.spec.ts
