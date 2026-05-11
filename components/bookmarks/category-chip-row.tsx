"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

const chipBase = "inline-flex h-8 items-center rounded-full border px-3.5 text-sm transition-colors"
const chipActive = "border-foreground bg-foreground text-background"
const chipInactive = "border-border bg-card text-muted-foreground hover:text-foreground"

type Props = {
  categoryMap: Record<string, string>
  categoryCounts: Record<string, number>
  activeCategory: string | undefined
}

export function CategoryChipRow({ categoryMap, categoryCounts, activeCategory }: Props) {
  const totalCount = Object.values(categoryCounts).reduce((sum, n) => sum + n, 0)
  const categories = Object.entries(categoryMap).sort(([, a], [, b]) =>
    a.localeCompare(b)
  )

  return (
    <ul className="flex flex-wrap gap-2" role="listbox" aria-label="Filter by category">
      <li role="option" aria-selected={!activeCategory}>
        <Link
          href="/bookmarks"
          scroll={false}
          className={cn(chipBase, !activeCategory ? chipActive : chipInactive)}
        >
          All ({totalCount})
        </Link>
      </li>
      {categories.map(([slug, label]) => {
        const count = categoryCounts[slug] ?? 0
        if (count === 0) return null
        const isActive = activeCategory === slug
        return (
          <li key={slug} role="option" aria-selected={isActive}>
            <Link
              href={`/bookmarks/${slug}`}
              scroll={false}
              className={cn(chipBase, isActive ? chipActive : chipInactive)}
            >
              {label} ({count})
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
