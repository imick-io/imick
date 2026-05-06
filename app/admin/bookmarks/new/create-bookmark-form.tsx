"use client"

import { useActionState } from "react"
import { createBookmark, type CreateBookmarkState } from "../actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { CATEGORY_LABELS } from "@/lib/bookmarks-meta"

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
          Metadata (title, description, logo) will be fetched automatically.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          required
          disabled={pending}
          className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-invalid={!!errors.category}
        >
          <option value="">Select a category</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-sm text-destructive">{errors.category[0]}</p>}
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
        <p className="text-xs text-muted-foreground">Comma-separated.</p>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Fetching metadata…" : "Create Bookmark"}
      </Button>
    </form>
  )
}
