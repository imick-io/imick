"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useQueryState, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs"
import { filterBookmarks, reviewedValues, sortValues, type TagMap } from "@/lib/bookmarks-filter"
import type { Bookmark } from "@/lib/bookmarks-meta"
import { BookmarkCard } from "./bookmark-card"
import { TagChipRow } from "./tag-chip-row"
import { ReviewedSegmented } from "./reviewed-segmented"
import { SortSegmented } from "./sort-segmented"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 12

type Props = {
  bookmarks: Bookmark[]
  categoryMap?: Record<string, string>
  tagMap: TagMap
  category?: string
}

export function BookmarksFilteredView({
  bookmarks,
  categoryMap,
  tagMap,
  category,
}: Props) {
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

  const filtered = useMemo(
    () => filterBookmarks(bookmarks, { category, tags: tags.length > 0 ? tags : undefined, reviewed, sort }),
    [bookmarks, category, tags, reviewed, sort]
  )

  const filterSig = `${category ?? ""}-${tags.join(",")}-${reviewed}-${sort}`
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
      <TagChipRow tagMap={tagMap} category={category} />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <ReviewedSegmented />
        <SortSegmented />
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
