---
name: verify
description: Build/launch/drive recipe for runtime-verifying changes to this Next.js site, incl. the WebGL scenes.
---

# Verifying changes in this repo

## Launch
- `npm run dev` serves `http://127.0.0.1:3000`. Check first — it is often already running (`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/`). Reuse it; don't start a second instance.
- Don't run `npx playwright test` while the dev server is up (see memory: they fight over the Next dev lock). For ad-hoc verification, drive the running dev server with a plain node script instead.

## Drive (ad-hoc Playwright script)
- `require('<repo>/node_modules/@playwright/test')` from a scratch script — the repo has no standalone `playwright` package.
- **WebGL scenes need `chromium.launch({ args: ['--use-angle=swiftshader'] })`** — without it, headless Chromium has no WebGL and the hero/factory sections silently fall back to poster mode (`data-mode="poster"`).
- 3D mount gate is viewport width ≥ 900px + WebGL + no reduced-motion (`supportsHero3DScene`). Use a ≥900px viewport for scene mode; a <900px viewport is the easy way to verify the poster/fallback path.

## Useful hooks
- Factory diorama (`[data-testid="home-factory-scene"]`): scroll inside its 320vh track; the eased film progress is surfaced on the canvas as `data-factory-progress` (converges after ~2s of damp easing — wait or poll before screenshotting).
- Scroll math: `window.scrollTo(0, trackTop + frac * (track.offsetHeight - innerHeight))` lands near film progress `frac`.
