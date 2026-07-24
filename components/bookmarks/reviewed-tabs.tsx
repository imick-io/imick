"use client"

import { useQueryState, parseAsStringLiteral } from "nuqs"
import { reviewedValues, type ReviewedFilter } from "@/lib/bookmarks-filter"

const tabs: Array<{ value: ReviewedFilter; label: string }> = [
  { value: "yes", label: "Reviewed" },
  { value: "no", label: "To review" },
  { value: "all", label: "All" },
]

type Props = {
  counts: Record<ReviewedFilter, number>
}

export function ReviewedTabs({ counts }: Props) {
  const [reviewed, setReviewed] = useQueryState(
    "reviewed",
    parseAsStringLiteral(reviewedValues).withDefault("all")
  )

  return (
    <div
      role="group"
      aria-label="Filter by review status"
      className="flex items-center gap-1 self-start rounded-full border border-border bg-card p-1"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          aria-pressed={reviewed === tab.value}
          onClick={() => setReviewed(tab.value === "all" ? null : tab.value)}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            reviewed === tab.value
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
          <span className="ml-1.5 font-mono text-xs opacity-60">
            {counts[tab.value]}
          </span>
        </button>
      ))}
    </div>
  )
}
