import { Suspense } from "react"
import type { Metadata } from "next"
import { CookingFilteredView } from "@/components/cooking/cooking-filtered-view"
import { siteConfig } from "@/lib/config"
import { getAllRecipes } from "@/lib/recipes"

const description =
  "A curated collection of tested, simplified recipes. Everything in grams, organized by course and ingredient, filterable by situation."

export const metadata: Metadata = {
  title: "Cooking",
  description,
  alternates: { canonical: "/cooking" },
  openGraph: {
    type: "website",
    url: "/cooking",
    siteName: siteConfig.handle,
    title: `Cooking | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Cooking | ${siteConfig.name}`,
    description,
  },
}

export default function CookingPage() {
  const recipes = getAllRecipes()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Cooking
        </p>
        <h1 className="font-heading text-4xl font-normal tracking-tight text-balance md:text-6xl">
          My recipe <em className="italic">bible</em>.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          Recipes that passed the test, rewritten until they are simple. Everything
          in grams so it scales. Browse by course and ingredient, or narrow by
          situation.
        </p>
      </header>

      {/* nuqs reads search params, which bails out of static rendering up to
          the nearest Suspense boundary. */}
      <Suspense>
        <CookingFilteredView recipes={recipes} />
      </Suspense>
    </div>
  )
}
