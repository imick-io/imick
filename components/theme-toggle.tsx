"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { IconMoon, IconSun } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"
  const next = isDark ? "light" : "dark"

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${next} mode` : "Toggle theme"}
      onClick={() => setTheme(next)}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <IconSun className="size-4 dark:hidden" />
      <IconMoon className="hidden size-4 dark:block" />
    </button>
  )
}
