"use client"

import { useActionState } from "react"
import { createBookmark, type CreateBookmarkState } from "../actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function CreateBookmarkForm() {
  const [state, action, pending] = useActionState<CreateBookmarkState | null, FormData>(
    createBookmark,
    null
  )

  const errors = state?.ok === false ? state.errors : {}

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://example.com"
          required
          disabled={pending}
          aria-invalid={!!errors.url}
        />
        {errors.url && <p className="text-sm text-destructive">{errors.url[0]}</p>}
        <p className="text-xs text-muted-foreground">
          Metadata (title, description, logo) will be fetched automatically. Run
          &quot;Generate with AI&quot; on the edit page to fill in the category, tags,
          and review fields.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          type="text"
          placeholder="react, typescript, tooling"
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">Comma-separated. Optional.</p>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Fetching metadata…" : "Create Bookmark"}
      </Button>
    </form>
  )
}
