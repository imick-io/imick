import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { type Recipe } from "@/lib/recipes"
import { cn } from "@/lib/utils"
import { tileClass, type TileDelay } from "./bento-tile"
import { BrandEmoji } from "./brand-emoji"

export function CookingTile({
  recipes,
  recipeCount,
  delay,
  className,
}: {
  recipes: Recipe[]
  recipeCount: number
  delay?: TileDelay
  className?: string
}) {
  return (
    <Link
      href="/cooking"
      className={tileClass(
        delay,
        cn(
          "group flex flex-col justify-between gap-8 p-6 transition-colors hover:border-foreground md:p-8",
          className
        )
      )}
    >
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        Cooking
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {recipes.map((recipe) => (
          <span
            key={recipe.slug}
            className="flex flex-col items-center gap-3 rounded-lg bg-muted px-3 py-5 transition-transform duration-300 group-hover:[&:nth-child(odd)]:-rotate-2 group-hover:[&:nth-child(even)]:rotate-2"
          >
            <BrandEmoji
              slug={recipe.slug}
              className="h-14 w-14 md:h-16 md:w-16"
            />
            <span className="text-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {recipe.name}
            </span>
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-normal tracking-tight text-foreground md:text-3xl">
          {recipeCount} recipes, weighed in grams.
        </h2>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
          Browse the kitchen
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
