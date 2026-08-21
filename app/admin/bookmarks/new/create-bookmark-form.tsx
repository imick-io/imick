"use client"

import { useActionState } from "react"
import { batchCreateBookmarks, type BatchCreateState } from "../actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function CreateBookmarkForm() {
  const [state, action, pending] = useActionState<BatchCreateState | null, FormData>(
    batchCreateBookmarks,
    null
  )

  const error = state?.ok === false ? state.error : null

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="urls">URLs</Label>
        <Textarea
          id="urls"
          name="urls"
          rows={10}
          placeholder={"https://example.com\nhttps://another.com"}
          required
          disabled={pending}
          aria-invalid={!!error}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          One URL per line (commas and spaces also work). Each becomes a Draft;
          duplicates and URLs you already have are skipped. Metadata and AI
          fields are filled in later in the background.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Shared tags</Label>
        <Input
          id="tags"
          name="tags"
          type="text"
          placeholder="react, typescript, tooling"
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated. Applied to every URL in this paste. Optional.
        </p>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating drafts…" : "Create Drafts"}
      </Button>
    </form>
  )
}
