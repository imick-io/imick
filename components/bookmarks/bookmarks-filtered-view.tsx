"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useQueryState, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs"
import { filterBookmarks, hasActiveNarrowingFilters, reviewedValues, sortValues, type TagMap } from "@/lib/bookmarks-filter"
import type { Bookmark } from "@/lib/bookmarks-meta"
import { BookmarkCard } from "./bookmark-card"
import { BookmarkSearchInput } from "./bookmark-search-input"
import { CategoryChipRow } from "./category-chip-row"
import { TagChipRow } from "./tag-chip-row"
import { ReviewedSegmented } from "./reviewed-segmented"
import { SortSegmented } from "./sort-segmented"
import { ClearFiltersButton } from "./clear-filters-button"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 12

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

  const clearButtonClass =
    "inline-flex h-8 items-center rounded-full border border-border bg-card px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <BookmarkSearchInput />

      {/* Categories */}
      {categoryMap && (
        <CategoryChipRow
          categoryMap={categoryMap}
          categoryCounts={categoryCounts}
          activeCategory={category}
        />
      )}

      {/* Tags */}
      <TagChipRow tagMap={tagMap} category={category} />

      {/* Reviewed + Sort + Clear filters */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <ReviewedSegmented />
        <SortSegmented />
        {filtersActive && <ClearFiltersButton className={clearButtonClass} />}
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "bookmark" : "bookmarks"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
          <p className="text-base font-medium text-foreground">No bookmarks found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different filter or check back soon.
          </p>
          {filtersActive && (
            <div className="mt-4">
              <ClearFiltersButton className={clearButtonClass} />
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
