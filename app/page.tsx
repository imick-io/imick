import type { Metadata } from "next"
import { ArticleCoverTile } from "@/components/home/article-cover-tile"
import { BookmarksTile } from "@/components/home/bookmarks-tile"
import { CookingTile } from "@/components/home/cooking-tile"
import { HeroRail } from "@/components/home/hero-rail"
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

export default function HomePage() {
  const [leadPost, ...morePosts] = getFeaturedPosts(3)
  const recipes = getFeaturedRecipes()
  const recipeCount = getAllRecipes().length

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16 lg:grid lg:grid-cols-[minmax(300px,380px)_1fr] lg:gap-12">
      <HeroRail />

      <main className="grid grid-cols-1 gap-4 pt-12 sm:grid-cols-2 lg:pt-0">
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
