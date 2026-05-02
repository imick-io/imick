import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/mdx-helpers"

type Props = {
  headings: Heading[]
  className?: string
}

export function TableOfContents({ headings, className }: Props) {
  if (headings.length === 0) return null
  return (
    <nav
      aria-label="Table of contents"
      className={cn("text-sm text-muted-foreground", className)}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">
        On this page
      </p>
      <ul className="flex flex-col gap-1.5">
        {headings.map((h) => (
          <li
            key={h.id}
            className={cn(h.depth === 3 ? "pl-3" : "pl-0")}
          >
            <a
              href={`#${h.id}`}
              className="block leading-snug transition-colors hover:text-foreground"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
