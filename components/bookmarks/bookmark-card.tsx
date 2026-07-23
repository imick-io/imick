import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { getHostname, isReviewed, type Bookmark } from "@/lib/bookmarks-meta"
import { getCategoryLabel } from "@/lib/categories-meta"
import { BookmarkLogo } from "./bookmark-logo"

type BookmarkCardProps = {
  bookmark: Bookmark
  categoryMap?: Record<string, string>
}

export function BookmarkCard({ bookmark, categoryMap }: BookmarkCardProps) {
  const reviewed = isReviewed(bookmark)
  const detailHref = bookmark.category
    ? `/bookmarks/${bookmark.category}/${bookmark.slug}`
    : bookmark.url
  const hostname = getHostname(bookmark.url)
  const showFooter = Boolean(bookmark.category) || reviewed

  return (
    <div className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground">
      <div className="flex items-start gap-3">
        <BookmarkLogo
          logoUrl={bookmark.logoUrl}
          url={bookmark.url}
          colorHex={bookmark.colorHex}
          size={32}
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-3 text-base font-semibold leading-snug text-foreground">
            <Link href={detailHref} className="hover:underline">
              {bookmark.title}
            </Link>
          </h3>
          {hostname ? (
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-block max-w-full truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              {hostname}
            </a>
          ) : null}
          {bookmark.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {bookmark.description}
            </p>
          ) : null}
        </div>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${bookmark.title}`}
          className="shrink-0 text-muted-foreground transition-transform hover:text-foreground group-hover:translate-x-0.5"
        >
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} />
        </a>
      </div>

      {showFooter ? (
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="flex items-center gap-3 text-xs text-muted-foreground">
            {bookmark.category ? (
              <span>{getCategoryLabel(bookmark.category, categoryMap)}</span>
            ) : null}
            {reviewed && bookmark.rating != null ? (
              <span
                className="inline-flex items-center gap-1"
                aria-label={`Rating: ${bookmark.rating} out of 5`}
              >
                <HugeiconsIcon icon={StarIcon} size={12} aria-hidden />
                {bookmark.rating}/5
              </span>
            ) : null}
          </span>
          {reviewed ? (
            <Link
              href={detailHref}
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Read review
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
