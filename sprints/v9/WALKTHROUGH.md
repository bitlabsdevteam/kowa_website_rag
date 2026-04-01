# v9 Walkthrough

## Overview
Sprint v9 finalized release hardening for the Kowa website by validating static-asset reliability, homepage visual/footers regressions, and premium products carousel behavior. The sprint also added route-level and homepage-level regression tests to lock in footer and legacy-content cleanup.

## Scope Delivered
- Hero visual integration and blend behavior are covered by dedicated responsive E2E checks.
- Footer standard is verified across `/`, `/news`, `/products`, and `/company_profile`, including explicit exclusion of `Powered by Shopify`.
- Homepage legacy fact block (`Established`, `Address`, `Main line`) removal is locked by dedicated E2E coverage.
- Homepage duplicate-divider cleanup is locked by dedicated E2E coverage.
- Products carousel and paging behaviors are covered for desktop and mobile interactions.

## Validation Evidence

### Build
- Command: `npm run build`
- Result: pass
- Notes: Next.js production build completed and generated static pages for key routes, including `/`, `/news`, `/products`, and `/company_profile`.

### Lint
- Command: `npm run lint`
- Result: pass (warnings only)
- Warnings:
  - `@next/next/no-img-element` in `app/page.tsx`
  - `@next/next/no-img-element` in `components/product-carousel.tsx`

### Targeted v9 E2E
- Command: `npx playwright test tests/e2e/v9-task*.spec.ts`
- Result: pass (`17 passed`)
- Coverage includes:
  - Hero image slot responsiveness and blend polish
  - Footer standard/no-Shopify assertions across key routes
  - Homepage legacy fact-block removal
  - Homepage single-divider behavior
  - Products carousel + paging behavior on desktop/mobile

### Security
- Command: `npx semgrep --config auto app/ lib/ --quiet`
- Result: pass
- Command: `npm audit --omit=dev`
- Result: pass (`0 vulnerabilities`)

## Key Artifacts
- Sprint requirements: `sprints/v9/PRD.md`
- Sprint tasks: `sprints/v9/TASKS.md`
- This walkthrough: `sprints/v9/WALKTHROUGH.md`
- v9 E2E specs: `tests/e2e/v9-task*.spec.ts`
- v9 screenshots: `tests/screenshots/task5-*`, `task6-*`, `task8-*`, `task9-*`, `task11-*`, `task12-*`, `task14-*`, `task15-*`, `task16-*`, `task17-*`, `task18-*`

## Residual Notes
- Lint warnings are currently non-blocking and tied to intentional `<img>` usage. If optimization is required, migrate to `next/image` with styling parity checks.
