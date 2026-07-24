import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { ArticleCoverTile } from "@/components/home/article-cover-tile"
import { BookmarksTile } from "@/components/home/bookmarks-tile"
import { CookingTile } from "@/components/home/cooking-tile"
import { SubscribeForm } from "@/components/subscribe-form"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/config"
import { getFeaturedPosts } from "@/lib/featured-posts"
import { getFeaturedRecipes } from "@/lib/home-content"
import { getAllRecipes } from "@/lib/recipes"

const description = `Personal site of ${siteConfig.name}. ${siteConfig.tagline}`

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name}, ${siteConfig.role}` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.handle,
    title: `${siteConfig.name}, ${siteConfig.role}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}, ${siteConfig.role}`,
    description,
  },
}

const heroHeadline = (
  <>
    I build products fast. Then I optimize{" "}
    <em className="italic">everything else</em>.
  </>
)

const heroSubline =
  "Senior Product Engineer. Startup speed, end-to-end. The same obsession runs the rest of my life: my workflow, my tools, even my kitchen. Everything I learn lands here."

export default function HomePage() {
  const [leadPost, ...morePosts] = getFeaturedPosts(3)
  const recipes = getFeaturedRecipes()
  const recipeCount = getAllRecipes().length

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16 lg:grid lg:grid-cols-[minmax(300px,380px)_1fr] lg:gap-12">
      <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:h-fit lg:self-start motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {siteConfig.name} · {siteConfig.role}
          </p>
          <h1 className="font-heading text-4xl font-normal leading-[1.05] tracking-[-0.015em] text-balance md:text-5xl">
            {heroHeadline}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {heroSubline}
          </p>
        </div>
        <div>
          <Link href="/contact" className={buttonVariants({ size: "lg" })}>
            Get in touch
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Link>
        </div>
        <Link
          href="/about"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          More about me
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Link>
        <div className="flex flex-col gap-2 border-t border-border pt-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Newsletter
          </h2>
          <SubscribeForm source="home" variant="compact" />
        </div>
      </aside>

      <main className="grid gap-4 pt-12 sm:grid-cols-2 lg:pt-0">
        {leadPost ? (
          <ArticleCoverTile
            post={leadPost}
            size="large"
            delay={75}
            className="sm:col-span-2"
          />
        ) : null}
        {morePosts.map((post, i) => (
          <ArticleCoverTile
            key={post.slug}
            post={post}
            size="small"
            delay={i === 0 ? 150 : 200}
            withAllArticlesLink={i === morePosts.length - 1}
          />
        ))}
        <CookingTile
          recipes={recipes}
          recipeCount={recipeCount}
          delay={300}
          className="sm:col-span-2"
        />
        <BookmarksTile delay={500} className="sm:col-span-2" />
      </main>
    </div>
  )
}
