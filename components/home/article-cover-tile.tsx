import Link from "next/link"
import Image from "next/image"
import { type Post } from "content-collections"
import { categoryLabel, formatPostDate } from "@/lib/posts"
import { cn } from "@/lib/utils"
import { tileClass, type TileDelay } from "./bento-tile"

export function ArticleCoverTile({
  post,
  size,
  delay,
  className,
  withAllArticlesLink = false,
}: {
  post: Post
  size: "large" | "small"
  delay?: TileDelay
  className?: string
  withAllArticlesLink?: boolean
}) {
  const coverSrc = post.coverImage ?? `/learn/articles/${post.slug}/cover`
  const isLarge = size === "large"

  const body = (
    <>
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
        <Image
          src={coverSrc}
          alt=""
          fill
          priority={isLarge}
          sizes={
            isLarge
              ? "(min-width: 1024px) 60vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={!post.coverImage}
        />
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col gap-2",
          isLarge ? "p-6 md:p-8" : "p-5"
        )}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-[0.15em]">
            {categoryLabel[post.category]}
          </span>
          <span aria-hidden>·</span>
          <span>{formatPostDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h3
          className={cn(
            "text-foreground",
            isLarge
              ? "font-heading text-2xl font-normal leading-tight tracking-tight md:text-3xl"
              : "text-base font-semibold leading-snug tracking-tight"
          )}
        >
          {post.title}
        </h3>
        {isLarge ? (
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </>
  )

  const rootClass = tileClass(
    delay,
    cn(
      "group flex flex-col overflow-hidden transition-colors hover:border-foreground",
      className
    )
  )

  if (!withAllArticlesLink) {
    return (
      <Link href={`/learn/articles/${post.slug}`} className={rootClass}>
        {body}
      </Link>
    )
  }

  return (
    <div className={rootClass}>
      <Link
        href={`/learn/articles/${post.slug}`}
        className="flex flex-1 flex-col"
      >
        {body}
      </Link>
      <div className="border-t border-border px-5 py-3">
        <Link
          href="/learn/articles"
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          All articles
        </Link>
      </div>
    </div>
  )
}
