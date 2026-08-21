import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
 * Bookmark pills: small informational chips shared by the card and detail
 * views, so their styling lives in one place. Category and Tag stay neutral --
 * Brand Accent is reserved for the active/selected pill state on the filter row
 * (see filter-chip.tsx). Category reads as the louder neutral, Tags the quieter
 * one; Reviewed uses the accent to mark curated entries.
 */
const bookmarkPillVariants = cva("inline-flex items-center rounded-pill", {
  variants: {
    variant: {
      category:
        "border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground",
      tag: "bg-muted px-2 py-0.5 text-[11px] text-muted-foreground",
      reviewed:
        "bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground",
    },
  },
  defaultVariants: {
    variant: "tag",
  },
})

type BookmarkPillProps = ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof bookmarkPillVariants>

export function BookmarkPill({ className, variant, ...props }: BookmarkPillProps) {
  return (
    <span className={cn(bookmarkPillVariants({ variant }), className)} {...props} />
  )
}
