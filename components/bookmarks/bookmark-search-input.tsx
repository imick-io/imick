"use client"

import { useRef, useTransition } from "react"
import { useQueryState, parseAsString } from "nuqs"
import { Input } from "@/components/ui/input"

export function BookmarkSearchInput() {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""))
  const [, startTransition] = useTransition()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      startTransition(() => {
        setQ(value.trim() ? value : null)
      })
    }, 200)
  }

  return (
    <Input
      type="search"
      placeholder="Search bookmarks..."
      defaultValue={q}
      onChange={handleChange}
      className="max-w-sm"
    />
  )
}
