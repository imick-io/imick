import type { ComponentPropsWithRef, ReactNode } from "react"

import { cn } from "@/lib/utils"

type ContentBandProps = {
  /**
   * Optional section heading rendered in the default display-md slot above the
   * children. Pass a string for the common case, or arbitrary nodes when a
   * page needs richer markup.
   */
  heading?: ReactNode
  /**
   * Extra classes for the inner reading-width column, e.g. prose styling.
   * The column is always centred and capped at a comfortable reading width.
   */
  contentClassName?: string
  children: ReactNode
} & Omit<ComponentPropsWithRef<"section">, "children">

/**
 * White content surface for long-form and editorial content. Owns the band
 * padding (spacing.3xl vertical, spacing.xl horizontal) that mirrors
 * `hero-band`, centres its children in a reading-width column, and exposes a
 * default display-md heading slot. Composable wrapper: children pass straight
 * through, so callers keep full control of the band's contents.
 */
export function ContentBand({
  heading,
  className,
  contentClassName,
  children,
  ref,
  ...props
}: ContentBandProps) {
  return (
    <section
      ref={ref}
      className={cn("w-full bg-card px-8 py-12", className)}
      {...props}
    >
      <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-8", contentClassName)}>
        {heading ? <h2 className="display-md">{heading}</h2> : null}
        {children}
      </div>
    </section>
  )
}
