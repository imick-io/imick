import Link from "next/link"
import { cn } from "@/lib/utils"

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
            <Link
              href={href}
              scroll={false}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3.5 text-sm transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
