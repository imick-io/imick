import { db } from "./db"
import { bookmarks } from "./db/schema"
import {
  eq,
  and,
  or,
  asc,
  desc,
  isNotNull,
  sql,
} from "drizzle-orm"
import {
  isCategory,
  CATEGORY_VALUES,
  type BookmarkCategory,
  type BookmarkSort,
} from "./bookmarks-meta"

export * from "./bookmarks-meta"

export async function getBookmarkById(id: string) {
  const rows = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.id, id))
    .limit(1)
  return rows[0] ?? null
}

export async function getAdminBookmarks(opts?: {
  category?: string
  status?: "published" | "draft" | "all"
}) {
  const conditions = []

  if (isCategory(opts?.category)) {
    conditions.push(eq(bookmarks.category, opts.category))
  }

  if (opts?.status === "published") conditions.push(eq(bookmarks.published, true))
  else if (opts?.status === "draft") conditions.push(eq(bookmarks.published, false))

  const rows = await db
    .select()
    .from(bookmarks)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(bookmarks.createdAt))

  return rows
}

export async function getPublishedBookmark(category: string, slug: string) {
  if (!isCategory(category)) return null

  const rows = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.slug, slug),
        eq(bookmarks.category, category),
        eq(bookmarks.published, true)
      )
    )
    .limit(1)

  return rows[0] ?? null
}

export async function getRecentlyReviewedBookmarks(limit = 6) {
  return db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.published, true),
        or(isNotNull(bookmarks.rating), isNotNull(bookmarks.reviewText))
      )
    )
    .orderBy(desc(bookmarks.updatedAt))
    .limit(limit)
}

export async function getPublishedCategoryCounts(): Promise<Record<BookmarkCategory, number>> {
  const rows = await db
    .select({
      category: bookmarks.category,
      count: sql<number>`count(*)::int`,
    })
    .from(bookmarks)
    .where(eq(bookmarks.published, true))
    .groupBy(bookmarks.category)

  const counts = Object.fromEntries(
    CATEGORY_VALUES.map((c) => [c, 0])
  ) as Record<BookmarkCategory, number>
  for (const row of rows) counts[row.category] = row.count
  return counts
}

export async function getPublishedBookmarksByCategory(
  category: string,
  opts?: { sort?: BookmarkSort; tag?: string }
) {
  if (!isCategory(category)) return []

  const sort: BookmarkSort = opts?.sort ?? "newest"
  const conditions = [
    eq(bookmarks.category, category),
    eq(bookmarks.published, true),
  ]
  if (opts?.tag) {
    conditions.push(sql`${bookmarks.tags} @> ARRAY[${opts.tag}]::text[]`)
  }

  const orderBy =
    sort === "top-rated"
      ? [sql`${bookmarks.rating} DESC NULLS LAST`, desc(bookmarks.updatedAt)]
      : [desc(bookmarks.createdAt)]

  return db
    .select()
    .from(bookmarks)
    .where(and(...conditions))
    .orderBy(...orderBy)
}

export async function getAllPublishedBookmarks() {
  return db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.published, true))
    .orderBy(desc(bookmarks.updatedAt))
}

export async function getPublishedTagsForCategory(category: string): Promise<string[]> {
  if (!isCategory(category)) return []

  const rows = await db
    .select({ tags: bookmarks.tags })
    .from(bookmarks)
    .where(and(eq(bookmarks.category, category), eq(bookmarks.published, true)))

  const set = new Set<string>()
  for (const row of rows) for (const tag of row.tags) set.add(tag)
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}
