export type { Bookmark, NewBookmark, BookmarkCategory } from "./db/schema"

export const CATEGORY_LABELS: Record<string, string> = {
  "dev-tools": "Dev Tools",
  "libraries-frameworks": "Libraries & Frameworks",
  "design": "Design",
  "learning": "Learning",
  "ai-productivity": "AI & Productivity",
  "infrastructure": "Infrastructure",
  "inspiration": "Inspiration",
  "community": "Community",
}

export function getCategoryLabel(slug: string | null | undefined): string {
  if (!slug) return "Uncategorized"
  return CATEGORY_LABELS[slug] ?? humanizeSlug(slug)
}

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(" ")
}

export function slugifyCategory(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function isReviewed(b: { rating: number | null; reviewText: string | null }) {
  return b.rating != null || b.reviewText != null
}

export type BookmarkSort = "newest" | "top-rated"

export function isBookmarkSort(value: string | undefined | null): value is BookmarkSort {
  return value === "newest" || value === "top-rated"
}
