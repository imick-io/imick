import { forwardRef, type ComponentPropsWithoutRef } from "react"
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
      dark: "bg-foreground text-background",
    },
  },
  defaultVariants: {
    tone: "light",
  },
})

type HeroBandProps = ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof heroBandVariants>

const HeroBand = forwardRef<HTMLElement, HeroBandProps>(
  ({ className, tone, children, ...props }, ref) => (
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
)
HeroBand.displayName = "HeroBand"

export { HeroBand, heroBandVariants }
