import { cn } from "@/lib/utils"

export type TileDelay = 0 | 75 | 150 | 200 | 300 | 500 | 700

const delayClass: Record<TileDelay, string> = {
  0: "",
  75: "motion-safe:delay-75",
  150: "motion-safe:delay-150",
  200: "motion-safe:delay-200",
  300: "motion-safe:delay-300",
  500: "motion-safe:delay-500",
  700: "motion-safe:delay-700",
}

// fill-mode-backwards keeps delayed tiles invisible until their turn.
export function tileClass(delay: TileDelay = 0, className?: string) {
  return cn(
    "rounded-2xl border border-border bg-card",
    "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:fill-mode-backwards",
    delayClass[delay],
    className
  )
}

export function BentoTile({
  delay = 0,
  className,
  children,
}: {
  delay?: TileDelay
  className?: string
  children: React.ReactNode
}) {
  return <section className={tileClass(delay, className)}>{children}</section>
}
