"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  useQueryState,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { DraftBadge } from "@/components/ui/draft-badge"
import { FilterChipButton } from "@/components/ui/filter-chip"
import { cn } from "@/lib/utils"
import {
  COURSES,
  RECIPE_TAGS,
  formatMinutes,
  type Course,
  type Recipe,
} from "@/lib/recipes"
import {
  courseCounts,
  filterRecipes,
  groupByCourse,
  hasActiveFilters,
  ingredientsByCourse,
} from "@/lib/recipes-filter"

type Props = {
  recipes: Recipe[]
}

export function CookingFilteredView({ recipes }: Props) {
  const [course, setCourse] = useQueryState(
    "course",
    parseAsStringLiteral(COURSES)
  )
  const [ingredient, setIngredient] = useQueryState("ingredient", parseAsString)
  const [tags, setTags] = useQueryState(
    "tag",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  )
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""))

  const filters = useMemo(
    () => ({
      course: course ?? undefined,
      ingredient: ingredient ?? undefined,
      tags: tags.length > 0 ? tags : undefined,
      q: q || undefined,
    }),
    [course, ingredient, tags, q]
  )

  const filtered = useMemo(() => filterRecipes(recipes, filters), [recipes, filters])
  const grouped = useMemo(() => groupByCourse(filtered), [filtered])
  const counts = useMemo(() => courseCounts(recipes), [recipes])
  const ingredientMap = useMemo(() => ingredientsByCourse(recipes), [recipes])

  function selectCourse(next: Course | null) {
    setCourse(next)
    setIngredient(null)
  }

  function toggleTag(tag: string) {
    setTags((prev) => {
      const next = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
      return next.length === 0 ? null : next
    })
  }

  function clearFilters() {
    setCourse(null)
    setIngredient(null)
    setTags(null)
    setQ(null)
  }

  const treeItemClass = (active: boolean) =>
    cn(
      "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
      active
        ? "bg-foreground font-medium text-background"
        : "text-muted-foreground hover:bg-card hover:text-foreground"
    )

  return (
    <div className="flex flex-col gap-10 md:flex-row">
      <aside className="shrink-0 md:w-56">
        <div className="flex flex-col gap-6 md:sticky md:top-24">
          <nav aria-label="Courses" className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => selectCourse(null)}
              className={treeItemClass(course === null)}
            >
              All recipes
              <span className="float-right font-mono text-xs opacity-60">
                {recipes.length}
              </span>
            </button>
            {COURSES.map((c) => (
              <div key={c} className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => selectCourse(course === c ? null : c)}
                  className={treeItemClass(course === c && ingredient === null)}
                >
                  {c}
                  <span className="float-right font-mono text-xs opacity-60">
                    {counts[c]}
                  </span>
                </button>
                {course === c && (
                  <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-2">
                    {ingredientMap[c].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setIngredient(ingredient === p ? null : p)}
                        className={cn(treeItemClass(ingredient === p), "py-1 text-xs")}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex flex-col gap-2 border-t border-border pt-5">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Situation
            </p>
            <div className="flex flex-wrap gap-1.5">
              {RECIPE_TAGS.map((tag) => (
                <FilterChipButton
                  key={tag}
                  active={tags.includes(tag)}
                  aria-pressed={tags.includes(tag)}
                  className="h-6 px-2.5 text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </FilterChipButton>
              ))}
            </div>
          </div>

          {hasActiveFilters(filters) && (
            <button
              type="button"
              onClick={clearFilters}
              className="self-start text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value || null)}
              placeholder="Search recipes and ingredients"
              className="h-9 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          <p className="shrink-0 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}
          </p>
        </div>

        {grouped.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
            <p className="text-base font-medium text-foreground">No recipes found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different filter or search term.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-8 items-center rounded-full border border-border bg-card px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          grouped.map(({ course: c, recipes: courseRecipes }) => (
            <section key={c} className="flex flex-col">
              <h2 className="border-b border-border pb-3 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {c}
              </h2>
              <ul className="divide-y divide-border">
                {courseRecipes.map((recipe) => (
                  <li key={recipe.slug}>
                    <Link
                      href={`/cooking/${recipe.slug}`}
                      className="group flex w-full items-center gap-4 py-3"
                    >
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                        <Image
                          src={recipe.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium underline-offset-4 group-hover:underline">
                            {recipe.name}
                          </span>
                          {recipe.isDraft ? <DraftBadge /> : null}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {recipe.primary}
                        </span>
                      </span>
                      <span className="ml-auto flex shrink-0 items-baseline gap-3 font-mono text-xs text-muted-foreground">
                        <span className="hidden md:inline">
                          {recipe.tags.slice(0, 2).join(" · ")}
                        </span>
                        <span>{formatMinutes(recipe.minutes)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
