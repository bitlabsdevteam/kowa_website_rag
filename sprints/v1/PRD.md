# PRD — Kowa Website Migration + RAG Agent Chatbot (v1)

## 1) Product Summary
Build a new Kowa website as a modern replacement of the legacy site, with an **agent-based RAG chatbot embedded on the main landing page**.

The project is a **legacy website migration** plus **new AI capability** rollout.

---

## 2) Business Goal
- Modernize brand presence and UX quality
- Preserve and migrate legacy website content accurately
- Add a grounded chatbot for instant Q&A using trusted company sources
- Create a scalable base for future content and automation

---

## 3) Core Scope (Must Have)

### A. Legacy Website Migration
- Input: old website URL (provided by stakeholder)
- Crawl and scrape all reachable pages/content from old website
- Build migration artifacts:
  - `content-inventory.csv`
  - `content-normalized.json`
  - `migration-map.md`
- Preserve factual company information and key corporate data
- Flag ambiguous/garbled legacy text for manual review

### B. New Website Build
- Rebuild website with modern architecture and premium UI/UX
- New IA includes at minimum:
  - Home (landing)
  - About/Company Profile
  - Services
  - Contact
- Main landing page includes RAG chatbot section/widget

### C. RAG Agent-Based Chatbot on Landing Page
- Chatbot available directly on home page
- Agent-based orchestration with grounded retrieval
- Responses must include citations when evidence exists
- If evidence missing: explicit abstention response
- No synthetic/hallucinated citations

### D. Supabase Support
- Integrate Supabase for:
  - website operational data
  - chat session metadata/history
  - source/index metadata
  - vector retrieval support via pgvector
- Design schema for migration content and RAG sources

---

## 4) Design Direction (Frontend Execution Mandate)
- Implement using **frontend-design skill quality standard**:
  - elegant, distinctive, non-generic visual system
  - strong typography and trust-oriented composition
  - premium corporate aesthetic
  - responsive and accessible
- Avoid cookie-cutter AI landing patterns
- Home page must balance:
  1) corporate credibility
  2) service clarity
  3) visible AI-assistant utility

---

## 5) Functional Requirements
1. Legacy crawler runs on provided old URL and generates migration artifacts.
2. Content from legacy site is mapped into new IA sections.
3. Landing page contains active chatbot entry.
4. Chat endpoint supports retrieval-grounded answers.
5. Citation UI renders source title/link/page metadata.
6. Supabase integration supports storage/query requirements.
7. Basic admin ingestion controls for source updates.

---

## 6) Non-Functional Requirements
- Mobile-first responsive behavior
- Secure handling of environment variables (no secrets in repo)
- P95 chatbot response target under 8 seconds (MVP)
- Auditability for retrieval set and citations
- Maintainable project structure for rapid iteration

---

## 7) Technical Direction (v1)
- Frontend: Next.js + TypeScript
- Styling system: custom premium UI layer
- Backend: Next.js API routes (MVP)
- Agentic layer: LangGraph + LangChain
- Database/vector: Supabase Postgres + pgvector
- File/object storage: S3-compatible storage (as needed for source docs)

---

## 8) Success Metrics
- 100% reachable legacy pages inventoried in crawl output
- >90% successful migration mapping coverage
- >80% grounded answers include valid citations when evidence exists
- <5% citation-link failures
- Stakeholder acceptance on redesigned visual quality

---

## 9) Risks & Controls
- **Legacy encoding issues** → add normalization + manual review queue
- **Content loss during migration** → inventory + migration map validation gate
- **Hallucinations** → strict grounded retrieval + abstention policy
- **Design drift to generic UI** → enforce frontend-design review criteria

---

## 10) Delivery Phases
1. Discovery + crawl + migration artifacts
2. IA + high-fidelity design system
3. Frontend implementation (core pages)
4. RAG chatbot integration on landing page
5. Supabase integration + validation
6. QA + launch readiness
