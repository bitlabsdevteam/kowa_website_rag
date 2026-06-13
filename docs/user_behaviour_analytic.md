# User Behaviour Analytics Recommendation

## Executive Summary

For the Kowa marketing site, the recommended analytics approach is to use **Google Analytics 4 as the primary product and behaviour analytics platform**. It is the best fit for a multilingual Next.js marketing site because it gives the team a practical baseline for traffic measurement, page-level engagement, event tracking, acquisition analysis, and business outcome reporting without requiring Kowa to build a custom analytics pipeline.

**Supabase should not be used as the primary raw analytics store in v1.** Supabase remains a strong system for application data, operational workflows, and selected internal summary tables later, but it is not the right first-choice platform for frontend behaviour analytics. The lowest-friction path is to instrument the site with Google Analytics first, learn which decisions the team actually needs to support, and only mirror selected aggregates into Supabase later if internal reporting or operational joins become necessary.

## Recommended Stack

### Primary Platform

- **Google Analytics 4** for page views, acquisition reporting, event tracking, engagement reporting, key events, and dashboard-style analysis through standard reports and explorations.

### Supporting Systems

- **Next.js event instrumentation** for homepage sections, CTA clicks, locale changes, company-profile views, and chatbot entry points.
- **Supabase** only for selected internal summaries later, such as qualified inquiry counts, chat handoff outcomes, or weekly KPI snapshots that need to be joined with operational data.
- **Microsoft Clarity** only as an optional secondary UX diagnostic layer later if the team wants session replay or heatmap-style evidence in addition to Google Analytics reporting.

## Why This Is the Best Fit for This Next.js + Supabase Marketing Site

Google Analytics 4 fits this project because the site is primarily a marketing and business-development surface. Kowa needs to understand where visitors come from, which pages and homepage sections hold attention, which paths lead into chat or inquiry, and which traffic sources contribute to meaningful business actions.

Google Analytics 4 is the strongest v1 choice for these reasons:

- It gives Kowa a standard and widely adopted analytics foundation for **traffic, source attribution, page reporting, and event analysis**.
- It supports **automatic baseline measurement** through core page and engagement tracking, while still allowing custom events for section-level and chatbot-related behaviour.
- It is well-suited to answering practical questions such as:
  - Which traffic sources bring the most qualified visitors?
  - Which pages and homepage sections are seen most often?
  - Which CTA moves users into company-profile content, inquiry, or chat?
  - Which events should be treated as key business outcomes?
- It works well with **Next.js**, including client-side route changes and custom interaction tracking.
- It is a better fit than a self-built Supabase analytics pipeline when the immediate goal is business visibility rather than analytics infrastructure work.
- If Kowa later runs paid campaigns, Google Analytics can connect measurement more directly to the broader Google reporting and advertising ecosystem.

## Why Not To Use Supabase as the Primary Raw Analytics Store in v1

Supabase is a strong backend and operational database, but it is not the best primary system for raw user-behaviour analytics at this stage.

Using Supabase first would create avoidable overhead:

- The team would need to define, collect, store, deduplicate, query, and visualize behavioural event data largely on its own.
- Raw frontend events can become noisy and high-volume quickly, especially once page views, section exposure, CTA clicks, chat interactions, and multilingual navigation are tracked together.
- Product questions such as acquisition performance, event attribution, and behaviour reporting are easier to answer with a purpose-built analytics layer than with custom SQL and custom dashboards from day one.
- It would move effort away from decision-making and into infrastructure work before the team has validated the exact metrics it will use regularly.

Supabase becomes more useful after the first analytics loop is proven. At that point, selected data can be copied or summarized into internal reporting tables if Kowa wants business dashboards tied to CRM, handoff workflows, or other internal systems.

## Tracking Model

### Automatic Baseline Metrics

Track the standard site-level baseline automatically:

- Page views by route
- Sessions and engaged sessions
- Traffic source and campaign attribution
- Device and browser summaries
- Outbound clicks, file downloads, and baseline scroll measurement where relevant

This establishes the baseline picture of how visitors move through the site before deeper custom event analysis is added.

### Section-Level Engagement Events

To understand which parts of the homepage or supporting pages users value most, add explicit events for meaningful content exposure and interaction.

Recommended examples:

- `hero_viewed`
- `business_block_viewed`
- `resource_flow_viewed`
- `company_profile_preview_viewed`
- `products_preview_viewed`
- `chat_widget_opened`
- `chat_cta_clicked`
- `company_profile_cta_clicked`
- `products_cta_clicked`
- `locale_changed`

These events should fire based on real user exposure or interaction, not only on page load. For example, a section-level event is most useful when triggered after the section enters the viewport with a reasonable visibility threshold.

### Business Outcome Events

Track the actions that matter commercially:

- `inquiry_started`
- `inquiry_submitted`
- `chat_first_message_sent`
- `chat_handoff_requested`
- `chat_handoff_confirmed`
- `contact_detail_submitted`
- `company_profile_page_viewed`

Mark the most important of these as **key events** so they become the primary success measures in reporting.

## Definition of “Which Part Users Liked Most”

“Which part users liked most” should not be interpreted as a single metric. It should be defined as a combination of signals:

- **High section view rate**: a large share of users actually reached the section.
- **Strong engagement**: users spent time there, scrolled through it, or interacted with related CTAs.
- **High downstream action rate**: users who viewed that section were more likely to click into chat, company profile, products, or inquiry.

In practice, the best-performing section is the one that produces the strongest combination of:

1. High exposure
2. High interaction
3. High contribution to key business actions

This is a better definition than raw clicks alone, because some sections may build trust and influence later action without being the final click point.

## Privacy and Data-Handling Rules

The analytics implementation should stay conservative and business-appropriate:

- Do not send secrets, API keys, or internal system identifiers to analytics tools.
- Do not capture free-form personal information from inquiry or chat fields unless there is a clear operational need and explicit review.
- Avoid treating analytics as a shadow CRM.
- Keep chat analytics event-level where possible, such as tracking that a chat started or a handoff was confirmed, instead of forwarding message content by default.
- Review event parameters carefully so no personally identifiable information is passed into Google Analytics.
- Provide a clear cookie or tracking disclosure if required by the final compliance posture and deployment region.

## Suggested Dashboards

Create a small, decision-oriented dashboard set rather than a large reporting surface.

### 1. Website Overview Dashboard

- Sessions
- Engaged sessions
- Views by route
- Top traffic sources
- Top landing pages

### 2. Homepage Engagement Dashboard

- Section view rate by homepage block
- Scroll-depth proxy and engagement signals
- CTA click-through rate
- Chat open rate from homepage

### 3. Business Conversion Dashboard

- Chat first-message rate
- Inquiry start and submission rate
- Handoff confirmation rate
- Company-profile page views before conversion
- Key events by traffic source and locale

### 4. Content and Navigation Dashboard

- Company-profile page engagement
- Products page engagement
- Outbound click activity
- Navigation path toward inquiry or chat

## Alternatives Considered

### PostHog

PostHog is a strong product analytics platform and would be a reasonable alternative if the main priority were deeper product analytics, built-in funnel tooling, or a more product-led event model from the start. For this project, Google Analytics is the better primary choice because Kowa’s first need is marketing visibility, acquisition insight, and clear measurement of traffic-to-inquiry outcomes on a corporate website.

### Vercel Analytics

Vercel Analytics is lightweight and easy to add, but it is not the best primary solution for this project. It is useful for traffic and performance visibility, yet it is less suitable when the goal is to analyze custom events, section-level engagement, chatbot behaviour, and business outcome tracking in depth.

### Plausible

Plausible is clean, privacy-friendly, and simple to operate. It is a good option for teams that only need lightweight traffic analytics. It becomes limiting when the product requires more event modeling, key-event analysis, acquisition comparison, and deeper reporting on how users move from content to chat or inquiry.

### Microsoft Clarity

Microsoft Clarity is useful as a complementary UX diagnostic tool because session replay and heatmaps can reveal friction quickly. It is better treated as a secondary tool alongside Google Analytics rather than the primary source of truth for business reporting.

## Test and Validation Checklist

- Confirm the Google Analytics tag or Google Tag Manager setup loads correctly in production and preview environments.
- Verify page views fire correctly on Next.js route changes.
- Verify automatic baseline events are being collected as expected.
- Verify each section-level event triggers only once per intended exposure rule.
- Confirm CTA events are labeled consistently across locales.
- Test chat-related events from open to first message to handoff confirmation.
- Mark the correct business events as key events.
- Confirm no personal or sensitive chat content is unintentionally sent.
- Validate report numbers against manual click-path checks during QA.
- Review event naming before launch so the schema remains stable.

## Final Recommendation

Use **Google Analytics 4 first** as the primary analytics platform for the Kowa website. It provides the best balance of implementation speed, reporting familiarity, acquisition insight, and business-outcome measurement for a multilingual marketing site with a chatbot-led conversion path.

Use **Supabase later only for selected aggregate or internal reporting needs**, such as weekly KPI snapshots, inquiry outcome summaries, or operational dashboards that need to join analytics-derived metrics with business records.

If Kowa later needs replay or heatmap evidence, add **Microsoft Clarity as a secondary diagnostic layer**, not as the primary reporting system.

## Next-Step Implementation Note

Implement a lean analytics v1:

1. Add Google Analytics 4 to the Next.js app.
2. Enable and validate the default baseline measurement.
3. Track page views and core CTA events.
4. Add viewport-based events for the key homepage sections.
5. Mark inquiry and chatbot outcome events as key events.
6. Build the core dashboards and review them after initial traffic.

This keeps the first release focused on actionable measurement rather than analytics infrastructure.
