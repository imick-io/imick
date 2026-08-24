import { type Post } from "content-collections"
import { ArticleCard } from "@/components/learn/article-card"

type Props = {
  posts: Array<Post & { isDraft: boolean }>
}

export function RelatedArticles({ posts }: Props) {
  if (posts.length === 0) return null
  return (
    <section
      aria-labelledby="related-articles-heading"
      className="mx-auto flex w-full max-w-3xl flex-col gap-5"
    >
      <h2 id="related-articles-heading" className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        Related articles
      </h2>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <ArticleCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  )
}
