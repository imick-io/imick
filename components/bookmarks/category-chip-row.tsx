"use client"

import { FilterChipLink } from "@/components/ui/filter-chip"

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
    <ul
      className="-mx-6 flex flex-nowrap gap-2 overflow-x-auto px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      role="listbox"
      aria-label="Filter by category"
    >
      <li role="option" aria-selected={!activeCategory} className="shrink-0">
        <FilterChipLink href="/bookmarks" scroll={false} active={!activeCategory}>
          All
          <span className="text-xs opacity-60">{totalCount}</span>
        </FilterChipLink>
      </li>
      {categories.map(([slug, label]) => {
        const count = categoryCounts[slug] ?? 0
        if (count === 0) return null
        const isActive = activeCategory === slug
        return (
          <li key={slug} role="option" aria-selected={isActive} className="shrink-0">
            <FilterChipLink href={`/bookmarks/${slug}`} scroll={false} active={isActive}>
              {label}
              <span className="text-xs opacity-60">{count}</span>
            </FilterChipLink>
          </li>
        )
      })}
    </ul>
  )
}
