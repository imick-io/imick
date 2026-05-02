"use client"

import { useState } from "react"
import { type Post } from "content-collections"
import { ArticleCard } from "@/components/learn/article-card"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 12

type Props = {
  posts: Array<Post & { isDraft: boolean }>
}

export function ArticlesGrid({ posts }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
        <p className="text-base font-medium text-foreground">No articles found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different category or check back soon.
        </p>
      </div>
    )
  }

  const visible = posts.slice(0, visibleCount)
  const hasMore = posts.length > visibleCount

  return (
    <div className="flex flex-col gap-10">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <li key={post.slug}>
            <ArticleCard post={post} />
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
