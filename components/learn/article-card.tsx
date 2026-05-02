import Link from "next/link"
import Image from "next/image"
import { type Post } from "content-collections"
import { categoryLabel, formatPostDate } from "@/lib/posts"

type ArticleCardProps = {
  post: Post & { isDraft: boolean }
}

export function ArticleCard({ post }: ArticleCardProps) {
  const coverSrc = post.coverImage ?? `/learn/articles/${post.slug}/cover`
  return (
    <Link
      href={`/learn/articles/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-muted/40"
    >
      <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted">
        <Image
          src={coverSrc}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          unoptimized={!post.coverImage}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
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
      </div>
    </Link>
  )
}
