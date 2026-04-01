# PRD — Kowa Website + RAG (v9)

## 1) Sprint Overview
Sprint v9 hardens release quality after v8 by focusing on visual fidelity and deployment reliability, and introduces a premium product-gallery system sourced from local assets in `images/`. The sprint ensures homepage business-visual rendering is production-safe (including Docker/static asset delivery), refines the hero-side image blending experience, standardizes the new minimalist footer across routes and locales, and launches an elegant 2026-style products presentation with carousel motion and paging.

## 2) Goals
- Guarantee static image assets load correctly in Docker/runtime environments.
- Finalize hero-side business visual integration so it appears polished and fully blended into the landing panel.
- Standardize the new footer bar layout (copyright, terms label, social icons) across key routes.
- Remove legacy footer fact blocks from homepage and keep a single, consistent footer pattern.
- Build a premium product showcase using images from `/Users/davidbong/Documents/kowa_repo/kowa_rag/kowa_website_rag/images`.
- Present products with an elegant, modern interaction model (carousel + progressive reveal), not a static basic grid.
- Implement paging strategy so users can navigate larger product sets cleanly.
- Remove the extra bottom horizontal line on the main landing page footer area.
- Add targeted regression coverage for asset rendering and footer consistency.

## 3) User Stories
- As a visitor, I want the homepage business visual to render correctly in production, so I can understand Kowa’s business context immediately.
- As a brand stakeholder, I want hero imagery to blend cleanly with the editorial panel, so the page feels premium and intentional.
- As a user, I want a clean footer without Shopify references, so the site reflects Kowa branding clearly.
- As an operator, I want Docker builds to include required static assets, so releases do not break images.
- As a buyer, I want to browse real product photos in a premium gallery flow, so I can quickly understand product range and quality.
- As a mobile user, I want swipable gallery behavior with clear page indicators, so navigation remains intuitive on small screens.

## 4) Technical Architecture
- Frontend: Next.js App Router + TypeScript.
- Deployment/runtime: Docker multi-stage build.
- Key file targets:
  - `app/page.tsx` (hero + visual placement)
  - `app/products/page.tsx` (premium gallery, carousel, paging controls)
  - `components/` (new reusable carousel/gallery components)
  - `app/globals.css` (blending/positioning/responsive treatment)
  - `components/site-footer-bar.tsx` (footer structure/icons)
  - `app/news/page.tsx`, `app/products/page.tsx`, `app/company_profile/page.tsx` (shared footer usage)
  - `lib/site-copy.ts` (footer locale labels)
  - `lib/` (product-image manifest and paging model)
  - `Dockerfile` (static asset copy into runner stage)
  - `public/images/` (hero visual + product gallery assets)

### Component Diagram
```text
[Home /]
  -> TopMenu
  -> Hero (title/text + business visual)
  -> Business section
  -> Video + Chat CTA
  -> SiteFooterBar

[Products /products]
  -> Product Hero
  -> Premium Carousel (drag/swipe/buttons)
  -> Paging controls (numbers/progress)
  -> Product detail captions / tags
  -> SiteFooterBar

[Shared Footer]
  -> left: copyright
  -> center: terms label
  -> right: social icons

[Docker runner]
  -> app runtime
  -> .next bundle
  -> public/ static assets
```

### Data / Interaction Flow
```text
User opens /
  -> Hero text + business visual load from /public/images
  -> Visual blends with landing panel style (no visible white block)
  -> Footer bar renders standardized layout

Docker deployment
  -> Build stage compiles app
  -> Runner stage copies .next + public
  -> Static asset URLs resolve in production

Products gallery data flow
  -> Ingest local image files from `images/`
  -> Normalize into manifest (name, src, category, optional caption)
  -> Render paged carousel groups in `/products`
  -> Sync active slide with paging indicators
```

## 5) Out of Scope
- New information architecture changes (menus/routes) beyond current v8 structure.
- Major copy rewrites for business/product/news narratives.
- Chat backend or retrieval orchestration changes.
- Full legal pages implementation (`/terms` content drafting).
- External DAM/CDN integration for product media management.

## 6) Dependencies
- Completed v8 baseline artifacts and tests.
- Existing `public/images/kowa-business-visual.svg` or user-provided replacement asset.
- Dockerized deployment path via `Dockerfile` and `docker-compose.yml`.
- Local source product images in `/Users/davidbong/Documents/kowa_repo/kowa_rag/kowa_website_rag/images`.

## 7) Locked Acceptance Criteria for v9

### AC-ASSET Docker Static Delivery
- Runtime container includes `public/` assets.
- Hero business visual resolves in Docker-run production mode without broken image placeholders.
- Product gallery images resolve in Docker-run production mode without broken image placeholders.

### AC-HERO Visual Blend
- Main landing displays business visual beside hero copy on desktop.
- Mobile layout stacks cleanly without overlap/cropping issues.
- Visual appears background-free or visually blended into panel surface.

### AC-FOOTER Standard
- Footer bar appears consistently on `/`, `/news`, `/products`, and `/company_profile`.
- Footer contains:
  - left copyright text
  - center terms label
  - right social icon cluster
- No `Powered by Shopify` text appears anywhere in rendered footer.

### AC-HOMEPAGE Fact Block Removal
- Legacy `Established / Address / Main line` block is removed from homepage footer area.

### AC-HOMEPAGE Bottom Line Cleanup
- Homepage bottom section does not show duplicate horizontal divider lines.
- Only the intended footer divider styling remains.

### AC-PRODUCTS Premium Gallery UX
- `/products` uses local product images from repository `images/` (served via app static path).
- Page includes a premium gallery mode (carousel/track) with:
  - desktop next/prev controls
  - touch/swipe support on mobile
  - smooth motion and active-slide emphasis
- Gallery is not a plain unpaginated image dump.

### AC-PRODUCTS Paging
- Product gallery supports paging when item count exceeds one viewport set.
- Paging UI exposes current position (for example `1 / N`, numeric dots, or segmented progress).
- Paging controls are keyboard and screen-reader accessible.

### AC-REGRESSION Safety
- Build, lint, and targeted v9 E2E checks pass.
- Security checks (`semgrep`, `npm audit --omit=dev`) pass.
