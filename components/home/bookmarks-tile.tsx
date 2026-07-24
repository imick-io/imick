import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, StarIcon } from "@hugeicons/core-free-icons"
import { BookmarkLogo } from "@/components/bookmarks/bookmark-logo"
import { getHostname } from "@/lib/bookmarks-meta"
import { getHomeBookmarks } from "@/lib/home-content"
import { BentoTile, type TileDelay } from "./bento-tile"

export async function BookmarksTile({
  delay,
  className,
}: {
  delay?: TileDelay
  className?: string
}) {
  const bookmarks = await getHomeBookmarks(3)
  if (bookmarks.length === 0) return null

  return (
    <BentoTile delay={delay} className={`flex flex-col gap-2 p-6 ${className ?? ""}`}>
      <div className="flex items-baseline justify-between gap-4 pb-2">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Recently reviewed
        </h2>
        <Link
          href="/bookmarks"
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          All bookmarks
        </Link>
      </div>
      <ul className="flex flex-1 flex-col divide-y divide-border">
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <Link
              href={`/bookmarks/${bookmark.category}/${bookmark.slug}`}
              className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-3 transition-colors hover:bg-accent"
            >
              <BookmarkLogo
                logoUrl={bookmark.logoUrl}
                url={bookmark.url}
                colorHex={bookmark.colorHex}
                size={28}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {bookmark.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {getHostname(bookmark.url)}
                </span>
              </span>
              {bookmark.rating != null ? (
                <span
                  className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground"
                  aria-label={`Rating: ${bookmark.rating} out of 5`}
                >
                  <HugeiconsIcon icon={StarIcon} size={12} aria-hidden />
                  {bookmark.rating}/5
                </span>
              ) : null}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </BentoTile>
  )
}
