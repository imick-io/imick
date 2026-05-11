import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { getFoliosForItem, type FolioItem } from "@/lib/folios"

type Props = {
  type: "article" | "snippet"
  slug: string
}

function itemHref(item: FolioItem): string {
  return item.type === "article"
    ? `/learn/articles/${item.slug}`
    : `/learn/snippets/${item.slug}`
}

export function FolioBanner({ type, slug }: Props) {
  const entries = getFoliosForItem(type, slug)
  if (entries.length === 0) return null

  return (
    <aside
      aria-label="Folios containing this item"
      className="mx-auto flex w-full max-w-3xl flex-col gap-3"
    >
      {entries.map(({ folio, position, total, previous, next }) => (
        <div
          key={folio.slug}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">
              Part of{" "}
              <Link
                href={`/learn/folios/${folio.slug}`}
                className="font-medium text-foreground underline underline-offset-4 decoration-muted-foreground hover:decoration-foreground"
              >
                {folio.title}
              </Link>
            </span>
            <span className="text-xs text-muted-foreground">
              {position} of {total}
            </span>
          </div>
          <nav
            aria-label={`Navigate ${folio.title}`}
            className="flex items-center gap-2"
          >
            {previous ? (
              <Link
                href={itemHref(previous)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                Previous
              </Link>
            ) : null}
            {next ? (
              <Link
                href={itemHref(next)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Next
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            ) : null}
          </nav>
        </div>
      ))}
    </aside>
  )
}
