# Repository Guidelines

## Product Direction
- Build for **Kova Trade and Commerce** (Tokyo, Japan).
- Visual direction: clean, editorial, and premium, inspired by Anthropic-style patterns (generous spacing, strong typography, minimal but expressive color).
- Primary experience: a beautiful marketing site with a prominent **Agentic RAG chatbot UI** (user phrasing: “Gentic Rack chatbot UI”).

## Project Objective
- Deliver a premium multilingual marketing site that communicates Kowa's real business scope clearly before users enter chat.
- Keep the homepage narrative grounded in verified company profile content, then let the Aya assistant handle deeper Q&A.
- Maintain clear information architecture: high-level context on `/`, deeper profile content in dedicated pages, and non-blocking popup chat.

## Company Profile Source of Truth
- Treat local PDFs in `pdfs/` as primary company-profile sources for profile copy and business taxonomy:
  - `pdfs/Kowa Company profile.pdf`
  - `pdfs/広和通商会社案内.pdf`
- For homepage and profile-page copy updates, first map claims to these PDF sources, then validate against `https://kowatrade.com/` and existing normalized artifacts.
- Required content placement:
  - Add `WHAT IS KOWA'S BUSINESS?` content block under the main `Kowa Trade & Commerce` hero narrative on `/`.
  - Add a `Company profile` top menu item that routes to `/company_profile`.
  - Populate `/company_profile` using structured company-profile content derived from PDFs.
- If any PDF is image-only or extraction-limited in local tooling, record extraction gaps explicitly in sprint artifacts and avoid inventing unverifiable facts.

## Legacy Business Reference
- Use the old website as a primary reference for Kova business context: `https://kowatrade.com/`.
- Before changing homepage copy, service descriptions, or chatbot prompts, verify alignment with legacy business information from this site.
- Capture confirmed business facts into repo data/docs (for example `data/` or sprint artifacts) so UI text and RAG prompts stay consistent.

## Tech Stack Requirements
- Frontend: **Next.js + TypeScript** (App Router).
- Data layer: **Supabase** (user phrasing: “SuperBase”) for persistence, auth, and operational tables.
- RAG/API layer: **Dify API platform** (user phrasing: “Dyfi”, “REG API layer”) as the orchestration endpoint for chat workflows.
- Keep environment-driven integrations; do not hardcode credentials or API keys.

## Project Structure & Ownership
- `app/`: routes and API handlers.
- `components/`: reusable UI blocks, including chatbot surfaces.
- `lib/`: typed clients, contracts, and integration helpers (Supabase/Dify adapters).
- `tests/e2e/`: Playwright end-to-end tests.
- `supabase/migrations/`: schema migrations.

## Build, Test, and Dev Commands
- `npm install`: install dependencies.
- `npm run dev`: run local app (`http://127.0.0.1:3000`).
- `npm run build`: production build validation.
- `npm run lint`: static checks.
- `npx playwright test`: end-to-end verification.
- `docker compose up --build`: containerized local stack.

## Implementation Standards
- TypeScript strict mode; explicit types for API request/response payloads.
- 2-space indentation, single quotes, semicolons.
- Use `@/*` imports and keep components composable.
- Chat UI must show conversation state clearly (loading, answer, and source/citation metadata when available).

## Commit & PR Rules
- Use conventional-style messages: `feat(scope): ...`, `fix(scope): ...`, `docs: ...`, `chore: ...`.
- PRs must include: summary, linked task, test evidence, and screenshots for UI changes.

## Security & Config
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DIFY_API_KEY`, `DIFY_BASE_URL`.
- Never commit secrets; keep `.env` local.
