"use client"

// PROTOTYPE — throwaway. Floating variant switcher for ?variant= UI prototypes.
// Hidden in production builds. Delete once a variant wins.

import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

type PrototypeVariant = {
  key: string
  name: string
}

export function PrototypeSwitcher({
  variants,
  current,
}: {
  variants: PrototypeVariant[]
  current: string
}) {
  const router = useRouter()
  const index = Math.max(
    0,
    variants.findIndex((v) => v.key === current)
  )

  const go = useCallback(
    (direction: number) => {
      const next = variants[(index + direction + variants.length) % variants.length]
      router.replace(`?variant=${next.key}`, { scroll: false })
    },
    [index, router, variants]
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }
      if (event.key === "ArrowLeft") go(-1)
      if (event.key === "ArrowRight") go(1)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [go])

  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-foreground px-2 py-1.5 text-background shadow-lg">
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous variant"
        className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-background/20"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
      </button>
      <span className="min-w-44 text-center font-mono text-xs">
        {variants[index].key} · {variants[index].name}
      </span>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next variant"
        className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-background/20"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
      </button>
    </div>
  )
}
