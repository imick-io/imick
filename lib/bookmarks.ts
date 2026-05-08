import { db } from "./db"
import { bookmarks } from "./db/schema"
import {
  eq,
  and,
  or,
  asc,
  desc,
  isNull,
  isNotNull,
  lte,
  gt,
  sql,
} from "drizzle-orm"
import type { SQL } from "drizzle-orm"
import type { BookmarkSort } from "./bookmarks-meta"

export * from "./bookmarks-meta"

export type AdminStatus = "all" | "draft" | "scheduled" | "published"

function isPubliclyVisible(): SQL {
  if (process.env.NODE_ENV !== "production") {
    return isNotNull(bookmarks.publishedAt)
  }
  return and(
    isNotNull(bookmarks.publishedAt),
    lte(bookmarks.publishedAt, sql`now()`)
  )!
}

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
  status?: AdminStatus
}) {
  const conditions: SQL[] = []

  if (opts?.category) {
    conditions.push(eq(bookmarks.category, opts.category))
  }

  if (opts?.status === "draft") {
    conditions.push(isNull(bookmarks.publishedAt))
  } else if (opts?.status === "scheduled") {
    conditions.push(isNotNull(bookmarks.publishedAt))
    conditions.push(gt(bookmarks.publishedAt, sql`now()`))
  } else if (opts?.status === "published") {
    conditions.push(isNotNull(bookmarks.publishedAt))
    conditions.push(lte(bookmarks.publishedAt, sql`now()`))
  }

  const rows = await db
    .select()
    .from(bookmarks)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(bookmarks.createdAt))

  return rows
}

export async function getDistinctCategories(opts?: {
  publishedOnly?: boolean
}): Promise<string[]> {
  const where = opts?.publishedOnly
    ? and(isNotNull(bookmarks.category), isPubliclyVisible())
    : isNotNull(bookmarks.category)

  const rows = await db
    .selectDistinct({ category: bookmarks.category })
    .from(bookmarks)
    .where(where)

  return rows
    .map((r) => r.category)
    .filter((c): c is string => typeof c === "string" && c.length > 0)
    .sort((a, b) => a.localeCompare(b))
}

export async function getPublishedBookmark(category: string, slug: string) {
  const rows = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.slug, slug),
        eq(bookmarks.category, category),
        isPubliclyVisible()
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
        isPubliclyVisible(),
        isNotNull(bookmarks.category),
        or(isNotNull(bookmarks.rating), isNotNull(bookmarks.reviewText))
      )
    )
    .orderBy(desc(bookmarks.updatedAt))
    .limit(limit)
}

export async function getPublishedCategoryCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({
      category: bookmarks.category,
      count: sql<number>`count(*)::int`,
    })
    .from(bookmarks)
    .where(and(isPubliclyVisible(), isNotNull(bookmarks.category)))
    .groupBy(bookmarks.category)

  const counts: Record<string, number> = {}
  for (const row of rows) {
    if (row.category) counts[row.category] = row.count
  }
  return counts
}

export async function getPublishedBookmarksByCategory(
  category: string,
  opts?: { sort?: BookmarkSort; tag?: string }
) {
  const sort: BookmarkSort = opts?.sort ?? "newest"
  const conditions: SQL[] = [
    eq(bookmarks.category, category),
    isPubliclyVisible(),
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
    .where(and(isPubliclyVisible(), isNotNull(bookmarks.category)))
    .orderBy(desc(bookmarks.updatedAt))
}

export async function getPublishedTagsForCategory(category: string): Promise<string[]> {
  const rows = await db
    .select({ tags: bookmarks.tags })
    .from(bookmarks)
    .where(and(eq(bookmarks.category, category), isPubliclyVisible()))

  const set = new Set<string>()
  for (const row of rows) for (const tag of row.tags) set.add(tag)
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}
