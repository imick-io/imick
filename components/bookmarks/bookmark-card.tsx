import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { getHostname, isReviewed, type Bookmark } from "@/lib/bookmarks-meta"
import { getCategoryLabel } from "@/lib/categories-meta"
import { BookmarkLogo } from "./bookmark-logo"

type BookmarkCardProps = {
  bookmark: Bookmark
  categoryMap?: Record<string, string>
}

const MAX_TAGS = 3

export function BookmarkCard({ bookmark, categoryMap }: BookmarkCardProps) {
  const reviewed = isReviewed(bookmark)
  const detailHref = bookmark.category
    ? `/bookmarks/${bookmark.category}/${bookmark.slug}`
    : bookmark.url
  const visibleTags = bookmark.tags.slice(0, MAX_TAGS)
  const hostname = getHostname(bookmark.url)

  return (
    <div
      className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/40"
      style={
        bookmark.colorHex
          ? { borderLeftColor: bookmark.colorHex, borderLeftWidth: 4 }
          : undefined
      }
    >
      <div className="flex items-start gap-3">
        <BookmarkLogo
          logoUrl={bookmark.logoUrl}
          url={bookmark.url}
          colorHex={bookmark.colorHex}
          size={40}
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
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} />
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {bookmark.category && (
          <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {getCategoryLabel(bookmark.category, categoryMap)}
          </span>
        )}
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {reviewed ? (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Reviewed
          </span>
        ) : null}
      </div>

      {reviewed ? (
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          {bookmark.rating != null ? (
            <span
              className="text-sm leading-none tracking-tight text-amber-500"
              aria-label={`Rating: ${bookmark.rating} out of 5`}
            >
              {"★".repeat(bookmark.rating)}
              <span className="text-muted-foreground/40">
                {"★".repeat(5 - bookmark.rating)}
              </span>
            </span>
          ) : (
            <span aria-hidden />
          )}
          <Link
            href={detailHref}
            className="text-xs font-medium text-primary hover:underline"
          >
            Read review →
          </Link>
        </div>
      ) : null}
    </div>
  )
}
