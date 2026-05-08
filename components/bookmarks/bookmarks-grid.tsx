"use client"

import { useState } from "react"
import { BookmarkCard } from "@/components/bookmarks/bookmark-card"
import { Button } from "@/components/ui/button"
import type { Bookmark } from "@/lib/bookmarks-meta"

const PAGE_SIZE = 12

type Props = {
  bookmarks: Bookmark[]
  categoryMap?: Record<string, string>
}

export function BookmarksGrid({ bookmarks, categoryMap }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
        <p className="text-base font-medium text-foreground">No bookmarks found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different filter or check back soon.
        </p>
      </div>
    )
  }

  const visible = bookmarks.slice(0, visibleCount)
  const hasMore = bookmarks.length > visibleCount

  return (
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
  )
}
