# Product Requirements Document

## Kowa Website + RagChat Agent Proposal

Prepared for: CEO, Kowa Trade and Commerce Co., Ltd.  
Prepared on: April 9, 2026  
Prepared by: Codex working draft based on repo requirements, company-profile PDFs, and legacy-site alignment

---

## 1. Executive Summary

Kowa needs a premium multilingual website that explains the company clearly before asking visitors to use chat. The current opportunity is not only to modernize design, but to turn the website into a business development surface that communicates Kowa's credibility, business lines, and international operating model in a way that is easy for buyers, partners, and investors to understand.

The proposed experience should position Kowa as a Tokyo-based trading and resource-circulation company with strengths in recycled plastics, processing, machinery, and cross-border trade. The website should first establish trust through strong corporate storytelling, then let the RagChat Agent answer deeper questions, guide visitors to the right business lane, and convert qualified interest into handoff-ready leads.

This document proposes what the Kowa website should cover, what the RagChat Agent should do, what technical architecture should support it, and how success should be measured.

## 2. Business Context and Source Basis

The proposal should remain grounded in Kowa's verified business profile.

- Kowa Trade and Commerce Co., Ltd. was established in 1994.
- Head office is in Mita, Minato-ku, Tokyo.
- Capital is 50 million JPY.
- President is listed as Y.C. Lee.
- Core business includes plastic recycling, recycled resin handling, processing, machinery import/export, and overseas trade.
- Company materials also reference warehousing, crushing, pellet-related operations, and export of Japanese products to China and Southeast Asia.

Primary source basis for business copy:

- `pdfs/Kowa Company profile.pdf`
- `pdfs/広和通商会社案内.pdf`
- `data/sources.json`
- `https://kowatrade.com/` legacy site for business alignment

## 3. Product Vision

Build a website that does three jobs at once:

1. Present Kowa as a credible, established, international trading company.
2. Explain Kowa's business scope in a clear structure that non-Japanese visitors can understand quickly.
3. Use a grounded RagChat Agent to answer questions, collect lead details, and route serious inquiries into a managed follow-up workflow.

## 4. Goals

- Launch a premium homepage that explains who Kowa is, what Kowa does, and why the company is credible.
- Separate high-level company narrative from deeper profile and product detail, so the site feels organized rather than overloaded.
- Provide a multilingual experience in English, Japanese, and Chinese.
- Introduce a non-blocking RagChat Agent that supports information retrieval, lead capture, and office handoff.
- Build an admin-ready content and retrieval workflow so the site can be maintained without rewriting the product later.

## 5. Target Audiences

### Primary

- Buyers looking for recycled plastic materials, resin supply, or related sourcing support
- Overseas partners seeking a Japanese trading company with export experience
- Manufacturers evaluating machinery, processing support, or supply-chain partners

### Secondary

- Prospective distributors and commercial partners
- Investors, corporate visitors, and potential recruits
- Internal office staff who need qualified inbound inquiries routed cleanly

## 6. Core Website Narrative

The homepage should answer these questions in order:

1. Who is Kowa?
2. What is Kowa's business?
3. What business lanes does Kowa operate?
4. Why should a visitor trust Kowa?
5. Where should the visitor go next: company profile, products, or chat?

The recommended narrative sequence on `/`:

- Hero: Kowa Trade & Commerce as a Tokyo-based global trading and resource-circulation company
- Corporate summary: a concise explanation of plastics, machinery, and cross-border trade capabilities
- `WHAT IS KOWA'S BUSINESS?` block: a structured explanation of the operating model
- Business flow visualization: procurement, collection, sorting, crushing, pelletization, export, domestic/overseas sales
- Company profile snapshot: established year, capital, location, operating strengths
- Product and trade lanes preview
- Trust and contact section with access to RagChat Agent

## 7. Recommended Information Architecture

### Primary Navigation

- Home
- Company Profile
- Products
- News
- Contact / Talk to Aya
- Login for internal admin access

### Recommended Pages

#### 7.1 Home `/`

Purpose:
Introduce Kowa's business clearly and create enough trust that chat becomes useful instead of confusing.

Must include:

- Premium hero with strong corporate message
- `WHAT IS KOWA'S BUSINESS?` section
- Visual business flow or resource-circulation diagram
- Snapshot of company profile
- Product and trade-lane preview
- RagChat Agent entry point
- Footer with corporate navigation and contact basics

#### 7.2 Company Profile `/company_profile`

Purpose:
Give management-level and procurement-level visitors a structured corporate reference page.

Must include:

- Company overview
- President / company facts
- Established year, capital, head office address
- Company history timeline
- Business introduction
- Strengths in logistics, recycling, trading, and processing
- Related companies and operating footprint where verified

#### 7.3 Products `/products`

Purpose:
Show the main commercial categories in a scannable format and make it easier for users to ask precise questions in chat.

Recommended content:

- Recycled plastic materials
- Pellet and crushed-material categories
- Machinery and processing equipment
- Any featured export/import trade categories that can be verified
- Inquiry prompts tied to each product lane

#### 7.4 News `/news`

Purpose:
Keep the site current and create evidence that the company is active.

Recommended content:

- Company updates
- Trade or exhibition announcements
- Processing, sustainability, or recycling topics
- New product or shipment highlights

#### 7.5 Legacy / Access / Inquiry Utility Pages

Purpose:
Support location, inquiry, and archived content without cluttering the main story.

## 8. RagChat Agent Product Requirements

### 8.1 Role of the Agent

The RagChat Agent should not replace the website. Its role is to extend the website after the visitor understands the basics.

The agent should:

- Answer grounded questions about company profile, business scope, products, logistics, and contact paths
- Support English, Japanese, and Chinese conversations
- Ask clarifying questions when intent is commercial
- Collect structured lead information for serious inquiries
- Route qualified requests to office staff
- Show source or citation metadata when available

The agent should not:

- Invent product specifications or commercial promises
- Answer outside verified business scope
- Present legal, financial, or customs advice as authoritative
- Override human follow-up for serious commercial negotiation

### 8.2 Core User Flows

#### Informational Flow

- Visitor asks a company or business question
- Agent retrieves grounded source content
- Agent answers in the visitor's language
- Agent cites the source basis when possible

#### Commercial Qualification Flow

- Visitor asks for pricing, sourcing, machinery, partnership, shipping, or procurement support
- Agent classifies intent
- Agent collects name, company, email, phone, and country
- Agent prepares a handoff summary for staff
- Visitor confirms handoff
- Request appears in the admin inbox

#### Recovery Flow

- If grounding is weak or the source is missing, the agent says so clearly
- Agent offers next steps such as contact handoff or company-profile page guidance

### 8.3 Knowledge Sources for RAG

Phase 1 knowledge base should include:

- Company profile PDFs in `pdfs/`
- Verified excerpts from `https://kowatrade.com/`
- Curated product and company pages from the new site
- Approved operational FAQs
- Structured source records stored for retrieval and citation

Phase 2 can add:

- Product sheets
- Machinery catalogs
- Trade case studies
- Bilingual commercial documents
- News archive and announcements

## 9. Technical Architecture

### 9.1 Stack

- Frontend: Next.js + TypeScript (App Router)
- Persistence and operational data: Supabase
- Chat orchestration and RAG workflow endpoint: Dify API
- Admin and retrieval support: internal source-management workflow

### 9.2 High-Level System Diagram

```text
Visitor
  |
  v
Next.js Website
  |-- Marketing pages
  |-- Chat popup / chat widget
  |-- Locale handling
  |
  +--> API routes
         |
         +--> Dify RAG workflow
         |      |
         |      +--> Retrieved approved sources
         |
         +--> Supabase
                |-- contact captures
                |-- handoff queue
                |-- admin inbox
                |-- source metadata
                |-- analytics / runtime flags
```

### 9.3 Functional Requirements

- Strict typed request and response contracts for assistant APIs
- Environment-based configuration for Supabase and Dify keys
- Citation-capable chat responses
- Admin visibility into handoffs and assistant metrics
- Retrieval sources that can be published, unpublished, and reindexed

### 9.4 Non-Functional Requirements

- Premium visual design suitable for executive review
- Fast page load on desktop and mobile
- Responsive design across major screen sizes
- Clear loading, error, and fallback states in chat
- Multilingual support with stable content structure
- Safe handling of malformed inputs and basic rate limiting

## 10. Content Requirements

### Required Homepage Messages

- Kowa is an established Japanese trading company with global business links.
- Kowa operates in plastic recycling, recycled materials, machinery, and trade.
- Kowa contributes to resource circulation and effective reuse of limited resources.
- Kowa can serve as a bridge between Japanese supply capability and overseas demand.

### Required Trust Elements

- Established year
- Tokyo head office
- Capital
- President / leadership reference
- Real business-flow explanation
- Related company references where verified
- Contact path and office handoff capability

### Content Governance Rule

No homepage or chatbot claim should be published unless it can be mapped back to PDFs, validated legacy-site content, or approved internal business material.

## 11. Design Direction

The site should feel premium, calm, modern, and corporate. The visual language should support trust more than novelty.

Recommended design characteristics:

- Clean editorial layout with generous white space
- Strong typography and restrained color
- Corporate photography or diagrams over stock-heavy decoration
- High contrast and easy scanning for international users
- Chat UI that feels integrated, not gimmicky

## 12. Delivery Phases

### Phase 1: Corporate Foundation

- Finalize homepage narrative
- Launch company profile page
- Align multilingual copy
- Publish business flow section
- Ship basic RagChat Agent with grounded answers and citations

### Phase 2: Commercial Conversion

- Expand product pages
- Add richer lead capture and handoff workflow
- Improve admin inbox and source management
- Add better analytics for inquiry quality

### Phase 3: Scale and Optimization

- Add more source documents and product data
- Improve retrieval quality and answer coverage
- Add newsroom cadence and thought-leadership content
- Use analytics to refine page paths and agent prompts

## 13. Success Metrics

### Website Metrics

- Increase time on homepage and company-profile page
- Increase clicks from homepage to company profile, products, and chat
- Lower bounce rate on the primary landing experience

### Chatbot Metrics

- Number of grounded answers delivered
- Handoff confirmation rate
- Qualified inquiry count
- Rate-limit and failure rate
- Unanswered or weak-grounding query clusters for content improvement

### Business Metrics

- Number of sourcing inquiries
- Number of partnership inquiries
- Number of repeat visitors from target markets
- Reduction in manual back-and-forth for basic company questions

## 14. Out of Scope for Initial Launch

- Full ERP integration
- Automated quotation generation
- Unsupported language expansion beyond English, Japanese, and Chinese
- Open-ended generative answers beyond approved source material
- Complex customer account portal features

## 15. Risks and Mitigations

### Risk: unclear or inconsistent source content

Mitigation:
Use the PDFs and approved site content as the publishing baseline. Document extraction gaps explicitly instead of filling them with assumptions.

### Risk: chatbot gives answers that are too broad or commercial promises that are not approved

Mitigation:
Constrain prompts and retrieval to approved business content. Require clear fallbacks and human handoff for sensitive requests.

### Risk: website becomes chat-first and weakens corporate credibility

Mitigation:
Keep the corporate story primary on the homepage and make chat a secondary but visible conversion path.

### Risk: multilingual content drifts over time

Mitigation:
Use shared structured content models and editorial review for English, Japanese, and Chinese copy.

## 16. Decisions Needed from Kowa Leadership

- Approve the primary positioning statement for Kowa
- Approve the list of business lanes to feature publicly
- Confirm which products and machinery categories can be shown on launch
- Confirm whether president name and related company details should remain public
- Confirm lead-routing owners for commercial handoffs
- Confirm which internal materials can be added to the RAG knowledge base

## 17. Recommended Immediate Next Steps

1. Approve this PRD direction at executive level.
2. Lock the homepage narrative and company-profile facts.
3. Approve the Phase 1 content list for English, Japanese, and Chinese.
4. Finalize the source set for the initial RAG knowledge base.
5. Move into implementation with page-by-page content production, chatbot prompt tuning, and acceptance testing.

## 18. Conclusion

The Kowa website should function as both a corporate credibility platform and a commercial entry point. The strongest version of this product is not a chatbot alone. It is a premium multilingual website where the corporate story, business structure, and verified source material make the RagChat Agent more useful, more trustworthy, and more commercially effective.
