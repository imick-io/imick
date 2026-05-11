"use client"

import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs"
import { cn } from "@/lib/utils"
import type { TagMap } from "@/lib/bookmarks-filter"

type Props = {
  tagMap: TagMap
  category: string | undefined
}

export function TagChipRow({ tagMap, category }: Props) {
  const [tags, setTags] = useQueryState(
    "tag",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  )

  const available = tagMap[category ?? ""] ?? []
  if (available.length === 0) return null

  function toggle(tag: string) {
    setTags((prev) => {
      const next = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
      return next.length === 0 ? null : next
    })
  }

  return (
    <ul className="flex flex-wrap gap-2" role="listbox" aria-label="Filter by tag">
      {available.map((tag) => {
        const active = tags.includes(tag)
        return (
          <li key={tag} role="option" aria-selected={active}>
            <button
              type="button"
              onClick={() => toggle(tag)}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3.5 text-sm transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {tag}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
