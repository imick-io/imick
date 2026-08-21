import Link from "next/link"
import type { Course } from "@/lib/recipes"

export type RecipeLink = {
  slug: string
  name: string
  course: Course
}

// Server-rendered on purpose: these links are static recipe data, kept outside
// the Suspense boundary that clientizes the query-state-driven RecipeView.
export function RecipeLinkSection({
  title,
  recipes,
}: {
  title: string
  recipes: RecipeLink[]
}) {
  if (recipes.length === 0) return null
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {recipes.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/cooking/${r.slug}`}
              className="group inline-flex items-baseline gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-ring"
            >
              <span className="font-medium underline-offset-4 group-hover:underline">
                {r.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{r.course}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
