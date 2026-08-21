import { Suspense } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Clock01Icon, Dish01Icon } from "@hugeicons/core-free-icons"
import { RecipeLinkSection } from "@/components/cooking/recipe-link-section"
import { DraftBadge } from "@/components/ui/draft-badge"
import { RecipeView } from "@/components/cooking/recipe-view"
import { siteConfig } from "@/lib/config"
import {
  formatMinutes,
  formatMinutesISO,
  getAllRecipes,
  getComponentRecipes,
  getRecipeBySlug,
  getRecipesUsing,
  getRelatedRecipes,
  type Recipe,
} from "@/lib/recipes"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getAllRecipes().map((recipe) => ({ slug: recipe.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)
  if (!recipe) return {}
  const url = `/cooking/${recipe.slug}`
  return {
    title: recipe.name,
    description: recipe.intro,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.handle,
      title: recipe.name,
      description: recipe.intro,
      images: [{ url: recipe.image, alt: recipe.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.name,
      description: recipe.intro,
      images: [recipe.image],
    },
  }
}

export default async function RecipePage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)
  if (!recipe) notFound()

  const related = getRelatedRecipes(recipe)
  const toLink = (r: Recipe) => ({ slug: r.slug, name: r.name, course: r.course })
  const components = getComponentRecipes(recipe).map(toLink)
  const usedIn = getRecipesUsing(recipe.slug).map(toLink)
  const url = `/cooking/${recipe.slug}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    description: recipe.intro,
    image: `${siteConfig.url}${recipe.image}`,
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    recipeCategory: recipe.course,
    keywords: recipe.tags.join(", "),
    totalTime: formatMinutesISO(recipe.minutes),
    recipeYield: `${recipe.servings} servings`,
    recipeIngredient: recipe.ingredients.map((ing) =>
      ing.grams !== undefined ? `${ing.grams} g ${ing.item}` : `${ing.item}${ing.note ? ` (${ing.note})` : ""}`
    ),
    recipeInstructions: recipe.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step.text,
    })),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}${url}` },
  }

  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/cooking" className="hover:text-foreground">
          Cooking
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <Link
          href={`/cooking?course=${encodeURIComponent(recipe.course)}`}
          className="hover:text-foreground"
        >
          {recipe.course}
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        <span className="truncate text-foreground">{recipe.name}</span>
      </nav>

      <header className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {recipe.course} · {recipe.primary}
        </p>
        <span className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl font-normal tracking-tight md:text-5xl">
            {recipe.name}
          </h1>
          {recipe.isDraft ? <DraftBadge /> : null}
        </span>
        <p className="max-w-2xl text-lg text-muted-foreground">{recipe.intro}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <HugeiconsIcon icon={Clock01Icon} size={14} />
            {formatMinutes(recipe.minutes)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HugeiconsIcon icon={Dish01Icon} size={14} />
            {recipe.servings} servings
          </span>
        </div>
      </header>

      <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={recipe.image}
          alt={recipe.imageAlt}
          fill
          sizes="(min-width: 896px) 896px, 100vw"
          className="object-cover"
          priority
        />
      </figure>

      <RecipeLinkSection title="Components" recipes={components} />

      {/* nuqs reads search params, which bails out of static rendering up to
          the nearest Suspense boundary. */}
      <Suspense>
        <RecipeView
          ingredients={recipe.ingredients}
          steps={recipe.steps}
          servings={recipe.servings}
        />
      </Suspense>

      <RecipeLinkSection title="Used in" recipes={usedIn} />

      <footer className="flex flex-col gap-8 border-t border-border pt-6">
        <ul className="flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/cooking?tag=${encodeURIComponent(tag)}`}
                className="inline-flex rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>

        {related.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              More like this
            </h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/cooking/${r.slug}`}
                    className="group flex flex-col gap-2"
                  >
                    <span className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted">
                      <Image
                        src={r.image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </span>
                    <span className="text-sm font-medium underline-offset-4 group-hover:underline">
                      {r.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {r.primary} · {formatMinutes(r.minutes)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </footer>
    </article>
  )
}
