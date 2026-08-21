import type { ComponentPropsWithRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * hero-band: the full-bleed hero surface primitive from DESIGN.md.
 * Pages compose hero moments via the `tone` prop rather than restyling
 * sections ad-hoc. Owns the band padding (spacing.3xl vertical / spacing.xl
 * horizontal, mirroring content-band) and centres its children in a
 * max-width column.
 *   light -- warm-bone/canvas hero (the default top-of-page moment)
 *   dark  -- warm-dark ink canvas with accent headline text; reserved for the
 *            locked polarity-flip moments (homepage closing CTA) per ADR 0006.
 */
const heroBandVariants = cva("w-full px-8 py-12", {
  variants: {
    tone: {
      light: "bg-background text-foreground",
      // In dark polarity the ink band resolves to the warm-dark card token
      // (ADR 0006) instead of bg-foreground, which would flip it to a light
      // band.
      dark: "bg-foreground text-background dark:bg-card dark:text-card-foreground",
    },
  },
  defaultVariants: {
    tone: "light",
  },
})

type HeroBandProps = ComponentPropsWithRef<"section"> &
  VariantProps<typeof heroBandVariants>

function HeroBand({ className, tone, children, ref, ...props }: HeroBandProps) {
  return (
    <section
      ref={ref}
      className={cn(heroBandVariants({ tone }), className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {children}
      </div>
    </section>
  )
}

export { HeroBand, heroBandVariants }
