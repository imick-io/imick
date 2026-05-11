import type { Bookmark } from "./db/schema"
import { isReviewed } from "./bookmarks-meta"
import { getHostname } from "./bookmarks-meta"

export type ReviewedFilter = "all" | "yes" | "no"

export type BookmarkFilters = {
  category?: string
  tags?: string[]
  reviewed?: ReviewedFilter
  q?: string
}

export function filterBookmarks(
  bookmarks: Bookmark[],
  filters: BookmarkFilters
): Bookmark[] {
  let result = bookmarks

  if (filters.category) {
    result = result.filter((b) => b.category === filters.category)
  }

  if (filters.tags && filters.tags.length > 0) {
    const required = filters.tags
    result = result.filter((b) =>
      required.every((tag) => b.tags.includes(tag))
    )
  }

  if (filters.reviewed === "yes") {
    result = result.filter((b) => isReviewed(b))
  } else if (filters.reviewed === "no") {
    result = result.filter((b) => !isReviewed(b))
  }

  const q = filters.q?.trim()
  if (q) {
    const lower = q.toLowerCase()
    result = result.filter((b) => {
      const title = b.title.toLowerCase()
      const description = (b.description ?? "").toLowerCase()
      const hostname = getHostname(b.url).toLowerCase()
      return (
        title.includes(lower) ||
        description.includes(lower) ||
        hostname.includes(lower)
      )
    })
  }

  return result
}
