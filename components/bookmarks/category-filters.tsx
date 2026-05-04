import Link from "next/link"
import { cn } from "@/lib/utils"
import type { BookmarkSort } from "@/lib/bookmarks"

type Props = {
  category: string
  tags: string[]
  activeTag: string | undefined
  sort: BookmarkSort
}

function buildHref(category: string, params: { tag?: string; sort?: BookmarkSort }) {
  const q = new URLSearchParams()
  if (params.tag) q.set("tag", params.tag)
  if (params.sort && params.sort !== "newest") q.set("sort", params.sort)
  const qs = q.toString()
  return `/bookmarks/${category}${qs ? `?${qs}` : ""}`
}

export function CategoryFilters({ category, tags, activeTag, sort }: Props) {
  const sortOptions: Array<{ value: BookmarkSort; label: string }> = [
    { value: "newest", label: "Newest" },
    { value: "top-rated", label: "Top Rated" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sort
        </p>
        <ul className="flex items-center gap-2">
          {sortOptions.map((option) => {
            const isActive = sort === option.value
            return (
              <li key={option.value}>
                <Link
                  href={buildHref(category, { tag: activeTag, sort: option.value })}
                  scroll={false}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border px-3.5 text-sm transition-colors",
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href={buildHref(category, { sort })}
              scroll={false}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3.5 text-sm transition-colors",
                !activeTag
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </Link>
          </li>
          {tags.map((tag) => {
            const isActive = activeTag === tag
            return (
              <li key={tag}>
                <Link
                  href={buildHref(category, { tag, sort })}
                  scroll={false}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border px-3.5 text-sm transition-colors",
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tag}
                </Link>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
