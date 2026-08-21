import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { getHostname, isReviewed, type Bookmark } from "@/lib/bookmarks-meta"
import { getCategoryLabel } from "@/lib/categories-meta"
import { CardFeature } from "@/components/ui/brand/card-feature"
import { BookmarkLogo } from "./bookmark-logo"

type BookmarkCardProps = {
  bookmark: Bookmark
  categoryMap?: Record<string, string>
}

// Category and Tag pills are informational on a card (not selectable), so both
// stay neutral -- Brand Accent is reserved for the active/selected pill state on
// the filter row (see filter-chip.tsx). Category reads as the louder neutral,
// Tags as the quieter one.
const CATEGORY_PILL_CLASS =
  "inline-flex items-center rounded-pill border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
const TAG_PILL_CLASS =
  "inline-flex items-center rounded-pill bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"

export function BookmarkCard({ bookmark, categoryMap }: BookmarkCardProps) {
  const reviewed = isReviewed(bookmark)
  const detailHref = bookmark.category
    ? `/bookmarks/${bookmark.category}/${bookmark.slug}`
    : bookmark.url
  const hostname = getHostname(bookmark.url)
  const tags = bookmark.tags.slice(0, 3)
  const showPills = Boolean(bookmark.category) || tags.length > 0
  const showFooter = reviewed

  return (
    <CardFeature
      variant="default"
      className="group h-full gap-3 p-5 hover:border-foreground"
    >
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

      {showPills ? (
        <ul className="flex flex-wrap items-center gap-1.5">
          {bookmark.category ? (
            <li>
              <span className={CATEGORY_PILL_CLASS}>
                {getCategoryLabel(bookmark.category, categoryMap)}
              </span>
            </li>
          ) : null}
          {tags.map((tag) => (
            <li key={tag}>
              <span className={TAG_PILL_CLASS}>{tag}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {showFooter ? (
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          {bookmark.rating != null ? (
            <span
              className="inline-flex items-center gap-1 text-xs text-muted-foreground"
              aria-label={`Rating: ${bookmark.rating} out of 5`}
            >
              <HugeiconsIcon icon={StarIcon} size={12} aria-hidden />
              {bookmark.rating}/5
            </span>
          ) : (
            <span />
          )}
          <Link
            href={detailHref}
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Read review
          </Link>
        </div>
      ) : null}
    </CardFeature>
  )
}
