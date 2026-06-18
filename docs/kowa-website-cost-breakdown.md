# Kowa Website Cost Breakdown

## Executive Summary

This breakdown explains why the total project cost of **¥1,100,000 JPY** is reasonable for Kowa's website. The scope is not only a visual website build. It includes a premium multilingual corporate site, structured static and dynamic content, product extensibility, custom animated/media sections, embedding database setup, and an Agentic RAG chat agent connected to Kowa's business knowledge.

This is a **one-time website design, development, and RAG implementation cost**. The **¥1,100,000 total does not include monthly hosting**, domain fees, AI/API usage, Supabase usage, maintenance, or future feature expansion.

## Scope Basis

The estimate is based on the following delivery scope:

- Full website design and development using Next.js and TypeScript
- Premium UI/UX for a Japanese B2B trading and commerce company
- Public pages for homepage, company profile, products, machines, news, access, inquiry, and supporting company content
- English, Japanese, and Chinese language support
- Static company profile and business content derived from Kowa source materials
- Dynamic/extensible product content structure so more product categories, products, and visuals can be added later
- Product images, machine images, media treatment, carousel behavior, and animated business-flow presentation
- Embedding database and source structure for searchable company knowledge
- Agentic RAG chat agent for company, product, and inquiry questions
- Testing, responsive checks, deployment preparation, and final quality assurance

## Detailed Cost Breakdown

| Component | Scope Included | Why This Cost Makes Sense | Cost |
|---|---|---|---:|
| 1. Project discovery and business content architecture | Review of Kowa's business profile, legacy website context, company-profile PDFs, business categories, product structure, and page hierarchy. Defines what should appear on the homepage versus deeper pages. | This prevents the website from becoming a generic brochure. The company business model must be translated into clear site structure before design or RAG work can be reliable. | ¥80,000 |
| 2. Premium UI/UX design system | Overall visual direction, layout system, navigation, footer, buttons, typography, spacing, responsive page shells, content rhythm, and polished B2B presentation. | A premium corporate website requires custom design decisions across many screens, not only a template skin. This is what makes the site feel credible to Japanese and international business visitors. | ¥150,000 |
| 3. Static company and marketing content pages | Homepage, company profile, business overview pages, access, inquiry, factory/business support pages, and structured copy blocks for Kowa's profile and operating model. | These pages carry the official company narrative and must be organized carefully so users understand Kowa before entering the chatbot. | ¥110,000 |
| 4. Dynamic and extensible product content | Products page structure, product category sections, product media data model, product carousel, machine/equipment page, and extensible content organization for adding more products or product visuals later. | The product area is built as a reusable structure, not a fixed one-off page. This supports future expansion when Kowa adds more resin, recycled material, machinery, or trading products. | ¥120,000 |
| 5. Image creation, media preparation, and animated content | Product image selection/preparation, visual staging, animated business-flow section, responsive carousel motion, image layout optimization, and premium media presentation across desktop and mobile. | Visual and animated content takes extra effort because it affects brand perception, page performance, responsiveness, and product clarity. This work is separate from normal page coding. | ¥120,000 |
| 6. Multilingual support: English, Japanese, Chinese | Locale structure, translated navigation labels, page copy organization, multilingual chat labels, language selector behavior, and UX consistency across the three supported languages. | Multilingual support multiplies content, testing, layout, and interaction complexity. Japanese, English, and Chinese text lengths behave differently and must be handled cleanly. | ¥120,000 |
| 7. Embedding database and knowledge base foundation | Supabase/Postgres schema planning, source document structure, retrieval source storage, company knowledge normalization, embedding-ready database tables, and runtime source handling. | The RAG system needs structured company knowledge and database support before the chat agent can answer accurately. This is backend architecture, not only frontend work. | ¥120,000 |
| 8. Agentic RAG development and chat agent | Popup chat UI, user/assistant conversation flow, session handling, retrieval behavior, grounded answers, citations/source metadata, confidence states, multilingual chat support, and inquiry qualification behavior. | This is the main Agentic RAG development effort. It combines UI, backend APIs, database-backed knowledge, retrieval logic, multilingual handling, and business inquiry logic. | ¥210,000 |
| 9. API integration and runtime configuration | Environment-based configuration, Dify/API-ready orchestration layer, chat API routes, source/runtime health checks, validation, error handling, and production guardrails. | External AI/RAG services must be wired safely through configuration instead of hardcoded credentials. This also makes the system maintainable after launch. | ¥70,000 |
| 10. QA, responsive testing, and launch readiness | Desktop/mobile checks, Playwright end-to-end tests, key user-flow validation, multilingual checks, chat behavior checks, build verification, and final cleanup. | A site with multilingual pages, dynamic products, media, and RAG chat needs validation across more than visual appearance. QA reduces launch risk. | ¥100,000 |
| **Total** |  |  | **¥1,100,000** |

## Summary by Work Type

| Work Type | Included Components | Cost |
|---|---|---:|
| Website strategy, UI, and static content | Discovery, design system, corporate pages | ¥340,000 |
| Dynamic product and media experience | Product extensibility, product/machine content, images, animated sections, carousel behavior | ¥240,000 |
| Multilingual experience | English, Japanese, and Chinese support across website and chat | ¥120,000 |
| Agentic RAG development and database intelligence layer | Embedding database foundation, knowledge base, Agentic RAG chat, API/runtime setup | ¥400,000 |
| **Total** |  | **¥1,100,000** |

## Monthly Hosting Cost Proposal

The build cost above does **not** include hosting. Hosting should be treated as a separate monthly operating cost because it depends on traffic, storage, build frequency, API usage, and whether the site is hosted on Vercel or AWS.

For budgeting, this proposal uses **1 USD = ¥160** and rounds to simple monthly yen estimates.

| Hosting Option | Monthly Estimate | What It Covers | Notes |
|---|---:|---|---|
| **Recommended: Vercel Pro** | **¥3,200/month** | Next.js website hosting, global CDN, automatic deployments, SSL, serverless functions, and included usage credit. | Best practical choice for this project because the website is built with Next.js. Lowest operational burden and easiest deployment workflow. |
| Vercel Hobby | ¥0/month | Basic Vercel hosting, CDN, deployments, and limited usage. | Cheapest possible option, but not ideal for a corporate client website because it is better suited for personal or early-stage projects. |
| AWS Amplify Hosting | Approximately ¥1,300 to ¥3,000/month for low traffic | Managed frontend hosting, build/deploy pipeline, CDN storage, transfer, SSR requests, and SSL. | Lower base cost than Vercel Pro for light usage, but monthly cost varies by traffic and build usage. |
| AWS Lightsail VPS | Approximately ¥800 to ¥1,920/month for entry-level Linux VPS | Low-cost virtual server hosting for the website runtime. | Cheapest AWS server option, but it requires more manual server setup, monitoring, deployment, security patching, and maintenance. |

## Recommended Hosting Choice

The best hosting recommendation for Kowa is:

> **Vercel Pro: approximately ¥3,200/month**

Reason:

- The site is built with **Next.js**, and Vercel is the most direct hosting platform for Next.js applications.
- It keeps monthly hosting predictable at a low starting cost.
- It includes CDN, SSL, deployments, preview builds, and serverless runtime support.
- It reduces maintenance work compared with running a manual AWS server.
- It is suitable for a professional company website while still staying low-cost.

If Kowa wants the absolute lowest possible monthly cost, **AWS Amplify Hosting** can be considered at roughly **¥1,300 to ¥3,000/month** for low traffic. However, the best balance of cost, reliability, and maintainability is **Vercel Pro at approximately ¥3,200/month**.

## Hosting Cost Exclusions

The monthly hosting estimate does not include:

- Domain registration or renewal
- Supabase paid plan usage
- Dify usage
- OpenAI or embedding model usage
- Email hosting
- Ongoing maintenance or support
- Large traffic spikes beyond included hosting limits
- Future storage-heavy media expansion

## CEO-Facing Explanation

The price makes sense because this project is not only a website. It combines four major deliverables:

1. **Premium corporate website**: a polished public site that explains Kowa's business clearly and professionally.
2. **Expandable product platform**: product and machine content can grow over time instead of being locked into one static page.
3. **Multilingual business presence**: English, Japanese, and Chinese support across the main user experience.
4. **Agentic RAG assistant**: a chat agent that uses Kowa's business knowledge to answer questions and support inquiries.

The explicit Agentic RAG development cost is listed in the table as:

- `¥210,000` for the chat agent build itself
- `¥120,000` for the embedding database and knowledge base foundation
- `¥70,000` for API integration and runtime configuration
- `¥400,000` combined for the full Agentic RAG development and database intelligence layer

A simple corporate website would cost less. This project is priced higher because it includes both the public website and the intelligence layer behind it: database, retrieval structure, multilingual chat behavior, citations, source grounding, and production-quality testing.

## Explicit Exclusions

The **¥1,100,000** scope does **not** include:

- Telegram integration
- Slack integration
- OpenClaw integration
- Monthly hosting or server fees
- Ongoing Supabase, Dify, OpenAI, or other API usage fees
- Ongoing maintenance retainer
- Future custom admin CMS beyond the current extensible content structure
- New product photography shoots unless quoted separately

## Recommended Commercial Positioning

Use this framing with the CEO:

> The ¥1.1M total covers a complete multilingual Kowa website plus a custom Agentic RAG chat system. The cost is justified because the project includes premium UI design, static and dynamic business content, expandable product support, custom media and animation work, an embedding database foundation, and AI chat functionality built around Kowa's own company knowledge.
