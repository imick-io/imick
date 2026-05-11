"use client"

import { useQueryState, parseAsStringLiteral } from "nuqs"
import { filterBookmarks } from "@/lib/bookmarks-filter"
import { BookmarksGrid } from "./bookmarks-grid"
import type { Bookmark } from "@/lib/bookmarks-meta"

const reviewedValues = ["all", "yes", "no"] as const

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

  return <BookmarksGrid bookmarks={filtered} categoryMap={categoryMap} />
}
