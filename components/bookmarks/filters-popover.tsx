"use client"

import { useQueryState, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs"
import { HugeiconsIcon } from "@hugeicons/react"
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons"
import {
  countActivePopoverFilters,
  sortValues,
  type TagMap,
} from "@/lib/bookmarks-filter"
import type { BookmarkSort } from "@/lib/bookmarks-meta"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FilterChipButton } from "@/components/ui/filter-chip"
import { ClearFiltersButton } from "./clear-filters-button"

const sortOptions: Array<{ value: BookmarkSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "top-rated", label: "Top rated (reviewed only)" },
]

type Props = {
  tagMap: TagMap
  category?: string
}

export function FiltersPopover({ tagMap, category }: Props) {
  const [tags, setTags] = useQueryState(
    "tag",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  )
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(sortValues).withDefault("newest")
  )

  const availableTags = tagMap[category ?? ""] ?? []
  const activeCount = countActivePopoverFilters({
    tags: tags.length > 0 ? tags : undefined,
    sort,
  })

  function toggleTag(tag: string) {
    setTags((prev) => {
      const next = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
      return next.length === 0 ? null : next
    })
  }

  return (
    <Popover>
      <PopoverTrigger className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-expanded:text-foreground">
        <HugeiconsIcon icon={FilterHorizontalIcon} strokeWidth={2} className="size-4" />
        Filters
        {activeCount > 0 && (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="flex w-[min(20rem,calc(100vw-2rem))] max-h-[70vh] flex-col gap-5 overflow-y-auto">
        <fieldset className="flex flex-col gap-2">
          <legend className="pb-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Sort
          </legend>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <FilterChipButton
                key={option.value}
                active={sort === option.value}
                aria-pressed={sort === option.value}
                onClick={() =>
                  setSort(option.value === "newest" ? null : option.value)
                }
              >
                {option.label}
              </FilterChipButton>
            ))}
          </div>
        </fieldset>

        {availableTags.length > 0 && (
          <fieldset className="flex flex-col gap-2">
            <legend className="pb-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Tags
            </legend>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <FilterChipButton
                  key={tag}
                  active={tags.includes(tag)}
                  aria-pressed={tags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </FilterChipButton>
              ))}
            </div>
          </fieldset>
        )}

        {activeCount > 0 && (
          <div className="border-t border-border pt-3">
            <ClearFiltersButton
              keepSearch
              keepReviewed
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
