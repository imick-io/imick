import type { Metadata } from "next"
import { CreateBookmarkForm } from "./create-bookmark-form"

export const metadata: Metadata = { title: "New Bookmark" }

export default function NewBookmarkPage() {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">New Bookmark</h1>
      <CreateBookmarkForm />
    </div>
  )
}
