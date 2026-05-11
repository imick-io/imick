"use client"

import { useQueryState, parseAsStringLiteral } from "nuqs"
import { filterBookmarks, reviewedValues } from "@/lib/bookmarks-filter"
import { BookmarksGrid } from "./bookmarks-grid"
import type { Bookmark } from "@/lib/bookmarks-meta"

type Props = {
  bookmarks: Bookmark[]
  categoryMap?: Record<string, string>
}

export function ReviewedBookmarksGrid({ bookmarks, categoryMap }: Props) {
  const [reviewed] = useQueryState(
    "reviewed",
    parseAsStringLiteral(reviewedValues).withDefault("all")
  )

  const filtered = filterBookmarks(bookmarks, { reviewed })

  return <BookmarksGrid key={reviewed} bookmarks={filtered} categoryMap={categoryMap} />
}
