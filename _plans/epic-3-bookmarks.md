# Plan: EPIC 3 — Bookmarks

> Source PRD: `_prds/epic-3-bookmarks.md`

## Architectural decisions

- **Routes (public):** `/bookmarks` (hub) · `/bookmarks/[category]` (listing) · `/bookmarks/[category]/[slug]` (detail)
- **Routes (admin):** `/admin/login` · `/admin/bookmarks` · `/admin/bookmarks/new` · `/admin/bookmarks/[id]/edit`
- **Schema:** Single `bookmarks` table — uuid pk, url, slug (unique), title, description, logo_url, image_url, color_hex, category (enum), tags (string array), pros (nullable text), cons (nullable text), rating (nullable int 1–5), review_text (nullable text), published (bool, default false), created_at, updated_at. `reviewed` is derived at query time (rating or review_text is non-null).
- **Categories (enum + URL slugs):** `dev-tools` · `libraries-frameworks` · `design` · `learning` · `ai-productivity` · `infrastructure` · `inspiration` · `community`
- **Database:** Drizzle ORM + Neon serverless PostgreSQL (first DB in the project)
- **Auth:** better-auth magic link via Resend — single whitelisted admin email, middleware protects all `/admin/**`
- **Metadata enrichment:** microlink.io API fetched server-side on bookmark creation; manual re-fetch available in admin edit form; public pages read from DB only
- **Static generation:** Public pages statically generated with `revalidate` — no runtime DB queries on public routes

---

## Phase 1: Tracer bullet — DB + auth + one bookmark live

**User stories:** 15, 16, 17, 18, 20

### What to build

Stand up the full stack end-to-end with the thinnest possible slice. Install and configure Drizzle with the Neon driver, define the bookmarks schema, and run the initial migration. Wire up better-auth with the magic link strategy using Resend as the email transport, whitelist the admin email, and add Next.js middleware that blocks all `/admin/**` routes for unauthenticated visitors. Build a minimal `/admin/login` page and a minimal bookmark create form at `/admin/bookmarks/new` — the form accepts a URL, fires a microlink.io fetch server-side, and saves the result to the DB with `published: false` by default. Finally, build the minimal public detail page at `/bookmarks/[category]/[slug]` that reads a published bookmark from the DB and renders its title, description, and logo. Flip a bookmark to published in the DB directly and confirm it appears at the correct URL.

### Acceptance criteria

- [ ] Drizzle schema migrates cleanly against the Neon database
- [ ] Visiting any `/admin/**` route while unauthenticated redirects to `/admin/login`
- [ ] Requesting a magic link at `/admin/login` delivers an email via Resend and logs the admin in
- [ ] Submitting a URL in the create form triggers a microlink.io fetch and saves the result to the DB
- [ ] A bookmark with `published: true` is accessible at `/bookmarks/[category]/[slug]` and renders title, description, and logo
- [ ] A bookmark with `published: false` returns a 404 on the public detail page

---

## Phase 2: Admin CRUD complete

**User stories:** 19, 21, 22, 23, 24, 25, 26, 27

### What to build

Flesh out the full admin management surface. Build the admin listing page at `/admin/bookmarks` showing all bookmarks regardless of published status, with a "Draft" badge on unpublished entries, and filters for category and published status. Build the edit form at `/admin/bookmarks/[id]/edit` exposing all fields — category select, tag input, pros and cons textareas, 1–5 star rating selector, long-form review textarea, and a published toggle. Add a "Re-fetch metadata" button that re-calls microlink.io and overwrites the stored metadata fields. Add a delete action with a confirmation step. All mutations are server actions with Zod validation.

### Acceptance criteria

- [ ] Admin listing shows all bookmarks (published and unpublished) with correct badges
- [ ] Admin listing can be filtered by category and by published status
- [ ] Edit form loads existing values and saves all fields correctly
- [ ] Published toggle flips `published` between true and false
- [ ] Re-fetch metadata button updates title, description, logo_url, image_url, and color_hex from microlink.io
- [ ] Delete removes the bookmark from the DB and redirects back to the listing
- [ ] All server actions return validation errors inline when inputs are invalid

---

## Phase 3: Public listing pages

**User stories:** 1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 14

### What to build

Build the full public browsing surface. The `/bookmarks` hub page renders a "Recently Reviewed" section (latest 6 bookmarks where reviewed and published, sorted by updated_at) and a category grid showing each category name and its published bookmark count. The `/bookmarks/[category]` listing page renders a paginated grid of published BookmarkCards filtered to that category, with tag filter chips (derived from tags present in that category) and a sort toggle between "Newest" and "Top Rated". The BookmarkCard component displays: site logo, title, truncated description, category chip, up to 3 tag chips, star rating (when reviewed), a "Reviewed" badge (when reviewed), an external site link icon, a "Read review" link (when reviewed), and the dominant color as a left border accent. Category and tag filter state is reflected in the URL query string. Both pages are statically generated with revalidation.

### Acceptance criteria

- [ ] `/bookmarks` renders a recently reviewed section with up to 6 entries and a category grid with counts
- [ ] `/bookmarks/[category]` renders only published bookmarks for that category
- [ ] Tag filter chips appear and correctly filter the listing
- [ ] Sort toggle switches between newest-first and highest-rated-first
- [ ] Active tag filter and sort are reflected in the URL query string
- [ ] BookmarkCard displays accent color from `color_hex` as a left border
- [ ] "Reviewed" badge and "Read review" link appear only on bookmarks with rating or review_text
- [ ] A category with zero published bookmarks does not appear in the hub category grid
- [ ] All public listing pages are statically generated (no runtime DB queries on render)

---

## Phase 4: Detail page polish + OG image + sitemap

**User stories:** 9, 10, 11

### What to build

Complete the detail page at `/bookmarks/[category]/[slug]` with full review content: a review block showing pros (bulleted list), cons (bulleted list), the star rating, and the long-form review text — all conditionally rendered only when the respective field is populated. Add a prominent "Visit site" external link button. Generate a branded OG image for each detail page using the bookmark's title, logo, star rating, and accent color as a background treatment — following the same pattern as the existing snippet OG images in the project. Add `/bookmarks`, `/bookmarks/[category]`, and all published `/bookmarks/[category]/[slug]` routes to `sitemap.ts`.

### Acceptance criteria

- [ ] Detail page renders pros, cons, rating, and review text only when those fields are populated
- [ ] "Visit site" opens the bookmark URL in a new tab
- [ ] Sharing a detail page URL on a social platform renders the custom OG image (not a fallback)
- [ ] OG image includes the bookmark title, site logo, and rating
- [ ] `/bookmarks`, all category pages, and all published detail pages appear in `sitemap.ts`
- [ ] Unpublished bookmarks are excluded from the sitemap
