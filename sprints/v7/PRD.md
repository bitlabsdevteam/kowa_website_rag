# PRD — Kowa Website + RAG (v7)

## 1) Sprint Overview
Sprint v7 repositions the Kowa website toward a premium editorial commerce style, inspired by the visual rhythm of the GASBOOK store reference, while preserving Kowa business clarity and grounded assistant access. The sprint keeps the main landing focused on `ABOUT` plus a media/video section, moves `NEWS` and `PRODUCTS` into dedicated pages, adds multilingual localization (EN default, Japanese, Mandarin), introduces a new elegant logo system, and finalizes icon-based login/shopping actions with a complete footer.

## 2) Goals
- Deliver a premium homepage redesign with `ABOUT` and a featured video section.
- Move `NEWS` and `PRODUCTS` content into dedicated routes (`/news`, `/products`).
- Add a new elegant `Kowa Trade & Commerce` logo mark and wordmark suitable for header branding.
- Provide locale switching for `EN` (default), `JP`, and `中文` on the homepage.
- Add icon-based `Online Shopping` and `User Login` actions in the top header.
- Keep Aya assistant access as a popup flow from the hero CTA without obstructing primary content.
- Include a required footer with corporate information and rights text.

## 3) User Stories
- As a first-time visitor, I want a clean editorial homepage with focused sections, so that I can understand Kowa quickly.
- As a visitor, I want `NEWS` and `PRODUCTS` on dedicated pages, so that each section has clearer depth and focus.
- As a multilingual visitor, I want to switch language between English, Japanese, and Mandarin, so that I can read content in my preferred language.
- As a buyer, I want a direct online shopping button next to login, so that I can move from brand context to commerce quickly.
- As a prospect, I want to open Aya chat on demand in a popup, so that I can ask questions without losing page context.
- As a brand stakeholder, I want a refined and elegant logo treatment, so that the website feels premium and consistent.

## 4) Technical Architecture
- Frontend: Next.js App Router + TypeScript (client-side locale state for homepage copy).
- UI components:
  - `components/top-menu.tsx` for nav links, locale switcher, login + shopping actions.
  - `components/kowa-logo.tsx` for reusable brand mark/wordmark.
  - `components/chat-popup.tsx` + `components/chat-widget.tsx` for popup assistant behavior.
- `app/page.tsx` for section composition (`ABOUT`, featured video, footer).
- `app/news/page.tsx` for dedicated news content surface.
- `app/products/page.tsx` for dedicated product catalog surface.
  - `app/globals.css` for visual system, responsive behavior, popup constraints.
- Content consistency:
  - Business statements remain aligned to legacy Kowa references and normalized profile artifacts.

### Component Diagram
```text
[Browser]
   |
   v
[Next.js App Router]
   |
   +--> app/page.tsx ----------------------------------+
   |                                                   |
   +--> components/top-menu.tsx                        |
   |      +--> components/kowa-logo.tsx               |
   |                                                   v
   +--> components/chat-popup.tsx ---> chat-widget  [Homepage UI]
   |                                                   |
   +--> app/globals.css -------------------------------+
```

### Data / Interaction Flow
```text
User opens /
  -> Header renders logo + ABOUT/NEWS/PRODUCTS routes + locale + icon login + icon shopping
  -> Locale change updates homepage copy (EN/JP/ZH)
  -> Main landing shows ABOUT narrative + featured video
User opens /news or /products
  -> Dedicated content page renders for selected section
  -> User clicks Talk to Aya
  -> Popup chat opens in constrained bottom-right panel
  -> User can keep reading main page while chatting
```

## 5) Out of Scope
- Full ecommerce cart/checkout implementation inside Kowa site.
- Supabase schema migrations for localization/content management.
- Dify retrieval orchestration changes.
- Replacing existing `/login` auth workflow.
- Multi-page localization rollout beyond homepage scope.

## 6) Dependencies
- Existing homepage/chat component foundation from v6.
- Existing normalized company profile artifact (`sprints/v1/artifacts/content-normalized.json`).
- Design direction reference from GASBOOK store visual style.
- Legacy Kowa business reference (`https://kowatrade.com/`) for copy alignment checks.

## 7) Locked Acceptance Criteria for v7

### AC-NAV Commerce Header
- Top navigation shows exactly the content hierarchy `ABOUT`, `NEWS`, and `PRODUCTS`.
- `ABOUT` routes to `/`, `NEWS` routes to `/news`, and `PRODUCTS` routes to `/products`.
- Header includes icon-only `User Login` and `Online Shopping`, with `Online Shopping` adjacent to login.
- `Online Shopping` action opens external shop in a new tab.

### AC-LOCALE Homepage Localization
- Homepage supports `EN`, `JP`, and `中文` locales from a visible language selector.
- Default locale is English on initial load.
- Hero, video heading, and footer text update with locale changes.

### AC-PAGES News and Products Split
- `NEWS` content is not rendered on the main landing page.
- `PRODUCTS` content is not rendered on the main landing page.
- `NEWS` appears under `/news`; `PRODUCTS` appears under `/products`.

### AC-BRAND New Elegant Logo
- New logo component renders a custom mark plus `Kowa Trade & Commerce` wordmark.
- Logo appears in the header and remains legible across desktop/mobile breakpoints.

### AC-CHAT Popup UX
- `Talk to Aya` opens chat as popup UI, not inline static block.
- Popup styling follows compact merchant-style chat UI (dark intro card + light message input row).
- Popup has constrained width/height and does not overrun viewport boundaries.
- No extra open/close control buttons are required in the popup chrome.

### AC-MEDIA Landing Video
- Main landing includes an embedded video or YouTube clip section.
- Video surface is responsive and remains usable on desktop/mobile.

### AC-FOOTER Required
- Homepage includes a footer with corporate note and rights text.
- Footer remains visible and readable on both desktop and mobile.

### AC-CONTENT Legacy Alignment
- English corporate footer copy aligns with normalized legacy profile facts from `sprints/v1/artifacts/content-normalized.json`.
- Baseline facts include company name format and Mita (`Reoma Bldg. 5F, 2-10-6`) address reference.
