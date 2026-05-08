"use client"

import { useActionState, useState } from "react"
import {
  updateBookmark,
  createCategory,
  type UpdateBookmarkState,
  type CreateCategoryState,
} from "../../actions"
import { type Bookmark, slugifyCategory } from "@/lib/bookmarks-meta"
import type { Category } from "@/lib/categories"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function VisibilityField({
  publishedAt,
  disabled,
  canPublish,
  blockedReason,
}: {
  publishedAt: Date | null
  disabled: boolean
  canPublish: boolean
  blockedReason: string
}) {
  const initial = publishedAt ? toDatetimeLocal(new Date(publishedAt)) : ""
  const [value, setValue] = useState<string>(initial)

  const inputDisabled = disabled || !canPublish

  let hint: string
  if (!canPublish) {
    hint = blockedReason
  } else if (!value) {
    hint = "Draft, not publicly visible"
  } else {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      hint = "Invalid date"
    } else if (parsed > new Date()) {
      hint = `Scheduled for ${parsed.toLocaleString()}, hidden in production until then`
    } else {
      hint = `Published since ${parsed.toLocaleString()}`
    }
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Visibility
      </legend>
      <Label htmlFor="publishedAt">Published at</Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id="publishedAt"
          name="publishedAt"
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={inputDisabled}
          className="w-auto"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setValue(toDatetimeLocal(new Date()))}
          disabled={inputDisabled}
        >
          Set to now
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setValue("")}
          disabled={inputDisabled || !value}
        >
          Clear
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </fieldset>
  )
}

function CategoryField({
  value,
  onChange,
  categories,
  onCategoryCreated,
  disabled,
  invalid,
}: {
  value: string
  onChange: (next: string) => void
  categories: Category[]
  onCategoryCreated: (category: Category) => void
  disabled: boolean
  invalid: boolean
}) {
  const [createState, createAction, creating] = useActionState<
    CreateCategoryState | null,
    FormData
  >((prev, formData) => {
    return createCategory(prev, formData).then((result) => {
      if (result.ok) {
        const newCategory: Category = {
          slug: result.slug,
          label: result.label,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        onCategoryCreated(newCategory)
        onChange(result.slug)
        setCreating(false)
      }
      return result
    })
  }, null)

  const [isCreating, setCreating] = useState<boolean>(false)
  const [draftSlug, setDraftSlug] = useState<string>("")
  const [draftLabel, setDraftLabel] = useState<string>("")

  if (isCreating) {
    const errors = createState?.ok === false ? createState.errors : {}
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={draftLabel}
            onChange={(e) => {
              const next = e.target.value
              setDraftLabel(next)
              setDraftSlug(slugifyCategory(next))
            }}
            placeholder="Label (e.g. Dev Tools)"
            disabled={creating}
            aria-invalid={!!errors.label}
            className="w-auto flex-1"
          />
          <Input
            value={draftSlug}
            onChange={(e) => setDraftSlug(slugifyCategory(e.target.value))}
            placeholder="slug"
            disabled={creating}
            aria-invalid={!!errors.slug}
            className="w-40"
          />
          <form action={createAction}>
            <input type="hidden" name="slug" value={draftSlug} />
            <input type="hidden" name="label" value={draftLabel} />
            <Button type="submit" size="sm" disabled={creating || !draftLabel || !draftSlug}>
              {creating ? "Creating…" : "Create"}
            </Button>
          </form>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setCreating(false)
              setDraftSlug("")
              setDraftLabel("")
            }}
            disabled={creating}
          >
            Cancel
          </Button>
        </div>
        {errors.label && <p className="text-sm text-destructive">{errors.label[0]}</p>}
        {errors.slug && <p className="text-sm text-destructive">{errors.slug[0]}</p>}
      </div>
    )
  }

  const sorted = [...categories].sort((a, b) => a.label.localeCompare(b.label))

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value || undefined}
        onValueChange={(next) => onChange(next ?? "")}
        disabled={disabled}
      >
        <SelectTrigger
          id="category"
          className="w-full"
          aria-invalid={invalid}
        >
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {sorted.map((cat) => (
            <SelectItem key={cat.slug} value={cat.slug}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setCreating(true)}
        disabled={disabled}
      >
        + New
      </Button>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          disabled={disabled}
          aria-label="Clear category"
        >
          Clear
        </Button>
      )}
    </div>
  )
}

function ListEditor({
  name,
  label,
  defaultValues,
  placeholder,
  disabled,
}: {
  name: string
  label: string
  defaultValues: string[]
  placeholder?: string
  disabled?: boolean
}) {
  const [items, setItems] = useState<string[]>(defaultValues)

  const update = (idx: number, value: string) =>
    setItems(items.map((v, i) => (i === idx ? value : v)))
  const remove = (idx: number) => setItems(items.filter((_, i) => i !== idx))
  const add = () => setItems([...items, ""])

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((value, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              name={name}
              value={value}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(idx)}
              disabled={disabled}
              aria-label={`Remove ${label.toLowerCase()} ${idx + 1}`}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        disabled={disabled}
      >
        Add {label.toLowerCase()}
      </Button>
    </div>
  )
}

type Props = { bookmark: Bookmark; allCategories: Category[] }

export function EditBookmarkForm({ bookmark, allCategories }: Props) {
  const [state, action, pending] = useActionState<UpdateBookmarkState | null, FormData>(
    updateBookmark,
    null
  )
  const [category, setCategory] = useState<string>(bookmark.category ?? "")
  const [categories, setCategories] = useState<Category[]>(allCategories)

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
            <input type="hidden" name="category" value={category} />
            <CategoryField
              value={category}
              onChange={setCategory}
              categories={categories}
              onCategoryCreated={(c) => setCategories((cs) => [...cs, c])}
              disabled={pending}
              invalid={!!errors.category}
            />
            <p className="text-xs text-muted-foreground">
              Required to publish this bookmark on the public site.
            </p>
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

        <ListEditor
          name="pros"
          label="Pros"
          defaultValues={bookmark.pros}
          placeholder="Fast build times"
          disabled={pending}
        />

        <ListEditor
          name="cons"
          label="Cons"
          defaultValues={bookmark.cons}
          placeholder="Complex configuration"
          disabled={pending}
        />

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

      {/* ── Visibility ── */}
      <VisibilityField
        publishedAt={bookmark.publishedAt}
        disabled={pending}
        canPublish={!!category}
        blockedReason="Set a category before publishing this bookmark."
      />
      {errors.publishedAt && (
        <p className="text-sm text-destructive">{errors.publishedAt[0]}</p>
      )}

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
