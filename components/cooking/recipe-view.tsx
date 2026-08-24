"use client"

import { useState } from "react"
import { useQueryState, parseAsStringLiteral } from "nuqs"
import { HugeiconsIcon } from "@hugeicons/react"
import { WeightScaleIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { Ingredient, Step } from "@/lib/recipes"
import { localizeTemps, TEMP_UNITS } from "@/lib/temperature"

const SCALES = [0.5, 1, 2] as const
const VIEWS = ["classic", "consolidated"] as const

type Props = {
  ingredients: Ingredient[]
  steps: Step[]
  servings: number
}

function formatAmount(ing: Ingredient, scale: number): string {
  if (ing.grams === undefined) return ing.note ?? ""
  const grams = `${Math.round(ing.grams * scale)} g`
  return ing.note ? `${grams} · ${ing.note}` : grams
}

export function RecipeView({ ingredients, steps, servings }: Props) {
  const [view, setView] = useQueryState(
    "view",
    parseAsStringLiteral(VIEWS).withDefault("classic")
  )
  const [unit, setUnit] = useQueryState(
    "unit",
    parseAsStringLiteral(TEMP_UNITS).withDefault("c")
  )
  const [scale, setScale] = useState<number>(1)

  const byItem = new Map(ingredients.map((ing) => [ing.item, ing]))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Recipe view"
          className="inline-flex rounded-lg border border-border bg-card p-0.5"
        >
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v === "classic" ? null : v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm capitalize transition-colors",
                view === v
                  ? "bg-foreground font-medium text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={WeightScaleIcon}
            size={14}
            className="text-muted-foreground"
          />
          {SCALES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={scale === s}
              onClick={() => setScale(s)}
              className={cn(
                "rounded-full px-2.5 py-1 font-mono text-xs transition-colors",
                scale === s
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s}x
            </button>
          ))}
          <span aria-hidden className="text-border">
            |
          </span>
          {TEMP_UNITS.map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              aria-label={u === "c" ? "Show temperatures in Celsius" : "Show temperatures in Fahrenheit"}
              onClick={() => setUnit(u === "c" ? null : u)}
              className={cn(
                "rounded-full px-2.5 py-1 font-mono text-xs transition-colors",
                unit === u
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              °{u.toUpperCase()}
            </button>
          ))}
          <span className="ml-1 text-sm text-muted-foreground">
            {servings * scale} {servings * scale === 1 ? "serving" : "servings"}
          </span>
        </div>
      </div>

      {view === "classic" ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[300px_minmax(0,1fr)]">
          <aside>
            <div className="flex flex-col gap-3 md:sticky md:top-24">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Ingredients
              </h2>
              <ul className="divide-y divide-border border-y border-border">
                {ingredients.map((ing) => (
                  <li
                    key={ing.item}
                    className="flex items-baseline justify-between gap-4 py-2 text-sm"
                  >
                    <span>{ing.item}</span>
                    <span className="min-w-0 text-right font-mono text-xs text-muted-foreground">
                      {formatAmount(ing, scale)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="flex flex-col gap-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Method
            </h2>
            <ol className="flex flex-col gap-4">
              {steps.map((step, i) => (
                <li key={step.text} className="flex gap-4 text-base leading-relaxed">
                  <span className="shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {localizeTemps(step.text, unit)}
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : (
        <section className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Method, ingredients included
          </h2>
          <ol className="flex flex-col divide-y divide-border border-y border-border">
            {steps.map((step, i) => {
              const used = (step.uses ?? [])
                .map((item) => byItem.get(item))
                .filter((ing): ing is Ingredient => ing !== undefined)
              return (
                <li key={step.text} className="flex gap-4 py-4">
                  <span className="shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                    <p className="text-base leading-relaxed">
                      {localizeTemps(step.text, unit)}
                    </p>
                    {used.length > 0 && (
                      <ul className="flex flex-col gap-1 rounded-lg border border-border bg-card/50 px-3 py-2">
                        {used.map((ing) => (
                          <li
                            key={ing.item}
                            className="flex items-baseline justify-between gap-4 text-sm"
                          >
                            <span>{ing.item}</span>
                            <span className="min-w-0 text-right font-mono text-xs text-muted-foreground">
                              {formatAmount(ing, scale)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      )}
    </div>
  )
}
