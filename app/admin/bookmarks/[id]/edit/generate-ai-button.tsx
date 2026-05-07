"use client"

import { useActionState } from "react"
import { generateWithAi, type GenerateAiState } from "../../actions"
import { Button } from "@/components/ui/button"

export function GenerateAiButton({ bookmarkId }: { bookmarkId: string }) {
  const [state, action, pending] = useActionState<GenerateAiState | null, FormData>(
    generateWithAi,
    null
  )

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
