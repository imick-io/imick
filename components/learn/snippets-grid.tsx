"use client"

import { useState } from "react"
import { type Snippet } from "content-collections"
import { SnippetCard } from "@/components/learn/snippet-card"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 12

type Props = {
  snippets: Array<Snippet & { isDraft: boolean }>
}

export function SnippetsGrid({ snippets }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (snippets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
        <p className="text-base font-medium text-foreground">No snippets found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different language or check back soon.
        </p>
      </div>
    )
  }

  const visible = snippets.slice(0, visibleCount)
  const hasMore = snippets.length > visibleCount

  return (
    <div className="flex flex-col gap-10">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((snippet) => (
          <li key={snippet.slug}>
            <SnippetCard snippet={snippet} />
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
