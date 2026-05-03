import { db } from "./db"
import { bookmarks, categoryEnum } from "./db/schema"
import { eq, and, asc } from "drizzle-orm"

export type { Bookmark, NewBookmark, BookmarkCategory } from "./db/schema"

export const CATEGORY_LABELS: Record<(typeof categoryEnum.enumValues)[number], string> = {
  "dev-tools": "Dev Tools",
  "libraries-frameworks": "Libraries & Frameworks",
  "design": "Design",
  "learning": "Learning",
  "ai-productivity": "AI & Productivity",
  "infrastructure": "Infrastructure",
  "inspiration": "Inspiration",
  "community": "Community",
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
  const validCategories = categoryEnum.enumValues as readonly string[]
  const conditions = []

  if (opts?.category && validCategories.includes(opts.category)) {
    conditions.push(
      eq(bookmarks.category, opts.category as (typeof categoryEnum.enumValues)[number])
    )
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
  const validCategories = categoryEnum.enumValues as readonly string[]
  if (!validCategories.includes(category)) return null

  const rows = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.slug, slug),
        eq(bookmarks.category, category as (typeof categoryEnum.enumValues)[number]),
        eq(bookmarks.published, true)
      )
    )
    .limit(1)

  return rows[0] ?? null
}
