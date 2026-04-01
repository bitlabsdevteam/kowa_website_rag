# PRD — Kowa Website + RAG (v8)

## 1) Sprint Overview
Sprint v8 extends the v7 redesign with PDF-driven company profile storytelling. The sprint keeps the refined popup-chat and hero layout fixes, then adds a new `Company profile` route and a homepage `WHAT IS KOWA'S BUSINESS?` section under `Kowa Trade & Commerce`, using business facts curated from local company-profile PDFs and aligned with legacy Kowa references.

## 2) Goals
- Keep v8 quick fixes stable: hero/video order, footer fact migration, and popup-chat close control.
- Add a new top navigation menu item: `Company profile`.
- Create `/company_profile` page and populate it with structured company-profile content sourced from PDFs.
- Add a homepage section `WHAT IS KOWA'S BUSINESS?` directly under the hero narrative.
- Visualize business scope in an intuitive, premium format (pillar cards + process flow) rather than plain paragraphs.
- Preserve v7 route boundaries: `NEWS` under `/news`, `PRODUCTS` under `/products`.

## 3) User Stories
- As a first-time visitor, I want to see what Kowa actually does right under the hero title, so I can understand core business quickly.
- As a buyer or partner, I want a dedicated company profile page, so I can review capabilities in one place before contacting Kowa.
- As a content owner, I want profile copy tied to local PDF sources, so that website claims stay grounded and auditable.
- As a chat user, I want popup chat that is easy to dismiss, so chat support does not block browsing.

## 4) Technical Architecture
- Frontend: Next.js App Router + TypeScript.
- Core files:
  - `app/page.tsx`: hero flow + `WHAT IS KOWA'S BUSINESS?` section + featured video placement.
  - `app/company_profile/page.tsx`: dedicated profile page.
  - `components/top-menu.tsx`: add `Company profile` nav entry.
  - `lib/site-copy.ts`: locale-ready copy for business pillars/profile sections.
  - `components/chat-popup.tsx`: keep popup close-control behavior.
  - `app/globals.css`: business-section and company-profile visual treatment.
- Source governance:
  - Compile PDF-derived business facts into sprint artifacts for traceable copy usage.

### Component Diagram
```text
[TopMenu]
  -> / (ABOUT)
  -> /news
  -> /products
  -> /company_profile

[HomePage /]
  -> Hero Narrative (Kowa Trade & Commerce)
  -> WHAT IS KOWA'S BUSINESS? (visual business pillars/flow)
  -> Featured Video
  -> Talk to Aya (popup trigger)
  -> Footer facts

[CompanyProfile /company_profile]
  -> Company overview
  -> Business domains
  -> Operations/process highlights
  -> Contact anchor
```

### Data / Interaction Flow
```text
PDF company profile sources
  -> Normalize key business statements into sprint artifact
  -> Map normalized statements into locale copy objects
  -> Render summary on homepage ("WHAT IS KOWA'S BUSINESS?")
  -> Render expanded structure on /company_profile

User clicks Talk to Aya
  -> Popup opens with compact chat UI
  -> User can close with × and continue reading
```

## 5) Out of Scope
- Full OCR pipeline/productization for scanned PDFs.
- New backend retrieval model changes in Dify.
- Ecommerce checkout/cart implementation.
- Full localization of all route pages beyond already-planned scope.

## 6) Dependencies
- v7 baseline implementation and layout system.
- Local PDF sources in `pdfs/`.
- Existing legacy normalization artifacts:
  - `sprints/v1/artifacts/content-normalized.json`
  - `sprints/v5/artifacts/legacy-business-facts.md`

## 7) Locked Acceptance Criteria for v8

### AC-SOURCE PDF-Grounded Content
- v8 artifacts document how homepage/profile business copy maps to local PDF company-profile sources.
- If any PDF segment is non-extractable, the gap is explicitly noted and fallback source usage is documented.

### AC-NAV Company Profile Menu
- Header contains `Company profile` entry.
- `Company profile` routes to `/company_profile`.

### AC-HOME Business Section Placement
- Homepage contains a section titled `WHAT IS KOWA'S BUSINESS?`.
- Section appears under the `Kowa Trade & Commerce` hero narrative block.
- Section uses a visual structure (cards/flow/pillars), not text-only dense paragraphs.

### AC-PAGE Company Profile Route
- `/company_profile` exists and renders structured company profile content:
  - company overview
  - business domains/capabilities
  - operational context/contact handoff

### AC-HERO/FOOTER/CHAT Quick-Fix Continuity
- Featured video remains directly under hero content flow.
- Hero eyebrow above title remains removed.
- Footer contains `Established`, `Address`, and `Main line`.
- Popup chat includes visible `×` close control and dismisses reliably.

### AC-ROUTE SEPARATION Continuity
- `NEWS` content remains only under `/news`.
- `PRODUCTS` content remains only under `/products`.
