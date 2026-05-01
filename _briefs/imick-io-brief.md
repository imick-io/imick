# imick.io — Product Brief

**Status:** Draft  
**Date:** 2026-05-01  
**Author:** Michael Boutin

---

## Overview

imick.io is an open-source personal portfolio and content platform built to establish a long-term developer brand while supporting a near-term job search targeting $300K+ roles and lucrative contracts. The site combines a polished resume/about section, a Learn section (blog + code snippets authored in MDX), a curated bookmark collection with reviews and ratings, and newsletter/community integrations via Beehiiv and Resend. Built on Next.js App Router, Tailwind CSS, shadcn/ui, Neon PostgreSQL, and Drizzle ORM, the platform is designed to compound over time — attracting recruiters through a premium portfolio, developers through consistent content, and collaborators through open-source visibility.

---

## Problem

There is no imick.io today. Without a dedicated portfolio and content home base, there is no canonical place for recruiters, developers, or collaborators to evaluate expertise, discover content, or subscribe to ongoing work. Every piece of content published on X, LinkedIn, or YouTube has no durable home, no SEO value accruing to a personal domain, and no mechanism to convert readers into newsletter subscribers or job leads. The cost of inaction is lost credibility, missed inbound opportunities, and no compounding content asset.

---

## Goals

1. Launch Phase 1 (resume + about + core pages) within 2 weeks of project start.
2. Enable a 1 blog post/week cadence from day one — MDX-first, no web interface required.
3. Reach 1,000 Beehiiv newsletter subscribers within 6 months of launch.
4. Receive at least one $300K+ job offer or equivalent lucrative contract within 6 months.
5. Generate consistent inbound engagement from developers and collaborators (≥5 meaningful DMs/month by month 3).

---

## Non-Goals

- No i18n or localization in this version.
- No paywalled or paid content (deferred to a future phase).
- No job board, freelance marketplace, or client-facing booking features.
- No comments section on blog posts or snippets.
- No multi-author or team features — single-author platform throughout.
- No dark/light mode toggle in Phase 1 (pick one and ship).

---

## Target Users

| Audience | What they care about |
|---|---|
| **Recruiters & hiring managers** | Fast credibility signals — experience timeline, tech stack, open-source work, professional presentation |
| **Fellow developers** | Quality blog content, reusable code snippets, curated tool discoveries, newsletter worth subscribing to |
| **Potential collaborators & sponsors** | Project fit, depth of expertise, GitHub presence, contact path |

---

## Success Metrics

| Metric | Target | Timeline |
|---|---|---|
| Phase 1 live and linked from LinkedIn/CV | ✓ shipped | Week 2 |
| Blog posts published | 52 posts | Month 12 (1/week) |
| Beehiiv newsletter subscribers | 1,000 | Month 6 |
| Job offer or contract closed | $300K+ | Month 6 |
| Inbound DMs from developers | ≥5/month | Month 3 |
| GitHub repo stars | Tracked (proxy for dev credibility) | Ongoing |

---

## EPICs

### EPIC 1 — Foundation & Portfolio
**Deliver the first shippable site:** homepage, resume/about, contact, sponsor link, core SEO, OG images, and sitemap. This is the Phase 1 release that unlocks all content and brand activity. Every subsequent EPIC depends on this being live.

### EPIC 2 — Learn Section (Blog & Snippets)
**MDX content pipeline** for blog posts and code snippets — listing pages, detail pages, tag/category filtering, RSS feed. No web interface; articles are authored locally and published via git commit. This enables the 1-article/week cadence from day one and is the primary content engine for developer audience growth.

### EPIC 3 — Bookmarks
**Curated link collection with admin CRUD**, Neon + Drizzle schema, better-auth-protected `/admin`, Google Sheet import script (bulk-seed existing list), microlink.io metadata fetching (title, description, logo, image, color palette), and a public filterable/sortable view with review flow (pros, cons, rating 1–5, long-form review text). Largest engineering surface area; isolated as its own EPIC due to DB, admin, and import complexity.

### EPIC 4 — Newsletter & Email
**Audience capture layer:** Beehiiv embed integration and `/newsletter` subscribe page, Resend-powered `/contact` form with email delivery. Short EPIC but critical path for converting readers into subscribers. Depends on Foundation being live.

### EPIC 5 — Classes (Future)
**Structured course content** added to the Learn section. Design and scope fully deferred until Phase 2 (Blog & Snippets) ships and the weekly content cadence is established. No decisions to make yet.

---

## Marketing & Content Strategy

### Launch (Week 1–2)
- Ship Phase 1. Post the launch on X and LinkedIn. Pin the post. Share the GitHub repo with a clean README.
- Add imick.io URL to LinkedIn profile, GitHub bio, and X bio immediately.

### Weekly Cadence (ongoing from Phase 2)
- Publish 1 blog post (MDX → commit → deploy).
- Cross-post the article as a thread on X. Share a condensed version on LinkedIn.
- Include the post in the Beehiiv weekly newsletter digest.
- Repurpose technical posts as YouTube screen-share/tutorial videos; link to imick.io in descriptions.

### Bookmark Growth Loop
- As the bookmarks collection grows, share a "5 tools I discovered this week" post on X weekly.
- Featured/reviewed bookmarks on the homepage create a reason to return.

### Newsletter Growth
- Use Beehiiv's referral program once subscriber count reaches 250.
- Position the newsletter as a curated developer digest: bookmarks + article summaries + opinions.
- Promote newsletter on every X thread and YouTube video description.

### GitHub
- Keep the repo public and well-documented — community stars and forks are credibility signals for recruiters evaluating open-source contributions.

---

## Open Questions

1. **Bookmark import format:** What columns does the Google Sheet have? (URL only, or name/category/tags too?) Determines whether the Phase 3 import script needs data-cleaning logic or can bulk-insert directly.
2. **PDF resume:** Static file uploaded manually to `/public`, or generated server-side from site data?
3. **Blog draft/published status:** Should MDX files support a `status: draft` frontmatter flag to prevent unpublished posts from appearing publicly?
4. **Design direction:** Is there a reference portfolio or aesthetic direction for Phase 1? (Dark default recommended for a premium dev feel.)
5. **Phase 1 target launch date:** Hard deadline, or ship when ready?
