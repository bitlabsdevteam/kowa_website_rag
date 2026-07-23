# CLAUDE.md

Guidance for Claude Code when working in this repository. Keep changes grounded, premium, and verifiable.

## What This Project Is
A premium **multilingual marketing site** (EN / JA / ZH) for **Kowa Trade and Commerce Co., Ltd.** (Tokyo, Japan) — a B2B trading company built around **plastics recycling and resource circulation**: collection → sorting → regeneration (G.P. Polymer / Gunma line) → export, plus resin procurement, battery-pack support, and industrial-machinery trade.

The site pairs a beautiful corporate narrative with a prominent **Agentic RAG chatbot ("Aya")**. The homepage establishes Kowa's real business scope *before* the user enters chat; Aya handles deeper grounded Q&A and lead routing.

Beyond the public site there is an **operations layer**: a content-ingestion/news pipeline, a human-handoff queue, an admin inbox (`/admin`), and a Telegram adapter — so qualified inquiries can be triaged and answered by staff. Treat the marketing site and this ops layer as one product.

## Non-Negotiables
- **Stay grounded — never invent business facts.** All company/profile copy and chatbot answers must trace to verified sources (see below). If a source is image-only or extraction-limited, record the gap in sprint artifacts; do not fabricate.
- **Premium, editorial, calm.** Generous spacing, strong typography, minimal but expressive color. Brand tone: trustworthy, operationally precise, sustainability-minded — for procurement/management-level international buyers.
- **No secrets in the repo.** Environment-driven integrations only; never hardcode credentials or API keys.

## Source of Truth (verify copy before changing it)
1. Local PDFs in `pdfs/` — primary profile sources:
   - `pdfs/Kowa Company profile.pdf`
   - `pdfs/広和通商会社案内.pdf`
2. Legacy site `https://kowatrade.com/` — primary business-context reference.
3. Normalized artifacts in `data/` (e.g. `data/sources.json`) and prior sprint docs.

Before editing homepage copy, service descriptions, or chatbot prompts: map claims to the PDFs, validate against the legacy site, then capture confirmed facts back into `data/`/docs so UI text and RAG prompts stay consistent.

## Tech Stack
- **Frontend:** Next.js (App Router) + React 19 + TypeScript (strict).
- **3D / motion:** Three.js via `@react-three/fiber` + `@react-three/drei` (hero scene, scroll-reveal).
- **Data layer:** Supabase — persistence, auth, operational tables.
- **RAG / chat orchestration:** Dify API platform — endpoint for the Aya assistant workflows.
- **Styling:** vanilla CSS with design tokens in `app/globals.css` (no Tailwind/CSS-in-JS).

## Design System — Theme: "Resource Circulation Editorial"
Editorial-premium + B2B trust, with nature-distilled warmth: green = the literal recycling/circularity signal. Light cream canvas is the default reading surface; selected sections use a dark-glass band for cinematic contrast. Generous spacing, strong type hierarchy, restrained color, calm motion.

Canonical tokens live in `:root` in `app/globals.css` as `--color-*`; the short aliases (`--bg`, `--surface`, `--text`, `--accent`, …) just mirror them — set values only on `--color-*`, never the aliases. Reuse tokens; don't introduce ad-hoc colors.
- Canvas `#f3efe7` / strong `#ebe5d9` · Surface off-white glass `rgba(255,252,246,0.88)` (`backdrop-filter` blur).
- Accent `#2d6b49` → `#1f5235` (forest green) — primary, CTAs, links, focus ring.
- Text `#201a15` · muted `#5c5247` (kept ≥4.5:1 on cream — don't lighten).
- Fonts: **Fraunces** (display serif, optical sizing) + **Space Grotesk** (UI/body, Latin) + **Noto Sans JP** (JA/ZH). This pairing is the theme's signature — do not swap.
- Motion is subtle (scroll-reveal + glass) and respects `prefers-reduced-motion`.

**Landing photo hero (`/` only).** The hero is the container-yard photograph (`public/images/company/container-yard.jpg`) full-bleed behind the copy (`HeroSection` with `fullBleed`, styled by `.hero-section--full-bleed` in `app/globals.css`). A deep-forest scrim (`--color-hero-scrim`, `#0c1e15`) grades the photo from the left so the white headline stays legible while the jet and sun flare on the right stay clear; the accent headline line and CTA use `--color-accent-soft`, and the accent line is italic for Latin (`html:lang(en)`) only. Performance contract: the backdrop animates opacity/transform only (never clip-path or other raster-bound properties over the full-viewport photo), and the scrim keeps its own compositor layer — regressing this stalls smooth scrolling on software rasterizers and fails the landing e2e spec.

## Project Structure
- `app/` — public routes (`/`, `/company_profile`, `/products`, `/business`, `/machines`, `/factory`, `/news`, `/inquiry`) and ops routes (`/admin`, `/login`, `/access`).
- `app/api/` — handlers: `chat`, `assistant`, `ingest`, `news`, `telegram`, `admin`, `runtime`.
- `components/` — reusable UI, incl. chatbot surfaces and `hero-3d/`.
- `lib/` — typed clients, contracts, Supabase/Dify adapters, site copy.
- `locales/` — `en.json` / `ja.json` / `zh.json` copy.
- `data/` — normalized facts (`sources.json`, `legacy-pages.json`, `evals/`).
- `scripts/` — `crawl_legacy.py`, `eval_retrieval_gate.mjs`.
- `tests/e2e/` — Playwright specs (per-sprint, per-task).
- `supabase/migrations/` — ordered schema migrations (`0001_core.sql` → current).

## Commands
- `npm install` — install dependencies.
- `npm run dev` — local app at `http://127.0.0.1:3000` (Next + webpack).
- `npm run build` — production build validation.
- `npm run lint` — ESLint static checks.
- `npm run eval:retrieval` — RAG retrieval-gate eval.
- `npx playwright test` — end-to-end verification.
- `docker compose up --build` — containerized local stack.

## Implementation Standards
- TypeScript strict mode; explicit types for API request/response payloads.
- 2-space indentation, single quotes, semicolons; `@/*` imports; composable components.
- Chat UI must clearly show conversation state: loading, answer, and source/citation metadata when available.
- Keep information architecture clear: high-level context on `/`, deeper content on dedicated pages, non-blocking popup chat.

## Commit & PR Rules
- Conventional commits: `feat(scope): …`, `fix(scope): …`, `docs: …`, `chore: …`.
- PRs include: summary, linked task, test evidence, and screenshots for UI changes.

## Hosting / Infrastructure
Production deploy target is a **Sakura VPS (v5)**, service code `113801641248`:
- OS: Ubuntu 24.04 amd64
- Zone: Osaka Zone 3 (大阪第3)
- Plan: 8G — 6 vCore, 8GB RAM, 400GB SSD, ¥7,480/month
- Hostname: `os3-318-48513.vs.sakura.ne.jp`
- IPv4: `49.212.128.17`
- IPv6: `2403:3a00:202:1204:49:212:128:17`
- Contract state: currently in trial period (お試し期間中) — auto-converts to a paid contract after the trial ends; scale-up is unavailable during the trial.

SSH is the only inbound traffic allowed by default (Sakura packet filter); opening other ports requires an explicit packet-filter change in the Sakura control panel. Treat root access on this box as production — no ad-hoc changes outside deploy tooling.

## Security & Config
Required env vars (keep `.env` local, never commit):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DIFY_API_KEY`, `DIFY_BASE_URL`.

**Contact form (`app/api/contact/route.ts`)** always delivers to the existing **`kowa@kowatrade.com`** inbox (`CONTACT_TO_EMAIL`, default set in `.env.example`) — never repoint this to a new/placeholder address. Sending can go through either provider, selected automatically by `isSmtpRelayConfigured()` in `lib/email/smtp.ts`:
- **Resend** (`lib/email/resend.ts`) — default when `SMTP_HOST` is unset; needs `RESEND_API_KEY` + `CONTACT_FROM_EMAIL`.
- **Sakura mailbox SMTP relay** (`smtp.sakura.ne.jp:587`, STARTTLS via `nodemailer`) — used when `SMTP_HOST` is set; needs `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM`. `SMTP_FROM` is `kowa@kowatrade.com` (mail is sent and received on the same Kowa mailbox). See `web_hosting.md` for the Sakura mailbox provisioning steps (SPF/DKIM records, mailbox creation).
