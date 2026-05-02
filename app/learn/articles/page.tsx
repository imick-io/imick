import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { getAllPostsForRender, formatPostDate, categoryLabel } from "@/lib/posts"

const description = `Articles by ${siteConfig.name} — opinions and technical deep-dives.`

export const metadata: Metadata = {
  title: "Articles",
  description,
  alternates: { canonical: "/learn/articles" },
  openGraph: {
    type: "website",
    url: "/learn/articles",
    siteName: siteConfig.handle,
    title: `Articles | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Articles | ${siteConfig.name}`,
    description,
  },
}

export default function ArticlesIndexPage() {
  const posts = getAllPostsForRender()

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Learn</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Articles</h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Opinions, technical write-ups, and notes from the work.
        </p>
      </header>

      <section className="mx-auto w-full max-w-5xl">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
            <p className="text-base font-medium text-foreground">First article coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The first post is being written. Check back shortly.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
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
                  <h2 className="text-lg font-semibold leading-snug text-foreground group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-auto pt-2 text-xs text-muted-foreground">
                    {formatPostDate(post.publishedAt) || "Unscheduled"}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
