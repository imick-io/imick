import Link from "next/link"
import Image from "next/image"
import { type Post } from "content-collections"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { categoryLabel, formatPostDate } from "@/lib/posts"

type FeaturedArticleProps = {
  post: Post & { isDraft: boolean }
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  const coverSrc = post.coverImage ?? `/learn/articles/${post.slug}/cover`
  return (
    <Link
      href={`/learn/articles/${post.slug}`}
      className="group grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground md:grid-cols-[3fr_2fr]"
    >
      <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted md:aspect-auto md:min-h-full">
        <Image
          src={coverSrc}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 60vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          unoptimized={!post.coverImage}
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-[0.15em]">
            {categoryLabel[post.category]}
          </span>
          <span aria-hidden>·</span>
          <span>{formatPostDate(post.publishedAt) || "Unscheduled"}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
          {post.isDraft ? (
            <span className="rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 font-medium text-destructive">
              DRAFT
            </span>
          ) : null}
        </div>
        <h3 className="font-heading text-2xl leading-tight tracking-tight text-foreground md:text-4xl">
          {post.title}
        </h3>
        <p className="text-base leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
          Read article
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  )
}
