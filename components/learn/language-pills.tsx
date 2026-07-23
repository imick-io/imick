import { FilterChipLink } from "@/components/ui/filter-chip"

type LanguagePillsProps = {
  languages: string[]
  active: string | undefined
}

export function LanguagePills({ languages, active }: LanguagePillsProps) {
  const items = [{ value: null, label: "All" }, ...languages.map((l) => ({ value: l, label: l }))]
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive = (item.value ?? null) === (active ?? null)
        const href = item.value
          ? `/learn/snippets?language=${encodeURIComponent(item.value)}`
          : "/learn/snippets"
        return (
          <li key={item.label}>
            <FilterChipLink
              href={href}
              scroll={false}
              active={isActive}
              className="capitalize"
            >
              {item.label}
            </FilterChipLink>
          </li>
        )
      })}
    </ul>
  )
}
