"use client"

import { useQueryState, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs"
import { reviewedValues, sortValues } from "@/lib/bookmarks-filter"

type Props = {
  className?: string
  keepSearch?: boolean
  keepReviewed?: boolean
}

export function ClearFiltersButton({
  className,
  keepSearch = false,
  keepReviewed = false,
}: Props) {
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
    if (!keepSearch) setQ(null)
    if (!keepReviewed) setReviewed(null)
    setTags(null)
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
