import Link from "next/link"
import Image from "next/image"
import { type Post } from "content-collections"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { categoryLabel, formatPostDate } from "@/lib/posts"

type ArticleListRowProps = {
  post: Post & { isDraft: boolean }
}

export function ArticleListRow({ post }: ArticleListRowProps) {
  const coverSrc = post.coverImage ?? `/learn/articles/${post.slug}/cover`
  return (
    <Link
      href={`/learn/articles/${post.slug}`}
      className="group flex items-center gap-5 py-5"
    >
      <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={coverSrc}
          alt=""
          fill
          sizes="112px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized={!post.coverImage}
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="font-heading text-lg tracking-tight text-foreground group-hover:underline group-hover:underline-offset-4 md:text-xl">
            {post.title}
          </span>
          {post.isDraft ? (
            <span className="rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              DRAFT
            </span>
          ) : null}
        </span>
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          <span>{categoryLabel[post.category]}</span>
          <span aria-hidden>·</span>
          <span className="normal-case tracking-normal">
            {formatPostDate(post.publishedAt) || "Unscheduled"}
          </span>
        </span>
        <span className="line-clamp-1 text-sm text-muted-foreground">
          {post.excerpt}
        </span>
      </span>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        className="hidden shrink-0 opacity-0 transition-opacity group-hover:opacity-100 md:block"
      />
    </Link>
  )
}
