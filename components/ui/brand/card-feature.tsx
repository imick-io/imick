import { forwardRef, type ComponentPropsWithoutRef } from "react"
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
 * Full brand tokens (cobalt accent, bone canvas) arrive with the Foundation
 * PR; until then these resolve against the current token set.
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

type CardFeatureProps = ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof cardFeatureVariants>

const CardFeature = forwardRef<HTMLDivElement, CardFeatureProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFeatureVariants({ variant }), className)}
      {...props}
    />
  )
)
CardFeature.displayName = "CardFeature"

export { CardFeature, cardFeatureVariants }
