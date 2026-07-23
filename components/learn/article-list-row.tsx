import Link from "next/link"
import { type Post } from "content-collections"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { categoryLabel, formatPostDate } from "@/lib/posts"

type ArticleListRowProps = {
  post: Post & { isDraft: boolean }
}

export function ArticleListRow({ post }: ArticleListRowProps) {
  return (
    <Link
      href={`/learn/articles/${post.slug}`}
      className="group flex items-baseline justify-between gap-4 py-4"
    >
      <span className="flex items-baseline gap-2">
        <span className="font-heading text-lg tracking-tight text-foreground group-hover:underline group-hover:underline-offset-4 md:text-xl">
          {post.title}
        </span>
        {post.isDraft ? (
          <span className="rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            DRAFT
          </span>
        ) : null}
      </span>
      <span className="flex shrink-0 items-baseline gap-2 text-xs text-muted-foreground">
        <span className="hidden sm:inline">{categoryLabel[post.category]}</span>
        <span aria-hidden className="hidden sm:inline">
          ·
        </span>
        <span>{formatPostDate(post.publishedAt) || "Unscheduled"}</span>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={14}
          className="hidden self-center opacity-0 transition-opacity group-hover:opacity-100 md:block"
        />
      </span>
    </Link>
  )
}
