# PRD: EPIC 2 — Learn Section (Blog & Snippets)

**Status:** Draft
**Date:** 2026-05-02
**Brief:** `_briefs/imick-io-brief.md`

---

## Problem Statement

EPIC 1 shipped the portfolio shell, but imick.io has no content engine. Without a place to publish articles and code snippets, the brief's core growth loop — 1 post/week compounding into SEO traffic, newsletter subscribers, and developer credibility — cannot start. Recruiters arriving on the site see only the resume; developers have no reason to subscribe, return, or share. Every week without a content section is a week of lost compounding: lost SEO equity to a personal domain, lost X/LinkedIn cross-post material, lost Beehiiv funnel input, and lost evidence of consistent technical output for hiring managers evaluating the candidate.

---

## Solution

Ship a `/learn` section: an MDX-first content pipeline for **articles** (long-form posts with categories) and **snippets** (short, copy-pastable code with descriptions). Authors write `.mdx` files locally, commit, push — content deploys with the site. The section includes:

- A `/learn` hub page surfacing the latest content from each type and a teaser for future Classes.
- Listing pages (`/learn/articles`, `/learn/snippets`) with filtering by category/language, "Load more" pagination, and image-grid card layouts.
- Detail pages with sticky table of contents, syntax-highlighted code with copy buttons, related-content blocks, breadcrumbs, and a "View source on GitHub" link.
- Standalone tag pages (`/learn/tags/[tag]`) combining articles and snippets sharing a tag — SEO-indexed destinations.
- Two RSS feeds (articles and snippets) with full-content HTML.
- Sitemap, JSON-LD structured data, dynamic OG images, and date-based publishing (set `publishedAt` in the future to schedule a post).
- A new "Learn" link in the header nav.

The section is built on the existing `content-collections` pipeline already wired into the project. The result is a content home that requires zero web UI to publish, supports the brief's 52-posts-in-12-months cadence, and accrues SEO and audience equity to imick.io from day one.

---

## User Stories

### Visitor / Developer (reading articles)

1. As a developer, I want to land on `/learn` and immediately see the most recent articles and snippets, so that I can sample what kind of content this site publishes.
2. As a developer, I want to navigate to `/learn/articles` and see articles in a card grid with cover images, so that I can scan recent posts visually.
3. As a developer, I want to filter articles by category (Opinion, Technical, Other), so that I can focus on the type of content I'm in the mood for.
4. As a developer, I want category filter state to live in the URL, so that I can share or bookmark a filtered view.
5. As a developer, I want to click "Load more" to see older articles, so that I'm not forced into a paginated index page experience.
6. As a developer, I want each article card to show its title, excerpt, publish date, category badge, tags, and reading time, so that I can triage what to read next.
7. As a developer, I want articles without a cover image to still look good in the grid, so that the listing doesn't have visual holes.
8. As a developer, I want to click an article and read it on a clean detail page, so that I can focus on the content.
9. As a developer reading a long article, I want a sticky table of contents on the right side of the page, so that I can jump to a section without scrolling.
10. As a developer, I want every code block in an article to have a copy button, so that I can grab snippets without manually selecting text.
11. As a developer, I want code blocks to be syntax-highlighted in a theme that matches the site's light/dark mode, so that the page feels native.
12. As a developer, I want code blocks to support an optional filename label and line highlighting, so that tutorials are easier to follow.
13. As a developer, I want callouts (info, warn, tip, danger) to be styled distinctly inside articles, so that important asides don't get lost in body text.
14. As a developer, I want images in articles to be optimized (Next.js `<Image>`) without the author needing to specify sizes, so that pages load fast.
15. As a developer, I want to see related articles at the bottom of a post, so that I can keep reading without bouncing.
16. As a developer, I want to share an article via X, LinkedIn, or Copy Link from the footer, so that I can spread it without typing the URL.
17. As a developer, I want to click a tag in a post or on a card and land on a dedicated tag page combining all articles and snippets sharing that tag, so that I can explore a topic deeply.
18. As a developer, I want to see breadcrumbs on every detail page, so that I can navigate up to the listing or hub easily.
19. As a developer, I want to subscribe to articles via RSS, so that new posts arrive in my reader automatically.
20. As a developer, I want the article RSS feed to contain full content, so that I can read entirely in my RSS reader.
21. As a developer, I want to click a "View source on GitHub" link at the bottom of an article, so that I can see the raw MDX or open a PR for typos.

### Visitor / Developer (browsing snippets)

22. As a developer, I want to navigate to `/learn/snippets` and see snippets in a card grid, so that I can browse reference code at a glance.
23. As a developer, I want each snippet card to show a syntax-highlighted preview of its first code block, so that I can judge usefulness before clicking.
24. As a developer, I want to filter snippets by language (TypeScript, Python, SQL, etc.), so that I can find what's relevant to my stack.
25. As a developer, I want the language list to be derived dynamically from existing snippets, so that I never see an empty filter category.
26. As a developer, I want to click a snippet and land on a detail page focused on the code, so that I can read and copy quickly.
27. As a developer, I want every code block in a snippet detail page to have a copy button, so that I can grab the code in one click.
28. As a developer, I want the snippet detail page to show the language, publish date, and tags clearly, so that I have context for what I'm reading.
29. As a developer, I want to see related snippets at the bottom (matched by overlapping language and tags), so that I can find variations or follow-ups.
30. As a developer, I want to subscribe to snippets via a separate RSS feed, so that I can follow snippets without articles cluttering the feed.

### Visitor / Recruiter

31. As a recruiter, I want to see that the candidate publishes regularly on technical topics, so that I can evaluate communication skill and depth.
32. As a recruiter, I want article and snippet pages to load fast and look polished, so that the candidate's brand feels premium.
33. As a recruiter, I want shared `/learn/*` links in Slack or email to show a branded preview image, so that the link looks credible.
34. As a recruiter, I want articles to be discoverable via Google with rich results (author, date, image), so that I can find the candidate by topic searches.

### Site Owner (Michael)

35. As the site owner, I want to write a new article by creating a `.mdx` file in `content/posts/`, so that publishing requires no web UI.
36. As the site owner, I want to schedule an article by setting `publishedAt` to a future date, so that I can write ahead and have posts auto-publish.
37. As the site owner, I want a missing `publishedAt` to keep the post hidden in production, so that incomplete drafts don't ship by accident.
38. As the site owner, I want drafts to be visible during local development (`next dev`) with a "DRAFT" badge, so that I can preview them before scheduling.
39. As the site owner, I want hitting a draft URL in production to return 404, so that nothing leaks.
40. As the site owner, I want a `coverImage` to be optional, so that I can skip it for posts where I don't have a great visual without breaking the listing layout.
41. As the site owner, I want a fallback cover image generated automatically from the post title and category color, so that every card looks intentional.
42. As the site owner, I want post images to live colocated under `/public/learn/[slug]/`, so that they're version-controlled with the post and easy to reference.
43. As the site owner, I want each article and snippet auto-included in the sitemap, so that search engines find new content without manual updates.
44. As the site owner, I want each article and snippet to emit JSON-LD structured data, so that Google shows rich results in SERPs.
45. As the site owner, I want OG images to use the post's `coverImage` when set and fall back to a dynamic image when not, so that every shared link has a polished preview.
46. As the site owner, I want a "Learn" link added to the header nav between "About" and "Contact" when EPIC 2 ships, so that visitors can find the new section.
47. As the site owner, I want updating a post by changing its frontmatter `updatedAt` to surface "Updated <date>" on the detail page and update the sitemap `lastModified`, so that meaningful revisions get re-indexed.
48. As the site owner, I want listing pages to render a friendly placeholder when there are no published posts yet, so that the section can ship before the first post lands.

---

## Implementation Decisions

### Routing Structure

- `/learn` — hub page; "Latest Articles" (3–6 cards), "Latest Snippets" (3–6 cards), Classes teaser block.
- `/learn/articles` — articles listing.
- `/learn/articles/[slug]` — article detail.
- `/learn/snippets` — snippets listing.
- `/learn/snippets/[slug]` — snippet detail.
- `/learn/tags/[tag]` — combined tag page (articles + snippets sharing the tag).
- `/learn/articles/feed.xml` — articles RSS 2.0 feed.
- `/learn/snippets/feed.xml` — snippets RSS 2.0 feed.

Header nav: insert "Learn" between "About" and "Contact".

### Content Schema

Both collections in `content-collections.ts`:

- **`posts`** (articles):
  - `title` (string), `excerpt` (string), `publishedAt` (string, ISO date), `updatedAt` (string, optional), `category` (enum: `opinion | technical | other`), `tags` (string array), `coverImage` (string, optional).
  - **Removed:** `status` field. Drafts are detected by `publishedAt` being missing or in the future.
- **`snippets`**:
  - `title` (string), `language` (string), `tags` (string array), `description` (string, optional), `publishedAt` (string, ISO date).
  - **Added:** `publishedAt`. No status/draft state — once committed, snippets are live.

Slug = filename without `.mdx`. Filename convention: `kebab-case-title.mdx`. No frontmatter slug field.

### Publishing & Drafts

- An article is **published** when `publishedAt` exists and is `<= now()` at request time.
- An article is a **draft** when `publishedAt` is missing or in the future.
- Drafts are excluded from listings, tag pages, RSS, sitemap, and 404 on direct URL in production.
- In `next dev` mode, drafts appear in listings with a "DRAFT" badge and are accessible by URL for preview.
- Snippets have no draft state — committed = published. Snippets with `publishedAt` in the future also wait until that date (consistent with articles).

### MDX Pipeline

- **Syntax highlighting:** `rehype-pretty-code` (wraps shiki) with dual light/dark theme support tied to `next-themes`. Supports per-line highlighting, filename titles (`\`\`\`ts title="foo.ts"`), and inline code highlighting.
- **Custom MDX components:**
  - `<Callout type="info|warn|tip|danger">` — styled aside blocks.
  - `<Image>` — Next.js `<Image>` with auto-inferred dimensions for local images. Markdown image syntax (`![alt](src)`) is rewritten to use this component.
  - `<Video>` — YouTube embed wrapper.
  - `<Tweet>` — embedded tweet/X post.
  - Code blocks (` ``` `) — automatically wrapped with a copy-to-clipboard button at the MDX renderer level (applies to articles and snippets identically).
- **Images:** colocated under `/public/learn/[slug]/`, referenced by relative path. Build-time dimension inference for `<Image>` optimization.

### Article Listing Page (`/learn/articles`)

- **Filters:** Category pills at the top (`All | Opinion | Technical | Other`), single-select. State persisted in URL search params (`?category=technical`). No tag chips here — tag interaction lives at `/learn/tags/[tag]`.
- **Layout:** Card grid, 3 columns desktop / 1 column mobile, cover image on top, then category badge, title, excerpt, publish date, reading time. Tags shown as small pills below the excerpt — clicking a tag navigates to `/learn/tags/[tag]`.
- **Sort:** `publishedAt` descending.
- **Pagination:** "Load more" cursor button. Page size: 12.
- **Cover image fallback:** When `coverImage` is missing, render a generated image (same Next.js Image Response API used for OG) with category-colored gradient and post title overlaid.
- **RSS link:** `<link rel="alternate" type="application/rss+xml">` in `<head>`; visible RSS icon button on the page.
- **Empty state:** When zero published posts exist, render a friendly placeholder block ("First article coming soon") in place of the grid.

### Snippet Listing Page (`/learn/snippets`)

- **Filters:** Language pills derived dynamically from existing snippets (`All | TypeScript | Python | SQL | …`), single-select, URL-persisted (`?language=typescript`). No tag chips inline.
- **Layout:** Card grid, 3 columns desktop / 1 column mobile. Each card: language badge, title, description, then a syntax-highlighted preview of the first code block (clipped to ~10 lines). Tags as small pills below.
- **Sort:** `publishedAt` descending.
- **Pagination:** "Load more", page size 12.
- **RSS link:** as above, pointing to `/learn/snippets/feed.xml`.
- **Empty state:** parallel to articles.

### Article Detail Page (`/learn/articles/[slug]`)

- **Page structure (top → bottom):**
  1. Breadcrumbs: `Learn / Articles / [post title]`.
  2. Title (h1).
  3. Meta line: publish date, category badge, tags (linking to `/learn/tags/[tag]`), reading time. If `updatedAt` is set, "Updated <date>" appears below.
  4. Cover image (when present) — full-width, below the meta.
  5. MDX body.
  6. Footer: share buttons (X, LinkedIn, Copy Link), "View source on GitHub" link, related articles (3 cards, matched by tag overlap).
- **Sticky right-rail TOC:** auto-generated from H2/H3 headings in the MDX body; collapsed/hidden on mobile.
- **No author block.**
- **No newsletter inline CTA** in EPIC 2 (deferred to EPIC 4 for Beehiiv embed).

### Snippet Detail Page (`/learn/snippets/[slug]`)

- **Page structure (top → bottom):**
  1. Breadcrumbs: `Learn / Snippets / [snippet title]`.
  2. Title (h1).
  3. Meta line: language badge, publish date, tags (linking to `/learn/tags/[tag]`).
  4. Description (when present) as a lede paragraph.
  5. MDX body (every code block has a copy button via the shared MDX renderer).
  6. Footer: "View source on GitHub" link, related snippets (3 cards matched by overlapping language + tags).
- **No TOC** on snippets.
- **No reading time** on snippets.
- **No share buttons** on snippets.
- **No author block.**

### Tag Page (`/learn/tags/[tag]`)

- Page title: "Tagged <tag>" (or similar). Custom `<title>` and meta description for SEO.
- Renders both articles and snippets sharing this tag. Two sections on the page: "Articles" (using the article card layout) and "Snippets" (snippet card layout). Each section omitted if empty.
- Sort within each section: `publishedAt` desc.
- Pagination: "Load more" within each section, same page size logic.
- Included in sitemap (one entry per tag with at least one published item).

### Hub Page (`/learn`)

- Three stacked sections:
  1. "Latest Articles" — 6 article cards (using the listing card layout) + "View all →" link to `/learn/articles`.
  2. "Latest Snippets" — 6 snippet cards (using the listing card layout) + "View all →" link to `/learn/snippets`.
  3. "Classes — coming soon" — a teaser block (placeholder for EPIC 5).

### RSS Feeds

- **Format:** RSS 2.0.
- **Number:** two — `/learn/articles/feed.xml` and `/learn/snippets/feed.xml`. No combined feed.
- **Content:** title, link, `pubDate`, `description` (excerpt for articles, description for snippets), full HTML-rendered content (`content:encoded`).
- **Discovery:** `<link rel="alternate" type="application/rss+xml">` in the `<head>` of relevant listing and detail pages.
- **Visible link:** RSS icon button on listing pages.

### SEO, Sitemap, OG, Structured Data

- **Sitemap (`sitemap.ts`):** extend with every published article, every published snippet, the listing pages (`/learn`, `/learn/articles`, `/learn/snippets`), and every tag page that has at least one published item. `lastModified` = `updatedAt || publishedAt`.
- **OG images:** per article/snippet — use `coverImage` when present, otherwise generate dynamically (same pipeline as the listing fallback). One Image Response API renderer serves both purposes.
- **Article metadata:** title, description (= excerpt), canonical URL, OpenGraph (`type=article`, `publishedTime`, `modifiedTime`, `tags`, `author`), Twitter card (`summary_large_image`), and JSON-LD `Article` structured data.
- **Snippet metadata:** title, description, canonical URL, OG (`type=article`), Twitter card, and JSON-LD `TechArticle` structured data.
- **Tag page metadata:** title, description, canonical URL, OG with a generated cover image (tag name overlaid), no JSON-LD.

### Reading Time, Dates, Updated Handling

- **Reading time:** auto-computed from MDX body word count at 200 wpm. Shown on article listing cards and detail meta. Not shown on snippets.
- **Date format:** long form, e.g., "May 2, 2026". Same format on listings and detail pages.
- **`updatedAt`:** when present, displayed as "Updated <date>" below the published date on the detail page. Listings remain sorted by `publishedAt`. `updatedAt` flows to sitemap `lastModified`.

### Navigation Update

- Header nav (defined in `app/layout.tsx`): insert `<NavLink href="/learn">Learn</NavLink>` between the existing About and Contact links.

### "View Source on GitHub" Link

- A small link rendered in the footer of every article and snippet detail page pointing to the MDX file in the repo on GitHub (e.g., `https://github.com/<org>/<repo>/blob/main/content/posts/<slug>.mdx`). The base URL is configurable via `siteConfig`.

### Empty States

- When `/learn/articles` has zero published posts, render a placeholder ("First article coming soon — subscribe to know when") in place of the grid.
- When `/learn/snippets` has zero published posts, render a parallel placeholder.
- When `/learn/tags/[tag]` is requested for a non-existent tag, return 404.

### 404 Handling

- Standard `not-found.tsx` for unknown article slugs, snippet slugs, and tag pages. No custom search-and-suggest UI in this EPIC.

---

## Out of Scope

- **Newsletter / Beehiiv embed** — deferred to EPIC 4. Article footers reserve a slot but do not render a CTA in EPIC 2.
- **Search** — no client-side search across content. Tag pages, category pills, and language pills cover discovery. Revisit when content count justifies it (~20+ posts).
- **Comments** — explicitly out per the brief.
- **Standalone category pages** (`/learn/categories/[category]`) — only three values; inline pill filters are sufficient.
- **Standalone language pages** (`/learn/snippets/languages/[language]`) — same reasoning.
- **Author block** — single-author site; URL/branding makes authorship obvious.
- **Inline tag chip filter on listing pages** — replaced by standalone `/learn/tags/[tag]` pages.
- **Combined RSS feed** — articles and snippets stay separate.
- **Atom feed** — RSS 2.0 only.
- **Series / multi-part articles** — not supported in this EPIC; each article is standalone.
- **Print stylesheet** — not in scope.
- **Heavy MDX components** (CodeTabs, Steps, Comparison) — defer until a real authoring need surfaces.
- **Floating share rail** — footer share buttons only.
- **Share buttons on snippets** — articles only.
- **Lead capture / gated content** for articles or snippets.
- **Classes section** — EPIC 5; only a teaser block on the `/learn` hub.
- **Custom 404 with search-and-suggest** — standard `not-found.tsx`.
- **CMS or web-based authoring UI** — MDX + git only.
- **Scheduled-publish ISR/cron infrastructure** — date-gating is evaluated at request time against `publishedAt`; no separate scheduler needed.

---

## Further Notes

- The `content-collections` package is already installed and configured (`content-collections.ts`, `next.config.ts`). The schema needs the changes described above (drop `status` from `posts`, add `publishedAt` to `snippets`).
- New dependencies anticipated: `rehype-pretty-code` (and `shiki`), an MDX runtime (`@content-collections/mdx` or equivalent already present in the pipeline), `rehype-slug`, `rehype-autolink-headings` (for TOC anchors), `image-size` or equivalent for build-time image dimension inference. Confirm against the existing content-collections setup before adding redundant packages.
- The dynamic OG / cover-image fallback renderer should be implemented once and reused for: (a) listing card fallbacks, (b) per-post OG images, (c) tag page OG images.
- The `<head>` `<link rel="alternate">` RSS discovery tags must be added to the relevant listing and detail pages.
- The `siteConfig` (`lib/config.ts`) needs a new entry for the GitHub repo URL used by the "View source on GitHub" links.
- The "Learn" nav link is added in this EPIC; no other Phase 1 navigation changes.
- Newsletter (EPIC 4) and Bookmarks (EPIC 3) are independent of this EPIC and can ship in any order after EPIC 2.
- Beehiiv inline CTA in article footers should be added in EPIC 4 as a non-breaking change to a reserved footer slot.
