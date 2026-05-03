"use client"

import { useActionState } from "react"
import { refetchMetadata, type RefetchState } from "../../actions"
import { Button } from "@/components/ui/button"

export function RefetchButton({ bookmarkId }: { bookmarkId: string }) {
  const [state, action, pending] = useActionState<RefetchState | null, FormData>(
    refetchMetadata,
    null
  )

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={bookmarkId} />
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Fetching…" : "Re-fetch metadata"}
      </Button>
      {state?.ok === true && (
        <p className="text-xs text-green-600 dark:text-green-400">{state.message}</p>
      )}
      {state?.ok === false && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
    </form>
  )
}
