import Link from "next/link"
import Image from "next/image"
import { type Folio } from "content-collections"

type FolioCardProps = {
  folio: Folio & { isDraft: boolean }
}

export function FolioCard({ folio }: FolioCardProps) {
  return (
    <Link
      href={`/learn/folios/${folio.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-muted/40"
    >
      <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted">
        {folio.coverImage ? (
          <Image
            src={folio.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground/20">
              Folio
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {folio.items.length} items
          </span>
          {folio.isDraft ? (
            <span className="rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
              DRAFT
            </span>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:underline">
          {folio.title}
        </h3>
        <p className="text-sm text-muted-foreground">{folio.excerpt}</p>
      </div>
    </Link>
  )
}
