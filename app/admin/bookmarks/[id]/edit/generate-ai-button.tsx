"use client"

import { useActionState, useEffect, useRef } from "react"
import { generateWithAi, type GenerateAiState } from "../../actions"
import { Button } from "@/components/ui/button"

interface Props {
  bookmarkId: string
  onSuggestedCategory?: (slug: string | null) => void
}

export function GenerateAiButton({ bookmarkId, onSuggestedCategory }: Props) {
  const [state, action, pending] = useActionState<GenerateAiState | null, FormData>(
    generateWithAi,
    null
  )

  const lastHandled = useRef<GenerateAiState | null>(null)
  useEffect(() => {
    if (!state || state === lastHandled.current) return
    lastHandled.current = state
    if (state.ok && onSuggestedCategory) {
      onSuggestedCategory(state.suggestedCategory)
    }
  }, [state, onSuggestedCategory])

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={bookmarkId} />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="force"
            disabled={pending}
            className="size-4 rounded accent-primary"
          />
          <span className="text-xs text-muted-foreground">Force regenerate</span>
        </label>
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending ? "Generating..." : "Generate with AI"}
        </Button>
      </div>
      {state?.ok === true && (
        <p className="text-xs text-green-600 dark:text-green-400">{state.message}</p>
      )}
      {state?.ok === false && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
    </form>
  )
}
