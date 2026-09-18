import { ogContentType, ogSize, renderBookmarkCover } from "@/lib/og"
import { getPublishedBookmark } from "@/lib/bookmarks"
import { getCategoryLabel, getCategoryMap } from "@/lib/categories"
import { readWhenAvailable } from "@/lib/db-availability"

export const contentType = ogContentType
export const size = ogSize

export default async function Image(
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const { category, slug } = await params

  // A social card is never worth a 500. Without the database we fall through
  // to the generic cover this route already renders for an unknown bookmark.
  const found = await readWhenAvailable(async () => {
    const bookmark = await getPublishedBookmark(category, slug)
    return {
      bookmark,
      eyebrow: bookmark
        ? getCategoryLabel(bookmark.category, await getCategoryMap())
        : "Bookmark",
    }
  })

  const bookmark = found.ok ? found.data.bookmark : null
  const eyebrow = found.ok ? found.data.eyebrow : "Bookmark"
  const title = bookmark?.title ?? "Bookmark"

  return renderBookmarkCover({
    title,
    eyebrow,
    logoUrl: bookmark?.logoUrl,
    rating: bookmark?.rating,
    accentColor: bookmark?.colorHex,
  })
}
