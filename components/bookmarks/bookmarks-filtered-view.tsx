"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useQueryState, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs"
import { filterBookmarks, hasActiveNarrowingFilters, reviewedValues, sortValues, type TagMap } from "@/lib/bookmarks-filter"
import { isReviewed, type Bookmark } from "@/lib/bookmarks-meta"
import { BookmarkCard } from "./bookmark-card"
import { BookmarkSearchInput } from "./bookmark-search-input"
import { CategoryChipRow } from "./category-chip-row"
import { ReviewedTabs } from "./reviewed-tabs"
import { FiltersPopover } from "./filters-popover"
import { ClearFiltersButton } from "./clear-filters-button"
import { FilterChipButton } from "@/components/ui/filter-chip"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 12
const CLEAR_BUTTON_CLASS =
  "inline-flex h-8 items-center rounded-full border border-border bg-card px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"

type Props = {
  bookmarks: Bookmark[]
  categoryMap?: Record<string, string>
  categoryCounts: Record<string, number>
  tagMap: TagMap
  category?: string
}

export function BookmarksFilteredView({
  bookmarks,
  categoryMap,
  categoryCounts,
  tagMap,
  category,
}: Props) {
  const [q] = useQueryState("q", parseAsString.withDefault(""))

  const [tags, setTags] = useQueryState(
    "tag",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  )

  const [reviewed] = useQueryState(
    "reviewed",
    parseAsStringLiteral(reviewedValues).withDefault("all")
  )

  const [sort] = useQueryState(
    "sort",
    parseAsStringLiteral(sortValues).withDefault("newest")
  )

  const prevCategory = useRef(category)
  useEffect(() => {
    if (prevCategory.current !== category) {
      prevCategory.current = category
      setTags(null)
    }
  }, [category, setTags])

  const filters = useMemo(
    () => ({
      category,
      tags: tags.length > 0 ? tags : undefined,
      q: q || undefined,
      reviewed,
      sort,
    }),
    [category, tags, q, reviewed, sort]
  )

  const filtered = useMemo(
    () => filterBookmarks(bookmarks, filters),
    [bookmarks, filters]
  )

  const reviewedCounts = useMemo(() => {
    const base = filterBookmarks(bookmarks, {
      category,
      tags: tags.length > 0 ? tags : undefined,
      q: q || undefined,
    })
    const yes = base.filter((b) => isReviewed(b)).length
    return { all: base.length, yes, no: base.length - yes }
  }, [bookmarks, category, tags, q])

  const filtersActive = hasActiveNarrowingFilters(filters)

  const filterSig = `${category ?? ""}-${tags.join(",")}-${reviewed}-${sort}-${q}`
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [lastSig, setLastSig] = useState(filterSig)
  if (filterSig !== lastSig) {
    setVisibleCount(PAGE_SIZE)
    setLastSig(filterSig)
  }

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <BookmarkSearchInput />
        <FiltersPopover tagMap={tagMap} category={category} />
      </div>

      {categoryMap && (
        <CategoryChipRow
          categoryMap={categoryMap}
          categoryCounts={categoryCounts}
          activeCategory={category}
        />
      )}

      <ReviewedTabs counts={reviewedCounts} />

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "bookmark" : "bookmarks"}
        </p>
        {tags.length > 0 && (
          <ul className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <FilterChipButton
                  active
                  className="h-7 px-3 text-xs"
                  aria-label={`Remove tag filter ${tag}`}
                  onClick={() =>
                    setTags((prev) => {
                      const next = prev.filter((t) => t !== tag)
                      return next.length === 0 ? null : next
                    })
                  }
                >
                  {tag}
                  <span aria-hidden>&times;</span>
                </FilterChipButton>
              </li>
            ))}
          </ul>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
          <p className="text-base font-medium text-foreground">No bookmarks found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different filter or check back soon.
          </p>
          {filtersActive && (
            <div className="mt-4">
              <ClearFiltersButton className={CLEAR_BUTTON_CLASS} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((bookmark) => (
              <li key={bookmark.id}>
                <BookmarkCard bookmark={bookmark} categoryMap={categoryMap} />
              </li>
            ))}
          </ul>
          {hasMore ? (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                Load more
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
