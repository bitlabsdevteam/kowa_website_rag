# v6 Walkthrough

## Overview
Sprint v6 simplified the public-facing experience by reducing top-level navigation to three user choices and consolidating the landing narrative into one primary overview surface with direct assistant entry.

## What changed
- Top menu now exposes only `Overview`, `Business`, and `Talk to Aya` across desktop and mobile.
- Removed legacy top-menu entries from the homepage navigation surface.
- Landing page now uses a single primary overview box (`landing-primary-box`) for Kowa context.
- `Talk to Aya` is available in both top navigation and landing CTA, both targeting `/#assistant`.
- Assistant onboarding and chat widget remain available under the landing primary box for immediate grounded Q&A.

## File-level implementation deltas
- `components/top-menu.tsx`
  - menu list reduced to 3 links
  - `Talk to Aya` surfaced as nav item with `top-menu-link-talk-to-aya`
- `app/page.tsx`
  - homepage refactored from multi-section/card layout to one primary overview box
  - assistant section embedded under same primary box and reachable by anchor
- `app/globals.css`
  - added/adjusted classes for single-box composition (`landing-single`, `landing-assistant`)
  - updated menu CTA styling to operate as a nav link variant
- `tests/e2e/v6-task2-minimal-nav-single-box.spec.ts`
  - finalized from red-state baseline to post-implementation assertions
  - before/after screenshot evidence added

## Validation evidence
- v6 feature E2E set (serial for stability):
  - `npx playwright test --workers=1 tests/e2e/v6-task2-minimal-nav-single-box.spec.ts tests/e2e/v6-task3-top-menu-minimal.spec.ts tests/e2e/v6-task4-single-landing-box.spec.ts tests/e2e/v6-task5-talk-to-aya-routing.spec.ts`
  - result: pass
- impacted regression checks:
  - `npx playwright test --workers=1 tests/e2e/sprints.spec.ts tests/e2e/v5-task4-top-menu.spec.ts tests/e2e/v5-task10-release-smoke.spec.ts`
  - result: pass
- security checks:
  - `npx semgrep --config auto app/ lib/ --quiet`
  - `npm audit --omit=dev` (0 vulnerabilities)

## Artifact evidence
- `tests/screenshots/task2-step1-v6-current-state.png`
- `tests/screenshots/task2-step2-v6-final-state.png`
- `tests/screenshots/task3-step1-v6-menu-red-state.png`
- `tests/screenshots/task4-step1-v6-landing-red-state.png`
- `tests/screenshots/task5-step1-v6-nav-before-routing.png`
- `tests/screenshots/task5-step2-v6-desktop-nav-arrival.png`
- `tests/screenshots/task5-step3-v6-landing-cta-arrival.png`
- `tests/screenshots/task5-step4-v6-mobile-nav-arrival.png`

## Known follow-ups
- Legacy content routes (`/welcome`, `/inquiry`, `/factory`, `/access`, `/legacy`, `/admin`) remain implemented but are no longer primary top-nav destinations in v6.
- If needed, add contextual secondary links or footer access patterns in a future sprint without re-expanding top-nav complexity.
- Evaluate whether shared layout should enforce identical top menu across all public routes (not only homepage scope) in a dedicated follow-up sprint.
