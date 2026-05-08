# Bookmark lifecycle on publishedAt

Bookmarks originally used a `published: boolean` column for visibility. This ADR records the switch to `publishedAt: timestamp | null`, harmonizing Bookmarks with the rest of the content lifecycle model.

## Decision

Replace `bookmarks.published` (boolean) with `bookmarks.publishedAt` (`timestamp`, nullable). Existing rows where `published = true` backfill to `publishedAt = createdAt`; rows where `published = false` backfill to `publishedAt = NULL`.

The public visibility rule becomes `publishedAt IS NOT NULL AND publishedAt <= now()`. Future-dated Bookmarks are hidden in production and visible in `next dev`, matching the Article/Snippet rule rather than the "Coming soon" rule used for Classes.

## Rationale

**Consistency.** Articles, Snippets, Classes, and Folios already gate visibility on `publishedAt`. Bookmarks were the only content type using a boolean. One mental model across the codebase is worth more than the marginal simplicity of a boolean.

**Scheduled publish, free.** A timestamp gives scheduled publishing without a separate feature: set the date, save, walk away. The boolean made this impossible.

**Form trade-off acknowledged.** The admin form goes from a single checkbox to a datetime input plus "Set to now" affordance. This is more surface than a checkbox, but it directly exposes the new capability and avoids a hidden state where the user can't tell whether a bookmark is published-now, scheduled, or draft.

## Consequences

- Schema migration: drop `published`, add `publishedAt`. Backfill on the same migration.
- All public queries in `lib/bookmarks.ts` filter on `publishedAt IS NOT NULL AND publishedAt <= now()` (defensive against scheduled rows even before the UI exposes scheduling).
- Admin list gains a third filter state: Draft / Scheduled / Published. The "All" filter remains.
- Mutations that affect public visibility (`updateBookmark`, `deleteBookmark`, `refetchMetadata`, `generateWithAi`) call a shared `revalidateBookmarksPublic()` helper that invalidates the `/bookmarks` subtree.
- The admin tree (`app/admin/layout.tsx`) sets `export const dynamic = "force-dynamic"` so admin pages always render fresh, removing a class of staleness bugs at the source.
