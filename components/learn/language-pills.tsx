import Link from "next/link"
import { cn } from "@/lib/utils"

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
            <Link
              href={href}
              scroll={false}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3.5 text-sm capitalize transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
