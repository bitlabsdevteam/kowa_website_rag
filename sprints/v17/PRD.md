# Sprint v17 — PRD: Cinematic 3D Parallax Landing Page

## Overview
Rebuild the main landing page (`app/page.tsx`) hero as a cinematic, full-viewport experience with a real-time 3D background and scroll-driven parallax. Remove the "Talk to Aya" chat trigger button and the embedded YouTube video from the landing page so the hero reads as a single immersive scene rather than a split copy/media grid.

## Goals
- "Talk to Aya" button no longer renders on the landing page (chat remains untouched elsewhere in the codebase).
- YouTube iframe and its video frame are removed from the landing page.
- Landing hero is a full-viewport cinematic scene with a WebGL 3D background (React Three Fiber).
- Scrolling produces layered parallax: 3D background, mid-layer atmosphere, and foreground copy move at different rates.
- Page degrades gracefully: `prefers-reduced-motion` and non-WebGL environments get a static styled fallback; build, lint, and existing tests still pass.

## User Stories
- As a site visitor, I want a striking cinematic first impression, so that Kowa feels like a modern, premium global trading company.
- As a visitor scrolling the page, I want depth and motion that responds to my scroll, so the page feels alive rather than a static brochure.
- As a visitor on a low-power device or with reduced-motion enabled, I want a clean static hero, so the page stays fast and accessible.
- As the site owner, I want the chat button and video gone from the landing page, so the hero stays focused on the brand narrative.

## Technical Architecture
- **Frontend**: Next.js 16 (App Router, existing) + React 19
- **3D**: `three` + `@react-three/fiber` (R3F v9 for React 19) + `@react-three/drei` for helpers
- **Parallax**: scroll progress via native `IntersectionObserver`/`scrollY` hook (no extra animation lib); CSS `transform` layers for copy, R3F camera/group offsets for the scene
- **Fallback**: WebGL detection + `prefers-reduced-motion` media query → static gradient/scene poster

```
app/page.tsx (server-light client page)
 ├── components/hero-3d/Hero3DScene.tsx        ← R3F <Canvas>, dynamic import (ssr:false)
 │     ├── scene: floating geometry / particle field, fog, lights
 │     └── camera rig driven by scroll progress
 ├── components/hero-3d/useScrollProgress.ts   ← shared scroll hook
 ├── components/hero-3d/HeroFallback.tsx       ← static cinematic backdrop
 └── foreground copy layers (existing SITE_COPY hero text, parallax via CSS transforms)
```

Data flow: scroll position → normalized progress (0–1) → (a) R3F camera/group via useFrame, (b) CSS custom property on foreground layers.

## Out of Scope (v18+)
- Changes to the chat assistant, Aya popup component, or Telegram adapter (v16 work stays as-is)
- 3D treatment on any other page (products, machines, company profile)
- Custom GLTF/branded 3D models or asset pipeline
- Mouse-move parallax / gyroscope effects
- Performance budgets/lighthouse CI gating

## Dependencies
- v16 assistant core remains untouched; `ChatPopup` component must continue to compile (still imported by other surfaces or kept for reuse).
- New npm packages: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`.
- Existing `SITE_COPY` hero copy in `lib/site-copy.ts` (reused, not rewritten).
