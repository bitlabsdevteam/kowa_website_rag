# v9 Baseline Scope Inventory

## Objective
Capture Sprint v9 baseline scope with explicit runtime/deployment references before implementation tasks begin.

## Planning anchors
- `sprints/v9/PRD.md`
- `sprints/v9/TASKS.md`

## Runtime and deployment references
- `Dockerfile`
- `docker-compose.yml`
- `package.json`

## Static asset paths
- `public/images/`
- `images/` (source repository folder for product media planning)

## Hero and footer target files
- `app/page.tsx` (hero visual placement + main landing composition)
- `app/globals.css` (hero blend and footer divider styling)
- `components/site-footer-bar.tsx` (shared footer bar structure)
- `app/news/page.tsx`
- `app/products/page.tsx`
- `app/company_profile/page.tsx`

## v9 artifacts root
- `sprints/v9/artifacts/`

## Notes
- v9 implementation must preserve v8 baseline behavior while extending product gallery UX and paging.
- Homepage hero and footer updates should be validated in both local dev and Docker-run runtime.
