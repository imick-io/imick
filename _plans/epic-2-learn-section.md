# Plan: EPIC 2 — Learn Section (Blog & Snippets)

> Source PRD: `_prds/epic-2-learn-section.md`

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**:
  - `/learn` — hub page
  - `/learn/articles` — articles listing
  - `/learn/articles/[slug]` — article detail
  - `/learn/snippets` — snippets listing
  - `/learn/snippets/[slug]` — snippet detail
  - `/learn/tags/[tag]` — combined tag page (articles + snippets)
  - `/learn/articles/feed.xml` — articles RSS 2.0 feed
  - `/learn/snippets/feed.xml` — snippets RSS 2.0 feed
- **Header nav**: insert `Learn` between `About` and `Contact`
- **Content pipeline**: existing `content-collections` (`content/posts/*.mdx`, `content/snippets/*.mdx`); slug = filename without `.mdx`; `kebab-case-title.mdx` convention
- **Schema**:
  - **`posts`**: `title`, `excerpt`, `publishedAt`, `updatedAt?`, `category` (`opinion|technical|other`), `tags[]`, `coverImage?`. **No `status` field** — drafts inferred from missing/future `publishedAt`
  - **`snippets`**: `title`, `language`, `tags[]`, `description?`, `publishedAt` (added)
- **Publishing model**: `publishedAt <= now()` ⇒ published; missing or future ⇒ draft. Drafts hidden in prod (excluded from listings, RSS, sitemap; 404 on direct URL); visible in `next dev` with DRAFT badge. Same logic for snippets.
- **MDX rendering**: `rehype-pretty-code` (shiki) with dual light/dark themes tied to `next-themes`; every code block wrapped with copy-to-clipboard at the renderer level; markdown image syntax rewritten to optimized Next.js `<Image>` with build-time dimension inference
- **Image storage**: colocated under `/public/learn/[slug]/`
- **Cover image fallback**: dynamic image generated via Next.js Image Response API (category-colored gradient + post title); same renderer reused for OG images and tag-page OG
- **RSS**: two feeds, RSS 2.0 only, full HTML body in `content:encoded`
- **Out-of-scope (deferred)**: search, comments, standalone category/language pages, author block, inline tag chip filters, combined RSS feed, Atom, multi-part series, newsletter inline CTA (EPIC 4)

---

## Phase 1: Articles tracer bullet

**User stories**: 2, 6, 8, 10, 11, 14, 18, 35, 36, 37, 38, 39, 46

### What to build

Articles work end-to-end with one sample post readable on the deployed site. Update the `posts` schema to drop `status` and use `publishedAt` as the source of truth for draft state. Wire up the MDX pipeline with `rehype-pretty-code` for syntax highlighting and a wrapper that adds a copy-to-clipboard button to every code block. Build a basic `/learn/articles` listing (card grid showing title, excerpt, date, category badge — no filters, no pagination, no dynamic cover fallback yet) and a `/learn/articles/[slug]` detail page (breadcrumbs, title, meta line, cover image when present, MDX body). Add the `Learn` nav link between `About` and `Contact`. Implement the draft visibility rule: `publishedAt` missing or in the future ⇒ hidden from listings and 404 on direct URL in production; in `next dev`, drafts appear with a "DRAFT" badge. Drop a sample article into `content/posts/` to prove the pipeline.

### Acceptance criteria

- [ ] `posts` schema updated: `status` removed; `publishedAt` is the canonical publish date
- [ ] Sample article in `content/posts/` renders at `/learn/articles/[slug]`
- [ ] `/learn/articles` lists the sample article in a card grid
- [ ] Code blocks in MDX render with syntax highlighting and a working copy button
- [ ] Markdown images render via Next.js `<Image>` with auto-inferred dimensions
- [ ] Breadcrumbs `Learn / Articles / [title]` appear on the detail page
- [ ] `Learn` nav link appears between `About` and `Contact`
- [ ] An article with `publishedAt` in the future is excluded from the listing in production and returns 404 at its slug URL
- [ ] An article with `publishedAt` missing/future appears in the listing with a "DRAFT" badge under `next dev`
- [ ] Build passes; sample article is reachable end-to-end on a Vercel preview

---

## Phase 2: Snippets tracer bullet + `/learn` hub

**User stories**: 1, 22, 26, 27, 28

### What to build

Snippets work end-to-end and the `/learn` hub becomes a real landing page. Update the `snippets` schema to add `publishedAt`. Build basic `/learn/snippets` listing (cards show language badge, title, description, tags — no code preview yet) and `/learn/snippets/[slug]` detail page (breadcrumbs, language badge + date + tags meta, optional description as lede, MDX body with the same code-block copy-button treatment from Phase 1). Build the `/learn` hub page with three stacked sections: latest articles (up to 6), latest snippets (up to 6), and a "Classes — coming soon" teaser block. Drop a sample snippet into `content/snippets/`.

### Acceptance criteria

- [ ] `snippets` schema includes `publishedAt`
- [ ] Sample snippet renders at `/learn/snippets/[slug]`
- [ ] `/learn/snippets` lists the sample snippet in a card grid
- [ ] Snippet detail page has breadcrumbs, language badge, publish date, tags, optional description, and MDX body
- [ ] Code blocks on snippet pages have working copy buttons (same renderer as articles)
- [ ] `/learn` hub renders Latest Articles, Latest Snippets, and Classes teaser sections
- [ ] Hub "View all →" links route to `/learn/articles` and `/learn/snippets`
- [ ] Future-dated snippets are excluded from listings/hub in production

---

## Phase 3: Listing polish

**User stories**: 3, 4, 5, 7, 23, 24, 25, 40, 41, 48

### What to build

Make the listing pages production-quality. Add category pills to `/learn/articles` (`All | Opinion | Technical | Other`, single-select, URL-persisted via `?category=`) and language pills to `/learn/snippets` (derived dynamically from existing snippets, URL-persisted via `?language=`). Replace simple full-list rendering with "Load more" pagination at page size 12. Implement the dynamic cover-image fallback using the Next.js Image Response API (category-colored gradient + title overlay) for articles missing a `coverImage`. Upgrade snippet cards to show a syntax-highlighted preview of the first code block, clipped to ~10 lines. Add empty-state placeholders for both listings ("First article coming soon" / "First snippet coming soon").

### Acceptance criteria

- [ ] Category pills on `/learn/articles` filter the grid; URL reflects `?category=`
- [ ] Language pills on `/learn/snippets` filter the grid; URL reflects `?language=`
- [ ] Language pill list is derived from currently published snippets (no empty filters)
- [ ] "Load more" button appears when there are more than 12 items and reveals the next 12
- [ ] Articles without `coverImage` show a generated fallback image with title and category color
- [ ] Snippet cards show a syntax-highlighted preview of the first code block (≤10 lines)
- [ ] Both listings show a friendly empty-state placeholder when zero published items exist
- [ ] Filter state survives a page refresh and is shareable via URL

---

## Phase 4: Detail page polish

**User stories**: 9, 12, 13, 15, 16, 21, 29, 42, 47

### What to build

Bring detail pages to production polish. Add a sticky right-rail table of contents on `/learn/articles/[slug]` auto-generated from H2/H3 headings (collapsed/hidden on mobile). Implement the custom MDX component set: `<Callout>` (info/warn/tip/danger), `<Image>` (already wired via markdown rewrite), `<Video>` (YouTube embed), `<Tweet>` (X embed). Enable line highlighting and filename labels in `rehype-pretty-code` (`\`\`\`ts title="foo.ts" {1,3-5}`). Add related-content blocks: 3 articles matched by tag overlap on article pages; 3 snippets matched by overlapping language + tags on snippet pages. Add share buttons to article footers (X, LinkedIn, Copy Link — articles only, not snippets). Add a "View source on GitHub" link in the footer of every article and snippet detail page (deep-linking to the MDX file in the repo); add the GitHub repo URL to `siteConfig`. Display "Updated <date>" below the published date when `updatedAt` is set. Show reading time (200 wpm) on article listing cards and detail meta — not on snippets.

### Acceptance criteria

- [ ] Article detail pages show a sticky right-rail TOC built from H2/H3 headings; hidden on mobile
- [ ] `<Callout type="info|warn|tip|danger">` renders distinct styling for each variant
- [ ] `<Video>` and `<Tweet>` render embedded YouTube and X content
- [ ] Code blocks support `title="..."` filename labels and `{1,3-5}` line-highlight syntax
- [ ] Article detail pages show 3 related articles ranked by tag overlap
- [ ] Snippet detail pages show 3 related snippets ranked by language + tag overlap
- [ ] Article footer renders X, LinkedIn, and Copy Link share buttons; clicks behave correctly
- [ ] "View source on GitHub" link in article and snippet footers points to the correct MDX file
- [ ] `siteConfig` exposes the repo base URL
- [ ] Articles with `updatedAt` show "Updated <date>" below the publish date
- [ ] Reading time appears on article listing cards and detail meta; not on snippets

---

## Phase 5: Tag pages

**User stories**: 17

### What to build

Introduce `/learn/tags/[tag]` as a standalone, indexed destination combining articles and snippets sharing a tag. Page renders two sections — "Articles" (article card layout) and "Snippets" (snippet card layout) — each omitted if empty. Sort within each section by `publishedAt` desc; both sections support "Load more" using the same page size (12) as the parent listings. Tag chips wherever they appear (cards, meta lines on detail pages) navigate here. Custom title and meta description per tag for SEO. Generate an OG image per tag page (tag name overlaid on the standard fallback design). Return 404 for tag URLs that don't match any published content.

### Acceptance criteria

- [ ] `/learn/tags/[tag]` renders both Articles and Snippets sections when content exists
- [ ] Empty section is omitted (e.g., a tag with only articles shows no Snippets header)
- [ ] Each section paginates independently with "Load more" at page size 12
- [ ] Tag chips on cards and detail meta lines link to `/learn/tags/[tag]`
- [ ] Page has a custom `<title>` and meta description referencing the tag name
- [ ] An OG image is generated per tag page (tag name overlaid)
- [ ] A tag with no published articles or snippets returns 404

---

## Phase 6: SEO + RSS

**User stories**: 19, 20, 30, 31, 32, 33, 34, 43, 44, 45

### What to build

Make every published page indexable and subscribable. Extend `sitemap.ts` to include every published article, every published snippet, the listing pages (`/learn`, `/learn/articles`, `/learn/snippets`), and every tag page that has at least one published item; `lastModified` derives from `updatedAt || publishedAt`. Add per-content OG images: use `coverImage` when present, otherwise the dynamic fallback renderer from Phase 3 — one pipeline serves listing fallbacks, OG images, and tag-page OG. Add Twitter card metadata (`summary_large_image`) to article, snippet, and tag pages. Add JSON-LD structured data: `Article` for posts, `TechArticle` for snippets. Implement two RSS 2.0 feeds at `/learn/articles/feed.xml` and `/learn/snippets/feed.xml` with title, link, `pubDate`, `description` (excerpt for articles, description for snippets), and full HTML-rendered body in `content:encoded`. Add `<link rel="alternate" type="application/rss+xml">` discovery tags to the relevant listing and detail pages. Add a visible RSS icon button on each listing page linking to its feed.

### Acceptance criteria

- [ ] Sitemap includes every published article, snippet, listing page, and tag page (with `lastModified` set correctly)
- [ ] Drafts/future-dated content is excluded from the sitemap
- [ ] Article pages emit `Article` JSON-LD; snippet pages emit `TechArticle` JSON-LD; both validate in Google's Rich Results Test
- [ ] Article, snippet, and tag pages emit Twitter card and OpenGraph meta tags
- [ ] OG image for a content URL uses `coverImage` when present, otherwise the dynamic fallback
- [ ] `/learn/articles/feed.xml` and `/learn/snippets/feed.xml` are valid RSS 2.0 with full HTML in `content:encoded`
- [ ] RSS feeds exclude drafts/future-dated content
- [ ] `<link rel="alternate">` tags on listing and detail pages point to the correct feed
- [ ] An RSS icon button is visible on each listing page and links to its feed
