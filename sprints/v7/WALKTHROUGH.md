# v7 Walkthrough

## Overview
Sprint v7 delivers a major Kowa website revision: premium editorial redesign, dedicated `NEWS` and `PRODUCTS` routes, multilingual UI (EN/JP/中文), icon-based commerce controls, merchant-style popup chatbot UX, featured landing video, required footer, and legacy-fact copy alignment.

## What changed
- Navigation now uses dedicated routes: `ABOUT` (`/`), `NEWS` (`/news`), `PRODUCTS` (`/products`).
- Header includes a reusable elegant Kowa logo mark + wordmark.
- Login and online shopping controls are icon-only actions.
- Main landing is ABOUT-focused with a featured YouTube video section.
- NEWS and PRODUCTS content is fully moved to dedicated pages.
- Aya chat opens as compact popup UI (dark intro + light input row) and remains viewport-safe.
- Footer is present across home/news/products and uses legacy-aligned corporate facts.

## Validation summary (Task 14)
### Build validation
- Command: `npm run build`
- Result: pass (Next.js build + TypeScript checks completed; static generation for `/`, `/news`, `/products` succeeded)

### Targeted UI regression checks
- Command:
  - `npx playwright test tests/e2e/v7-task3-nav-routing.spec.ts tests/e2e/v7-task7-icon-controls.spec.ts tests/e2e/v7-task10-chat-popup-compact.spec.ts tests/e2e/v7-task11-featured-video.spec.ts tests/e2e/v7-task12-footer-required.spec.ts tests/e2e/v7-task13-copy-alignment.spec.ts --config playwright.v7.config.ts`
- Result: pass (`6 passed`)
- Coverage:
  - routing (`/`, `/news`, `/products`)
  - icon controls (login + external shopping)
  - popup chat compact UX + viewport constraints
  - featured video embed + responsive behavior
  - required footer visibility/readability
  - legacy normalized content alignment

### Security checks
- Command: `npx semgrep --config auto app/ lib/ --quiet`
- Result: pass (no findings)
- Command: `npm audit --omit=dev`
- Result: pass (`0 vulnerabilities`)

## Key files for v7 behavior
- `app/page.tsx`
- `app/news/page.tsx`
- `app/products/page.tsx`
- `components/top-menu.tsx`
- `components/kowa-logo.tsx`
- `components/chat-popup.tsx`
- `components/chat-widget.tsx`
- `lib/site-copy.ts`
- `app/globals.css`

## E2E artifacts for Task 14 evidence
- `tests/screenshots/task3-step1-v7-home-route.png`
- `tests/screenshots/task3-step2-v7-news-route.png`
- `tests/screenshots/task3-step3-v7-products-route.png`
- `tests/screenshots/task7-step1-v7-icon-controls.png`
- `tests/screenshots/task10-step1-v7-popup-desktop.png`
- `tests/screenshots/task10-step2-v7-popup-mobile.png`
- `tests/screenshots/task11-step1-v7-video-desktop.png`
- `tests/screenshots/task11-step2-v7-video-mobile.png`
- `tests/screenshots/task12-step1-v7-footer-home.png`
- `tests/screenshots/task12-step2-v7-footer-news.png`
- `tests/screenshots/task12-step3-v7-footer-mobile.png`
- `tests/screenshots/task13-step1-v7-legacy-alignment.png`

## Note
- Regression coverage now reflects post-Task-13 legacy-aligned footer copy (`KOWA TRADE AND COMMERCE CO.,LTD.`), and tests were updated accordingly.
