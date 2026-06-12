# Sprint v17 — Tasks

## Status: In Progress

- [x] Task 1: Install 3D dependencies and verify build baseline (P0)
  - Acceptance: `npm install three @react-three/fiber @react-three/drei @types/three` succeeds; `npm run build` and `npm run lint` pass with no new errors
  - Files: package.json, package-lock.json
  - Completed: 2026-06-12 — Installed three@0.184, @react-three/fiber@9.6, @react-three/drei@10.7, @types/three. Also resolved npm audit findings: bumped next to 16.2.9 (high-severity advisories) and added a postcss ^8.5.10 override for next's pinned vulnerable postcss. Build, lint, unit tests (3), semgrep, and npm audit all clean.

- [x] Task 2: Remove the "Talk to Aya" button from the landing page (P0)
  - Acceptance: `ChatPopup` is no longer rendered or imported in `app/page.tsx`; the secondary "View company profile" link remains; `components/chat-popup.tsx` itself is unchanged; build passes
  - Files: app/page.tsx
  - Completed: 2026-06-12 — Removed ChatPopup import and render from the hero; secondary CTA preserved. Added e2e spec v17-task2-remove-aya-cta.spec.ts (TDD: failed before, passes after, with screenshots). Build, lint, semgrep, npm audit clean. Note: legacy spec v5-task3-landing-redesign.spec.ts still clicks landing-primary-cta and will be updated in Task 9.

- [x] Task 3: Remove the YouTube video from the landing page (P0)
  - Acceptance: No `iframe`/`reference-video-frame` markup remains in `app/page.tsx`; hero stat cards are preserved or relocated; build passes
  - Files: app/page.tsx
  - Completed: 2026-06-12 — Removed the reference-video-frame block and YouTube iframe; stat cards kept in the hero media column with data-testid="hero-stat-card". Added e2e spec v17-task3-remove-youtube.spec.ts (TDD: failed before, passes after, with screenshots). Build, lint, semgrep, npm audit clean.

- [x] Task 4: Create `useScrollProgress` hook (P0)
  - Acceptance: Hook returns normalized 0–1 scroll progress for a target element, throttled via `requestAnimationFrame`, and returns 0 when `prefers-reduced-motion` is set; covered by a small unit test
  - Files: components/hero-3d/use-scroll-progress.ts, tests/unit/v17-task4-scroll-progress.test.mjs
  - Completed: 2026-06-12 — Added pure computeScrollProgress (clamped -top/height, degenerate-input safe) plus useScrollProgress hook with rAF throttling, passive scroll/resize listeners, cleanup, and reduced-motion guard. 3 unit tests pass (TDD: failed before implementation). Build, lint, semgrep, npm audit clean.

- [x] Task 5: Build the R3F 3D background scene (P0)
  - Acceptance: `Hero3DScene` renders a full-bleed `<Canvas>` (dynamic import, ssr:false) with a particle field / floating geometry, fog, and lighting in Kowa's palette; runs without console errors in dev
  - Files: components/hero-3d/hero-3d-scene.tsx
  - Completed: 2026-06-12 — Hero3DScene with seeded 900-point particle field, three floating meshes (icosahedron/torus/octahedron), fog and ambient/directional/point lights in brand greens; mounted in the hero media column via next/dynamic ssr:false. E2E spec asserts canvas mounts aria-hidden with zero console errors. Playwright config gained --use-angle=swiftshader to fix headless WebGL context creation. Build, lint, semgrep, npm audit clean.

- [x] Task 6: Add static fallback for reduced-motion / no-WebGL (P0)
  - Acceptance: `HeroFallback` renders a static cinematic gradient backdrop; landing page swaps to it when WebGL is unavailable or `prefers-reduced-motion: reduce` is set
  - Files: components/hero-3d/hero-fallback.tsx, app/page.tsx
  - Completed: 2026-06-12 — Added HeroFallback (layered radial-gradient backdrop in brand greens) and supportsHero3DScene() gate (reduced-motion + WebGL probe). Page defaults to fallback and upgrades to the 3D scene only when supported. 3 e2e tests (reduced-motion, stubbed no-WebGL, capable-browser keeps scene) pass with screenshots; v17 task2/3/5 specs still green. Build, lint, semgrep, npm audit clean.

- [x] Task 7: Compose the cinematic hero with parallax layers (P0)
  - Acceptance: Hero is full-viewport with the 3D scene behind layered foreground copy (existing `SITE_COPY` hero text); scrolling moves background, mid, and foreground layers at distinct rates; locale switching still works
  - Files: app/page.tsx, app/globals.css
  - Completed: 2026-06-12 — Hero restructured into three layers: hero-parallax-background (3D scene/fallback, full-bleed, drifts +130px), hero-parallax-mid (gradient atmosphere veil, +60px), hero-parallax-foreground (copy + stat cards, -48px), driven by useScrollProgress via a --hero-parallax CSS variable. Hero is min-height 100svh with a dark cinematic treatment (ivory copy, glassy stat cards). 3 e2e tests (layer structure/full-viewport, distinct scroll rates, ja locale switch) pass with screenshots; v17 task 2/3/5/6 specs, build, lint, 10 unit tests, semgrep, npm audit all clean.

- [ ] Task 8: Wire scroll progress into the 3D camera rig (P1)
  - Acceptance: Camera/group position in `Hero3DScene` eases with scroll progress so the scene visibly shifts depth while scrolling through the hero; no jank from re-renders (progress passed via ref/useFrame, not state-per-frame)
  - Files: components/hero-3d/hero-3d-scene.tsx, app/page.tsx

- [ ] Task 9: Update affected tests and run full validation (P1)
  - Acceptance: Any existing e2e/unit tests referencing the hero CTA or video are updated; `npm run build`, `npm run lint`, `node --test tests/unit/v17-*.test.mjs`, and the landing-page Playwright specs pass
  - Files: tests/e2e/* (as needed), tests/unit/v17-*.test.mjs

- [ ] Task 10: Polish — mobile sizing, GPU cost, and accessibility pass (P2)
  - Acceptance: Hero renders correctly at 375px width; canvas DPR capped (≤2); decorative canvas is `aria-hidden`; no `@next/next/no-img-element` regressions
  - Files: components/hero-3d/hero-3d-scene.tsx, app/globals.css
