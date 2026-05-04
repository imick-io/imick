import { db } from "./db"
import { bookmarks, categoryEnum } from "./db/schema"
import {
  eq,
  and,
  or,
  asc,
  desc,
  isNotNull,
  sql,
} from "drizzle-orm"

export type { Bookmark, NewBookmark, BookmarkCategory } from "./db/schema"

type Category = (typeof categoryEnum.enumValues)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  "dev-tools": "Dev Tools",
  "libraries-frameworks": "Libraries & Frameworks",
  "design": "Design",
  "learning": "Learning",
  "ai-productivity": "AI & Productivity",
  "infrastructure": "Infrastructure",
  "inspiration": "Inspiration",
  "community": "Community",
}

export const CATEGORY_VALUES: readonly Category[] = categoryEnum.enumValues

export function isCategory(value: string | undefined | null): value is Category {
  return !!value && (CATEGORY_VALUES as readonly string[]).includes(value)
}

export function isReviewed(b: { rating: number | null; reviewText: string | null }) {
  return b.rating != null || b.reviewText != null
}

export type BookmarkSort = "newest" | "top-rated"

export function isBookmarkSort(value: string | undefined | null): value is BookmarkSort {
  return value === "newest" || value === "top-rated"
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

export async function getPublishedCategoryCounts(): Promise<Record<Category, number>> {
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
  ) as Record<Category, number>
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
