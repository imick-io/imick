import { humanizeSlug } from "./bookmarks-meta"

export function getCategoryLabel(
  slug: string | null | undefined,
  map?: Record<string, string>
): string {
  if (!slug) return "Uncategorized"
  if (map && map[slug]) return map[slug]
  return humanizeSlug(slug)
}
