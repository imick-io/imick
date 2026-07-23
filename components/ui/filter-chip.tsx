import Link from "next/link"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const chipClass = (active: boolean | undefined, className?: string) =>
  cn(
    "inline-flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors",
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border bg-card text-muted-foreground hover:text-foreground",
    className
  )

type ChipProps = { active?: boolean }

function FilterChipLink({
  active,
  className,
  ...props
}: ComponentProps<typeof Link> & ChipProps) {
  return <Link className={chipClass(active, className)} {...props} />
}

function FilterChipButton({
  active,
  className,
  ...props
}: ComponentProps<"button"> & ChipProps) {
  return (
    <button type="button" className={chipClass(active, className)} {...props} />
  )
}

export { FilterChipLink, FilterChipButton }
