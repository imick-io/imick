import type { ComponentPropsWithRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * card-feature: the editorial surface primitive from DESIGN.md.
 * Pages compose surfaces via the `variant` prop rather than restyling cards
 * ad-hoc. Variants map to the surface-contrast elevation vocabulary:
 *   default     -- white/neutral card (the utility default)
 *   sage        -- bone tint
 *   accent-pale -- pale Brand Accent tint
 *   dark        -- ink card with accent text (polarity-flip moments only)
 * Variants resolve against the brand tokens (cobalt accent, bone canvas) set in
 * app/globals.css per ADR 0006.
 */
const cardFeatureVariants = cva(
  "flex flex-col rounded-xl border p-6 transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        sage: "border-border bg-secondary text-secondary-foreground",
        "accent-pale": "border-primary/20 bg-primary/5 text-card-foreground",
        dark: "border-transparent bg-foreground text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type CardFeatureProps = ComponentPropsWithRef<"div"> &
  VariantProps<typeof cardFeatureVariants>

function CardFeature({ className, variant, ref, ...props }: CardFeatureProps) {
  return (
    <div
      ref={ref}
      className={cn(cardFeatureVariants({ variant }), className)}
      {...props}
    />
  )
}

export { CardFeature, cardFeatureVariants }
