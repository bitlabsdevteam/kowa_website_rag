# v6 TASKS — Minimal Navigation + Single-Box Landing

- [x] Task 1: Baseline v6 scope and acceptance in sprint artifacts (P0)
  - Acceptance: v6 `PRD.md` and `TASKS.md` created with locked scope for menu simplification and single-box landing
  - Files: `sprints/v6/PRD.md`, `sprints/v6/TASKS.md`, `tests/unit/v6-task1-prd-baseline.test.mjs`
  - Completed: 2026-04-01 — locked v6 acceptance criteria and baseline artifact verification test added

- [x] Task 2: Add failing Playwright spec for minimal top menu and landing box constraints (P0)
  - Acceptance: new E2E spec fails on current UI and verifies only three nav items plus one landing primary box
  - Files: `tests/e2e/v6-task2-minimal-nav-single-box.spec.ts`, `tests/screenshots/task2-step1-v6-current-state.png`, `sprints/v6/TASKS.md`
  - Completed: 2026-04-01 — added red-state Playwright baseline that fails on current top-menu and landing-box constraints as expected

- [x] Task 3: Reduce top menu links to Overview, Business, Talk to Aya across desktop and mobile (P0)
  - Acceptance: desktop/mobile menus expose exactly three items and removed links are not present
  - Files: `components/top-menu.tsx`, `app/globals.css`, `tests/e2e/v6-task3-top-menu-minimal.spec.ts`, `tests/screenshots/task3-step1-v6-menu-red-state.png`, `sprints/v6/TASKS.md`
  - Completed: 2026-04-01 — reduced navigation to the three required entries and validated desktop/mobile menu constraints

- [x] Task 4: Consolidate landing into one single overview box with Kowa Trade & Commerce content (P0)
  - Acceptance: homepage main content area uses one primary box for overview copy and supports Talk to Aya CTA
  - Files: `app/page.tsx`, `app/globals.css`, `tests/e2e/v6-task4-single-landing-box.spec.ts`, `tests/screenshots/task4-step1-v6-landing-red-state.png`, `sprints/v6/TASKS.md`
  - Completed: 2026-04-01 — landing content consolidated into one overview box with embedded assistant entry and CTA

- [x] Task 5: Ensure Talk to Aya CTA behavior routes users to assistant entry point (P0)
  - Acceptance: clicking Talk to Aya from nav and landing reaches assistant section reliably on desktop/mobile
  - Files: `components/top-menu.tsx`, `app/page.tsx`, `tests/e2e/v6-task5-talk-to-aya-routing.spec.ts`, `tests/screenshots/task5-step1-v6-nav-before-routing.png`, `tests/screenshots/task5-step2-v6-desktop-nav-arrival.png`, `tests/screenshots/task5-step3-v6-landing-cta-arrival.png`, `tests/screenshots/task5-step4-v6-mobile-nav-arrival.png`, `sprints/v6/TASKS.md`
  - Completed: 2026-04-01 — validated Talk to Aya routing from top menu and landing CTA to assistant entry on desktop/mobile

- [x] Task 6: Update and pass v6 E2E assertions with screenshots after implementation (P1)
  - Acceptance: v6 spec passes and includes before/after screenshots for nav + landing states
  - Files: `tests/e2e/v6-task2-minimal-nav-single-box.spec.ts`, `tests/screenshots/task2-step1-v6-current-state.png`, `tests/screenshots/task2-step2-v6-final-state.png`, `sprints/v6/TASKS.md`
  - Completed: 2026-04-01 — finalized v6 Task 2 assertions for post-implementation state and captured before/after landing-navigation evidence

- [x] Task 7: Run regression checks for impacted routes and chat entry (P1)
  - Acceptance: relevant Playwright tests pass for homepage, navigation, and chat onboarding flows
  - Files: `tests/e2e/sprints.spec.ts`, `tests/e2e/v5-task4-top-menu.spec.ts`, `tests/e2e/v5-task10-release-smoke.spec.ts`, `sprints/v6/TASKS.md`
  - Completed: 2026-04-01 — updated impacted legacy regressions for v6 minimal-nav/single-box behavior and verified serial Playwright pass

- [x] Task 8: Finalize v6 walkthrough notes for release handoff (P2)
  - Acceptance: `WALKTHROUGH.md` documents exact UI deltas, validation evidence, and known follow-ups
  - Files: `sprints/v6/WALKTHROUGH.md`, `tests/unit/v6-task8-walkthrough.test.mjs`, `sprints/v6/TASKS.md`
  - Completed: 2026-04-01 — published v6 walkthrough with implementation deltas, validation proof, and follow-up recommendations
