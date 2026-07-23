import { FilterChipLink } from "@/components/ui/filter-chip"

const CATEGORIES = [
  { value: null, label: "All" },
  { value: "opinion", label: "Opinion" },
  { value: "technical", label: "Technical" },
  { value: "other", label: "Other" },
] as const

export type CategoryValue = "opinion" | "technical" | "other"

const VALID_VALUES = new Set<string>(["opinion", "technical", "other"])

export function isValidCategory(value: string | undefined): value is CategoryValue {
  return value !== undefined && VALID_VALUES.has(value)
}

type CategoryPillsProps = {
  active: CategoryValue | undefined
}

export function CategoryPills({ active }: CategoryPillsProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = (cat.value ?? null) === (active ?? null)
        const href = cat.value
          ? `/learn/articles?category=${cat.value}`
          : "/learn/articles"
        return (
          <li key={cat.label}>
            <FilterChipLink href={href} scroll={false} active={isActive}>
              {cat.label}
            </FilterChipLink>
          </li>
        )
      })}
    </ul>
  )
}
