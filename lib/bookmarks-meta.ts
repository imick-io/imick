import { categoryEnum } from "./db/schema"

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
