export type { Bookmark, NewBookmark, BookmarkCategory } from "./db/schema"

export function slugifyCategory(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(" ")
}

export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

export function isReviewed(b: { rating: number | null; reviewText: string | null }) {
  return b.rating != null || b.reviewText != null
}

export type BookmarkSort = "newest" | "top-rated"

export function isBookmarkSort(value: string | undefined | null): value is BookmarkSort {
  return value === "newest" || value === "top-rated"
}
