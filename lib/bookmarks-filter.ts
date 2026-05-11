import type { Bookmark } from "./db/schema"
import { getHostname, isReviewed, type BookmarkSort } from "./bookmarks-meta"

export type TagMap = Record<string, string[]>

export const reviewedValues = ["all", "yes", "no"] as const
export type ReviewedFilter = (typeof reviewedValues)[number]

export const sortValues = ["newest", "top-rated"] as const

export function buildTagMap(bookmarks: Bookmark[]): TagMap {
  const byCat = new Map<string, Set<string>>()
  const all = new Set<string>()
  for (const b of bookmarks) {
    for (const t of b.tags) {
      all.add(t)
      if (b.category) {
        let s = byCat.get(b.category)
        if (!s) {
          s = new Set()
          byCat.set(b.category, s)
        }
        s.add(t)
      }
    }
  }
  const sorted = (s: Set<string>) => Array.from(s).sort((a, b) => a.localeCompare(b))
  const map: TagMap = { "": sorted(all) }
  for (const [cat, s] of byCat) map[cat] = sorted(s)
  return map
}

export type BookmarkFilters = {
  category?: string
  tags?: string[]
  q?: string
  reviewed?: ReviewedFilter
  sort?: BookmarkSort
}

export function hasActiveNarrowingFilters(filters: BookmarkFilters): boolean {
  if (filters.q && filters.q.trim()) return true
  if (filters.tags && filters.tags.length > 0) return true
  if (filters.reviewed && filters.reviewed !== "all") return true
  if (filters.sort && filters.sort !== "newest") return true
  return false
}

export function filterBookmarks(
  bookmarks: Bookmark[],
  filters: BookmarkFilters
): Bookmark[] {
  const { category, tags, q, reviewed, sort } = filters

  let result = [...bookmarks]

  if (category) {
    result = result.filter((b) => b.category === category)
  }

  if (tags && tags.length > 0) {
    result = result.filter((b) => tags.every((t) => b.tags.includes(t)))
  }

  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        (b.description ?? "").toLowerCase().includes(term) ||
        getHostname(b.url).toLowerCase().includes(term)
    )
  }

  if (reviewed === "yes") {
    result = result.filter((b) => isReviewed(b))
  } else if (reviewed === "no") {
    result = result.filter((b) => !isReviewed(b))
  }

  const effectiveSort: BookmarkSort = sort ?? "newest"

  if (effectiveSort === "top-rated") {
    result = result.filter((b) => isReviewed(b))
    result.sort((a, z) => {
      const ra = a.rating ?? 0
      const rz = z.rating ?? 0
      if (rz !== ra) return rz - ra
      return (z.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0)
    })
  } else {
    result.sort(
      (a, z) =>
        (z.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    )
  }

  return result
}
