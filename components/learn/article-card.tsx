import Link from "next/link"
import { type Post } from "content-collections"
import { categoryLabel, formatPostDate } from "@/lib/posts"

type ArticleCardProps = {
  post: Post & { isDraft: boolean }
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link
      href={`/learn/articles/${post.slug}`}
      className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {categoryLabel[post.category]}
        </span>
        {post.isDraft ? (
          <span className="rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
            DRAFT
          </span>
        ) : null}
      </div>
      <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:underline">
        {post.title}
      </h3>
      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
      <div className="mt-auto pt-2 text-xs text-muted-foreground">
        {formatPostDate(post.publishedAt) || "Unscheduled"}
      </div>
    </Link>
  )
}
