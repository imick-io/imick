"use client"

import { useActionState } from "react"
import { updateBookmark, type UpdateBookmarkState } from "../../actions"
import { type Bookmark, CATEGORY_LABELS } from "@/lib/bookmarks-meta"
import { categoryEnum } from "@/lib/db/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Props = { bookmark: Bookmark }

export function EditBookmarkForm({ bookmark }: Props) {
  const [state, action, pending] = useActionState<UpdateBookmarkState | null, FormData>(
    updateBookmark,
    null
  )

  const errors = state?.ok === false ? state.errors : {}

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={bookmark.id} />

      {state?.ok === true && (
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">Changes saved.</p>
      )}

      {/* ── Core fields ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Core
        </legend>

        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            name="url"
            type="url"
            defaultValue={bookmark.url}
            required
            disabled={pending}
            aria-invalid={!!errors.url}
          />
          {errors.url && <p className="text-sm text-destructive">{errors.url[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={bookmark.title}
            required
            disabled={pending}
            aria-invalid={!!errors.title}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={bookmark.description ?? ""}
            rows={3}
            disabled={pending}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              defaultValue={bookmark.category}
              required
              disabled={pending}
              className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              aria-invalid={!!errors.category}
            >
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
              defaultValue={bookmark.tags.join(", ")}
              placeholder="react, typescript"
              disabled={pending}
            />
            <p className="text-xs text-muted-foreground">Comma-separated.</p>
          </div>
        </div>
      </fieldset>

      {/* ── Metadata fields ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Metadata
        </legend>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="url"
              defaultValue={bookmark.logoUrl ?? ""}
              disabled={pending}
              aria-invalid={!!errors.logoUrl}
            />
            {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="colorHex">Accent Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="colorHex"
                name="colorHex"
                defaultValue={bookmark.colorHex ?? ""}
                placeholder="#ff5500"
                disabled={pending}
                aria-invalid={!!errors.colorHex}
                className="flex-1"
              />
              {bookmark.colorHex && (
                <span
                  className="size-6 rounded border shrink-0"
                  style={{ backgroundColor: bookmark.colorHex }}
                />
              )}
            </div>
            {errors.colorHex && <p className="text-sm text-destructive">{errors.colorHex[0]}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={bookmark.imageUrl ?? ""}
            disabled={pending}
            aria-invalid={!!errors.imageUrl}
          />
          {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl[0]}</p>}
        </div>
      </fieldset>

      {/* ── Review fields ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Review
        </legend>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <select
            id="rating"
            name="rating"
            defaultValue={bookmark.rating?.toString() ?? ""}
            disabled={pending}
            className="h-9 w-40 rounded-4xl border border-input bg-input/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="">No rating</option>
            <option value="1">★ 1</option>
            <option value="2">★★ 2</option>
            <option value="3">★★★ 3</option>
            <option value="4">★★★★ 4</option>
            <option value="5">★★★★★ 5</option>
          </select>
          {errors.rating && <p className="text-sm text-destructive">{errors.rating[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pros">Pros</Label>
          <Textarea
            id="pros"
            name="pros"
            defaultValue={bookmark.pros.join("\n")}
            rows={4}
            placeholder={"- Fast build times\n- Great DX\n- Well documented"}
            disabled={pending}
          />
          <p className="text-xs text-muted-foreground">One per line.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cons">Cons</Label>
          <Textarea
            id="cons"
            name="cons"
            defaultValue={bookmark.cons.join("\n")}
            rows={4}
            placeholder={"- Complex configuration\n- Large bundle size"}
            disabled={pending}
          />
          <p className="text-xs text-muted-foreground">One per line.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reviewText">Review</Label>
          <Textarea
            id="reviewText"
            name="reviewText"
            defaultValue={bookmark.reviewText ?? ""}
            rows={6}
            placeholder="Long-form review notes…"
            disabled={pending}
          />
        </div>
      </fieldset>

      {/* ── AI Summary ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          AI Summary
        </legend>

        <div className="space-y-2">
          <Label htmlFor="aiSummary">AI Summary</Label>
          <Textarea
            id="aiSummary"
            name="aiSummary"
            defaultValue={bookmark.aiSummary ?? ""}
            rows={4}
            placeholder="Neutral, AI-generated description of the tool..."
            disabled={pending}
          />
          <p className="text-xs text-muted-foreground">
            Rendered as "About this tool" on the public page. Leave empty to hide.
          </p>
        </div>
      </fieldset>

      {/* ── Publish toggle ── */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Visibility
        </legend>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={bookmark.published}
            disabled={pending}
            className="size-4 rounded accent-primary"
          />
          <span className="text-sm font-medium">Published</span>
          <span className="text-xs text-muted-foreground">
            {bookmark.published ? "Visible on public site" : "Draft — not publicly visible"}
          </span>
        </label>
      </fieldset>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        <a
          href="/admin/bookmarks"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to list
        </a>
      </div>
    </form>
  )
}
