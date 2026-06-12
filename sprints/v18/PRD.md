# Sprint v18 — PRD: Full-Page Cinematic Background & Scroll-Reveal Content

## Overview
Promote the v17 3D/parallax/cinematic treatment from a boxed hero panel to the entire landing-page background: a fixed, full-viewport WebGL scene that sits behind every section as the user scrolls. All landing-page content scrolls over that backdrop, with sections revealing on scroll (fade-in, fly-in from left and right that "combine" at center). Refresh typography and theme to a current editorial-modern direction so the page reads as a premium 2026 site rather than a card-based brochure.

## Problem (from user feedback, 2026-06-12)
The v17 scene renders inside the rounded `hero-panel` box — the 3D, parallax, and cinematic effects are visually confined to a card on a light page. The user wants the scene to BE the page background, edge to edge, for the whole landing experience, with downstream content animating into view as you scroll.

## Goals
- The 3D scene (or its static fallback) is a fixed full-viewport background layer covering the entire landing page — no rounded box, no visible page chrome behind it.
- Every landing-page section below the hero scrolls over the cinematic backdrop on translucent/glass surfaces consistent with the dark theme.
- Sections and cards animate in on scroll: copy fades up, paired elements fly in from left and right and meet ("combine") as the section enters the viewport.
- Typography refreshed to a trend-current pairing: a high-contrast editorial display face for headlines + a clean grotesque for UI/body, with Noto Sans JP preserved for Japanese.
- Reduced-motion users get instant-visible content (no reveal animations) over the static fallback; build, lint, unit, and e2e suites pass.

## User Stories
- As a site visitor, I want the cinematic 3D world to fill my whole screen for the entire page, so the site feels immersive instead of a widget in a box.
- As a visitor scrolling down, I want upcoming content to fade and fly in from the sides, so the page feels choreographed and alive.
- As a visitor reading headlines, I want striking modern typography, so Kowa feels like a contemporary premium brand.
- As a visitor with reduced motion enabled, I want all content visible immediately with a calm static backdrop, so the page stays accessible.

## Technical Architecture
- **Frontend**: Next.js 16 (App Router, existing) + React 19
- **3D**: existing `three` + `@react-three/fiber` + `@react-three/drei` stack (v17) — scene moves from hero-scoped to page-scoped
- **Background promotion**: the `<Canvas>` wrapper becomes `position: fixed; inset: 0; z-index: 0` mounted once at the page level; scroll progress switches from hero-element progress to whole-document progress so the camera rig travels across the full page scroll
- **Scroll reveal**: a small `useScrollReveal` hook built on `IntersectionObserver` toggling a `data-revealed` attribute; CSS-only transitions for `fade-up`, `fly-left`, `fly-right` variants (no animation library)
- **Typography**: `next/font/google` — Fraunces (display headlines, optical sizing) + Space Grotesk (UI/body latin), Noto Sans JP retained for `ja`
- **Fallback**: existing `supportsHero3DScene()` gate reused; `prefers-reduced-motion` also disables reveal transitions (content visible by default, animations are progressive enhancement)

```
app/page.tsx
 ├── <div class="page-backdrop">  (fixed, inset-0, z-0)
 │     └── Hero3DScene | HeroFallback        ← full-document scroll progress
 ├── <main class="page-content"> (relative, z-1)
 │     ├── hero section (full 100svh, copy only — no panel box)
 │     ├── section: stats        ← reveal: fly-left + fly-right combine
 │     ├── section: narrative    ← reveal: fade-up
 │     └── section: CTA / links  ← reveal: fade-up
 └── components/hero-3d/use-scroll-reveal.ts ← IntersectionObserver hook
```

Data flow: document scrollY → normalized 0–1 page progress → (a) camera rig dolly/tilt over the whole page, (b) `--hero-parallax` var for layer drift. IntersectionObserver entries → `data-revealed="true"` → CSS transitions run once per section.

## Out of Scope (v19+)
- 3D treatment on other routes (products, machines, company profile, etc.)
- Mouse-move / gyroscope parallax
- Custom GLTF/branded 3D models
- Light-theme variant of the new dark cinematic theme
- Chat assistant / Aya / Telegram surfaces (v16 work untouched)
- Performance budgets / Lighthouse CI gating

## Dependencies
- v17 components: `hero-3d-scene.tsx`, `hero-fallback.tsx`, `use-scroll-progress.ts`, `camera-rig-math.ts` (extended, not rewritten)
- Existing `SITE_COPY` content in `lib/site-copy.ts` (reused)
- No new npm packages expected (fonts via `next/font/google`; reveal via native IntersectionObserver)
- v17 e2e specs (12) and legacy landing specs (7) — several will need updating since the hero-panel box and hero-scoped progress are removed
