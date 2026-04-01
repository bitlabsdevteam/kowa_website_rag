# v8 Walkthrough

## Overview
Sprint v8 completed the PDF-driven company-profile expansion and validated the full release path with test and security evidence. The implementation now includes homepage `WHAT IS KOWA'S BUSINESS?` content, a dedicated `Company profile` menu and route, extracted PDF artifacts, and regression-safe popup/footer/video behavior.

## Scope Delivered
- Added PDF extraction pipeline outputs under `sprints/v8/artifacts/pdf-extraction/`.
- Added curated and traceable company business artifact:
  - `sprints/v8/artifacts/pdf-company-profile-business.md`
- Added baseline inventory artifact:
  - `sprints/v8/artifacts/baseline-scope-inventory.md`
- Added `Company profile` menu and page (`/company_profile`) with structured content blocks.
- Added homepage business section under hero narrative with responsive visual treatment.
- Preserved v8 quick-fix behavior (video placement, removed hero eyebrow, footer facts, popup close).

## Validation Evidence

### Build
- Command: `npm run build`
- Result: pass
- Notable output included static generation for `/`, `/news`, `/products`, and `/company_profile`.

### Lint
- Command: `npm run lint`
- Result: pass
- Implementation note:
  - Updated lint setup to modern ESLint flat config for this repo (`eslint.config.mjs`).
  - Updated script to `eslint .` in `package.json`.

### Targeted v8 E2E Regression Suite
- Command: `npx playwright test tests/e2e/v8-task*.spec.ts`
- Result: pass (`14 passed`)
- Covered areas:
  - Company profile nav visibility and routing (desktop/mobile)
  - Company profile route scaffold rendering (desktop/mobile)
  - Structured profile content presence
  - Homepage business section placement and responsive visual treatment
  - Quick-fix continuity (eyebrow removal, video/footer ordering, chat close button)
  - Route separation for `/`, `/news`, `/products`

### Targeted Unit Checks
- Command: `node --test tests/unit/v8-task1-baseline-setup.test.mjs tests/unit/v8-task2-pdf-curation.test.mjs`
- Result: pass (`2 passed`)

### Security
- Command: `npx semgrep --config auto app/ lib/ --quiet`
- Result: pass
- Command: `npm audit --omit=dev`
- Result: pass (`0 vulnerabilities`)

## Test and Artifact Highlights
- E2E specs added:
  - `tests/e2e/v8-task3-company-profile-nav.spec.ts`
  - `tests/e2e/v8-task4-company-profile-route-scaffold.spec.ts`
  - `tests/e2e/v8-task5-company-profile-structured-content.spec.ts`
  - `tests/e2e/v8-task6-home-business-section-placement.spec.ts`
  - `tests/e2e/v8-task7-business-visual-treatment.spec.ts`
  - `tests/e2e/v8-task8-quick-fix-continuity.spec.ts`
  - `tests/e2e/v8-task9-route-separation.spec.ts`
  - `tests/e2e/v8-task10-company-profile-nav-routing.spec.ts`
  - `tests/e2e/v8-task11-business-placement-chat-close.spec.ts`
- Unit specs added:
  - `tests/unit/v8-task1-baseline-setup.test.mjs`
  - `tests/unit/v8-task2-pdf-curation.test.mjs`
- Screenshot artifacts were captured for each task-specific spec under `tests/screenshots/` (task3-task11 naming).

## Key Implementation Files
- `app/page.tsx`
- `app/company_profile/page.tsx`
- `components/top-menu.tsx`
- `lib/site-copy.ts`
- `app/globals.css`
- `sprints/v8/PRD.md`
- `sprints/v8/TASKS.md`
- `sprints/v8/artifacts/pdf-company-profile-business.md`
- `sprints/v8/artifacts/pdf-extraction/manifest.json`

## Completion State
- v8 Task 1 through Task 12 are now complete in `sprints/v8/TASKS.md`.
