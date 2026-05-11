"use client"

import { useQueryState, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs"
import { reviewedValues, sortValues } from "@/lib/bookmarks-filter"

type Props = {
  className?: string
}

export function ClearFiltersButton({ className }: Props) {
  const [, setQ] = useQueryState("q", parseAsString.withDefault(""))
  const [, setTags] = useQueryState(
    "tag",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  )
  const [, setReviewed] = useQueryState(
    "reviewed",
    parseAsStringLiteral(reviewedValues).withDefault("all")
  )
  const [, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(sortValues).withDefault("newest")
  )

  function handleClear() {
    setQ(null)
    setTags(null)
    setReviewed(null)
    setSort(null)
  }

  return (
    <button
      type="button"
      onClick={handleClear}
      className={className}
    >
      Clear filters
    </button>
  )
}
