"use client"

import { useQueryState, parseAsStringLiteral } from "nuqs"
import { cn } from "@/lib/utils"
import { sortValues } from "@/lib/bookmarks-filter"
import type { BookmarkSort } from "@/lib/bookmarks-meta"

const options: Array<{ value: BookmarkSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "top-rated", label: "Top Rated" },
]

export function SortSegmented() {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(sortValues).withDefault("newest")
  )

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Sort
      </p>
      <ul className="flex items-center gap-2">
        {options.map((option) => {
          const isActive = sort === option.value
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() =>
                  setSort(option.value === "newest" ? null : option.value)
                }
                className={cn(
                  "inline-flex h-8 items-center rounded-full border px-3.5 text-sm transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
