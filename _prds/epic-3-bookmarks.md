# PRD — EPIC 3: Bookmarks

**Status:** Draft
**Date:** 2026-05-02
**Author:** Michael Boutin

---

## Problem Statement

There is no public, curated collection of tools, libraries, and resources on imick.io. Without it, developer visitors have no reason to return between articles, and there is no mechanism to showcase taste and domain breadth beyond the Learn section. Every tool or resource discovered through research, work, or exploration has no durable home, no SEO value, and no way to turn a useful link into a content asset that compounds over time.

---

## Solution

A curated bookmark collection with a public-facing filterable/sortable view, per-bookmark detail pages with optional reviews (pros, cons, rating, long-form text), and an admin-protected CRUD interface. Bookmarks are added manually through the admin UI, enriched automatically with metadata from microlink.io (title, description, logo, image, dominant color), and organized by fixed top-level category with free-form tags. The public hub at `/bookmarks` highlights recently reviewed entries and links to per-category listing pages. Each reviewed bookmark gets a branded OG image for social sharing.

---

## User Stories

### Public visitor

1. As a developer visitor, I want to browse a curated list of tools and resources at `/bookmarks`, so that I can discover useful things I might not have found on my own.
2. As a developer visitor, I want to see recently reviewed bookmarks highlighted on the hub page, so that I can quickly find the most thoughtfully curated entries.
3. As a developer visitor, I want to browse bookmarks by category (e.g. Dev Tools, Design, AI & Productivity), so that I can focus on the domain I care about.
4. As a developer visitor, I want to filter bookmarks by tag within a category page, so that I can narrow down to a specific technology or topic.
5. As a developer visitor, I want to sort bookmarks by date added or rating, so that I can choose between freshest picks or highest-rated entries.
6. As a developer visitor, I want to see a bookmark's title, description, site logo, and rating at a glance on the listing card, so that I can quickly evaluate whether it's worth clicking into.
7. As a developer visitor, I want the bookmark card to display an accent color derived from the site's brand, so that the collection feels visually curated rather than generic.
8. As a developer visitor, I want to see a "Reviewed" badge on bookmark cards that have a full write-up, so that I can distinguish curated picks from plain links.
9. As a developer visitor, I want to click through to a detail page at `/bookmarks/[category]/[slug]`, so that I can read the full review including pros, cons, rating, and long-form notes.
10. As a developer visitor, I want a plain external link on the detail page to visit the bookmarked site directly, so that I can access the resource without extra redirect hops.
11. As a developer visitor, I want a well-formed OG image when I share a bookmark detail page on social media, so that the share card reflects the bookmark's content and brand rather than a generic fallback.
12. As a developer visitor, I want the bookmark hub and category pages to be indexable by search engines, so that individual categories can rank for queries like "best dev tools" or "best design tools".
13. As a developer visitor, I want each category to have its own URL (`/bookmarks/dev-tools`, `/bookmarks/design`, etc.), so that I can share or bookmark a specific category directly.
14. As a developer visitor, I want category and tag filters to reflect the current selection in the URL, so that I can share a filtered view with others.

### Admin (site owner)

15. As the admin, I want to log in at `/admin` using a magic link sent to my email, so that I don't need to manage a password.
16. As the admin, I want the `/admin` area to be inaccessible to unauthenticated visitors, so that my unpublished bookmarks and admin tools are private.
17. As the admin, I want to create a new bookmark by entering a URL, so that microlink.io can automatically fetch the title, description, logo, image, and dominant color.
18. As the admin, I want to assign a category and free-form tags when creating a bookmark, so that it appears in the correct listing pages.
19. As the admin, I want to optionally add pros, cons, a 1–5 rating, and long-form review text to any bookmark, so that curated entries have richer content than plain links.
20. As the admin, I want newly created bookmarks to default to `published: false`, so that I can review and enrich them before they appear publicly.
21. As the admin, I want to toggle the `published` flag on any bookmark from the admin listing, so that I can control exactly what is visible on the public site.
22. As the admin, I want a "Re-fetch metadata" button on the bookmark edit form, so that I can refresh stale title, description, logo, or image data from microlink.io on demand.
23. As the admin, I want to edit any field on a bookmark (category, tags, review, published status), so that I can correct mistakes or enrich entries over time.
24. As the admin, I want to delete a bookmark, so that I can remove entries that are no longer relevant.
25. As the admin, I want the admin listing to show all bookmarks regardless of published status, so that I can see and manage drafts alongside live entries.
26. As the admin, I want to see a visual indicator (e.g. "Draft" badge) on unpublished bookmarks in the admin listing, so that I can track what still needs review.
27. As the admin, I want the admin listing to be filterable by category and published status, so that I can efficiently manage large numbers of bookmarks.

---

## Implementation Decisions

### Database (Drizzle + Neon PostgreSQL)

- A single `bookmarks` table is introduced as the first database table in the project.
- Fields: `id` (uuid, primary key), `url`, `slug` (unique, derived from title or URL hostname), `title`, `description`, `logo_url`, `image_url`, `color_hex` (dominant color from microlink), `category` (enum), `tags` (string array), `pros` (text, nullable), `cons` (text, nullable), `rating` (integer 1–5, nullable), `review_text` (text, nullable), `reviewed` (boolean, computed — true when at least rating or review_text is present), `published` (boolean, default false), `created_at`, `updated_at`.
- Categories are a fixed enum in the schema: `dev-tools`, `libraries-frameworks`, `design`, `learning`, `ai-productivity`, `infrastructure`, `inspiration`, `community`.
- Drizzle ORM is introduced as the database layer; Neon serverless driver as the PostgreSQL client.

### Authentication (better-auth)

- better-auth is introduced for the first time in the project.
- Magic link strategy only — no passwords, no OAuth.
- Resend is the email transport (already configured in the project).
- A single admin user is whitelisted by email address in the better-auth config.
- Next.js middleware protects all `/admin/**` routes, redirecting unauthenticated requests to a login page.
- The login page lives at `/admin/login`.

### Microlink.io Integration

- A server-side utility wraps the microlink.io API to fetch: `title`, `description`, `logo.url`, `screenshot.url` (or `image.url`), and `palette` (dominant color).
- This utility is called on bookmark creation and exposed as a re-fetch action in the admin edit form.
- Fetched metadata is stored in the database; the public site reads from DB only (no runtime microlink calls on public pages).
- Microlink API key stored in environment variables.

### URL Structure

- `/bookmarks` — hub page
- `/bookmarks/[category]` — category listing (slug-form of category name, e.g. `dev-tools`)
- `/bookmarks/[category]/[slug]` — bookmark detail page
- `/admin/login` — magic link login page
- `/admin` — admin dashboard (redirects to `/admin/bookmarks`)
- `/admin/bookmarks` — bookmark listing (all, including unpublished)
- `/admin/bookmarks/new` — create form
- `/admin/bookmarks/[id]/edit` — edit form

### Public Pages

- **Hub page (`/bookmarks`):** Recently reviewed section (latest 6 bookmarks where `reviewed: true` and `published: true`, sorted by `updated_at` desc) + a grid of category cards showing category name and bookmark count. Statically generated with `revalidate`.
- **Category page (`/bookmarks/[category]`):** Paginated bookmark grid filtered by category and `published: true`. Tag filter chips (populated from tags present in that category). Sort toggle: "Newest" / "Top Rated". Statically generated per category with `revalidate`.
- **Detail page (`/bookmarks/[category]/[slug]`):** Full bookmark view — site logo, title, description, accent color, external link, rating display, pros/cons list, long-form review. Statically generated with `revalidate`.

### OG Image

- A `opengraph-image.tsx` route segment is added at `/bookmarks/[category]/[slug]/opengraph-image.tsx`.
- Generated image includes: bookmark title, site logo (fetched from `logo_url`), star rating visualization, and accent color as background treatment.
- Follows the same pattern as the existing snippet OG image in the project.

### Bookmark Card Component

- Displays: site logo, title, truncated description, category chip, tag chips (max 3 visible), rating (star icons, if reviewed), "Reviewed" badge, accent color as a left border or subtle header band.
- Two CTAs: external site link (icon button) and "Read review" link to detail page (shown only when `reviewed: true`).

### Admin UI

- Admin listing: table or card grid of all bookmarks; columns/fields include title, category, tags, rating, published status, created date. Filterable by category and published status.
- Create/edit form: URL field (triggers microlink fetch on blur/submit), category select, tags input (comma-separated or tag chips), pros/cons textareas, rating selector (1–5 stars), review text area, published toggle. Re-fetch metadata button on edit form.
- All admin mutations are Next.js server actions with Zod validation.
- Admin layout is visually distinct from the public site (functional, not styled to match public branding).

### Sitemap

- `/bookmarks`, `/bookmarks/[category]`, and `/bookmarks/[category]/[slug]` (published only) are added to `sitemap.ts`.

---

## Out of Scope

- Google Sheet or CSV bulk import script — bookmarks are added manually through the admin UI.
- Scheduled or automatic metadata refresh — re-fetch is manual only.
- Click tracking or redirect-based analytics on external links.
- Visitor-submitted reviews, ratings, or comments.
- Multi-admin support or role-based access control.
- Bookmark collections, folders, or manual ordering beyond category + tags.
- RSS feed for bookmarks.
- Dark/light mode toggle (inherits the site's existing theme).
- Bookmark "save" or "like" feature for logged-out visitors.

---

## Further Notes

- The `reviewed` field is a derived boolean: a bookmark is considered reviewed when it has at least a rating or review_text set. It does not need to be stored as a separate column — it can be a Drizzle computed field or derived at query time. Either approach is acceptable.
- The color palette from microlink returns multiple swatches; store the single dominant/vibrant hex and discard the rest unless a future design iteration needs more.
- The admin area does not need to match the public site's visual design — functional shadcn/ui components (tables, forms, dialogs) are sufficient.
- Category slugs in the URL must be stable — changing a category's display name should not break existing URLs. The enum values (e.g. `dev-tools`) are the URL slugs; display names are mapped separately in a constant.
- If microlink.io fetch fails during bookmark creation, the create operation should still succeed with a fallback (URL as title, empty metadata). The admin can re-fetch later.
