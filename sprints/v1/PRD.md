# PRD — Kowa Website + RAG Chatbot (v1)

## 1) Product Goal
Build a redesigned Kowa corporate website with an embedded RAG chatbot, preserving and modernizing content from the legacy site (`https://kowatrade.com/`) and enabling grounded Q&A with citations.

## 2) Mandatory Inputs for v1
1. **Legacy content migration is mandatory**
   - Crawl/scrape all reachable legacy pages from `kowatrade.com`.
   - Extract bilingual corporate profile data (JP/EN) and preserve factual company information.
   - Build a structured content inventory before UI implementation.

2. **Design benchmarking is mandatory (Perplexity-based)**
   - Use Perplexity research to benchmark top elegant trading/chatbot experiences.
   - Selected references for v1 visual/system direction:
     - **TrendSpider** (AI assistant-led, product-driven sectioning)
     - **Interactive Brokers IBot** (trust + utility + trading-assistant framing)

3. **Frontend quality is mandatory**
   - Use high-design frontend direction (clean corporate premium, strong typography, credible trust cues).
   - Avoid generic chatbot landing style.

4. **RAG grounding is mandatory**
   - Answers must be grounded in approved Kowa sources only.
   - Explicit abstention when evidence is missing.

---

## 3) Legacy Website Crawl & Content Migration Spec

### 3.1 Crawl Targets
- Primary domain: `https://kowatrade.com/`
- Crawl policy: domain-only, HTML pages + key downloadable docs (if any), skip binary media except linked company docs.

### 3.2 Output Artifacts (required before build)
- `content-inventory.csv`
  - `url`, `title`, `lang`, `content_type`, `status_code`, `notes`
- `content-normalized.json`
  - Structured company data fields (name, address, tel/fax, management, capital, established year, affiliates)
- `migration-map.md`
  - old URL -> new IA destination (new page/section)

### 3.3 Content Rules
- Do not invent company facts.
- Preserve legal/company identity data exactly (with normalization only for formatting).
- Flag uncertain/garbled legacy text for manual verification.

---

## 4) Design Direction (derived from benchmark references)

### 4.1 Visual Principles
- Premium corporate trust first, chatbot second
- Strong information hierarchy (company credibility -> capabilities -> chatbot utility)
- Sparse, elegant whitespace and polished typography
- Subtle motion, no noisy effects

### 4.2 IA / Page Structure (v1)
1. Home (hero + trust + capability overview)
2. About / Company Profile (legacy facts modernized)
3. Services / Trading Domains
4. RAG Chat Assistant page/section
5. Contact

### 4.3 Chatbot UX Principles
- Prominent but non-intrusive entry point
- Suggested prompts for first-time users
- Citation panel with source and page/section metadata
- Clear “I don’t know based on available Kowa sources.” fallback

---

## 5) MVP Scope

### In Scope
- New website shell + modern UI
- Legacy content migration and normalization
- RAG chatbot UI + backend endpoint
- PDF/source ingestion for knowledge base
- Citation rendering and grounding guardrails
- Basic admin ingestion controls (upload/disable source)

### Out of Scope
- Full CMS authoring workflows
- Advanced analytics dashboards
- Enterprise SSO
- Multi-brand theming

---

## 6) Functional Requirements
1. Legacy crawl pipeline and migration artifacts generated before UI freeze.
2. Users can ask questions and receive grounded responses with citations.
3. Citations must be from verified indexed sources only.
4. Admin can upload and disable sources.
5. Chat must support JA/EN UI baseline and language steering.

---

## 7) Non-Functional Requirements
- P95 response latency < 8s (MVP target)
- No sensitive keys pushed to repo
- Secure object storage + least privilege access
- Auditability: request, retrieval set, and citation provenance logs

---

## 8) Technical Direction (v1)
- Frontend: Next.js + TypeScript
- Styling/UX: frontend-design quality standard
- Backend: Next.js API routes (MVP)
- DB/Vector: Supabase Postgres + pgvector
- Storage: S3-compatible object storage
- Orchestration: LangGraph/LangChain

---

## 9) Success Metrics
- 100% legacy reachable pages inventoried in crawl output
- >80% grounded answers include valid citations when evidence exists
- <5% citation-link failures
- >90% successful ingestion runs
- Stakeholder design acceptance on benchmark alignment (TrendSpider/IBot-inspired structure, Kowa-branded execution)

---

## 10) Milestones
- **v1.1**: Legacy crawl + content inventory + migration map
- **v1.2**: New website IA + premium frontend implementation
- **v1.3**: RAG chatbot + citations + admin ingestion
- **v1.4**: QA hardening + pilot release
