"use client"

import { useQueryState, parseAsStringLiteral } from "nuqs"
import { cn } from "@/lib/utils"
import type { ReviewedFilter } from "@/lib/bookmarks-filter"

const options: Array<{ value: ReviewedFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "yes", label: "Reviewed" },
  { value: "no", label: "Unreviewed" },
]

const reviewedValues = ["all", "yes", "no"] as const

export function ReviewedSegmented() {
  const [reviewed, setReviewed] = useQueryState(
    "reviewed",
    parseAsStringLiteral(reviewedValues).withDefault("all")
  )

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Reviewed
      </p>
      <ul className="flex items-center gap-2">
        {options.map((option) => {
          const isActive = reviewed === option.value
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() =>
                  setReviewed(option.value === "all" ? null : option.value)
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
