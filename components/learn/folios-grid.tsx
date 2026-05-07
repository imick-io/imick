"use client"

import { useState } from "react"
import { type Folio } from "content-collections"
import { FolioCard } from "@/components/learn/folio-card"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 12

type Props = {
  folios: Array<Folio & { isDraft: boolean }>
}

export function FoliosGrid({ folios }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (folios.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
        <p className="text-base font-medium text-foreground">No folios found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check back soon for curated reading paths.
        </p>
      </div>
    )
  }

  const visible = folios.slice(0, visibleCount)
  const hasMore = folios.length > visibleCount

  return (
    <div className="flex flex-col gap-10">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((folio) => (
          <li key={folio.slug}>
            <FolioCard folio={folio} />
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  )
}
