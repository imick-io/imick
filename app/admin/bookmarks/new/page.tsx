import type { Metadata } from "next"
import { CreateBookmarkForm } from "./create-bookmark-form"

export const metadata: Metadata = { title: "New Bookmarks" }

export default function NewBookmarkPage() {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Add Bookmarks</h1>
      <p className="text-sm text-muted-foreground">
        Paste a pile of URLs and each new one becomes a Draft. A single URL still
        works.
      </p>
      <CreateBookmarkForm />
    </div>
  )
}
