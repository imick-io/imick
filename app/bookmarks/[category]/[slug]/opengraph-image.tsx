import { ogContentType, ogSize, renderBookmarkCover } from "@/lib/og"
import { getPublishedBookmark, getCategoryLabel } from "@/lib/bookmarks"

export const contentType = ogContentType
export const size = ogSize

export default async function Image(
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const { category, slug } = await params
  const bookmark = await getPublishedBookmark(category, slug)

  const eyebrow = bookmark ? getCategoryLabel(bookmark.category) : "Bookmark"
  const title = bookmark?.title ?? "Bookmark"

  return renderBookmarkCover({
    title,
    eyebrow,
    logoUrl: bookmark?.logoUrl,
    rating: bookmark?.rating,
    accentColor: bookmark?.colorHex,
  })
}
