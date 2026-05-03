"use client"

import { deleteBookmark } from "../../actions"
import { Button } from "@/components/ui/button"

type Props = { bookmarkId: string; title: string }

export function DeleteButton({ bookmarkId, title }: Props) {
  return (
    <form
      action={deleteBookmark}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={bookmarkId} />
      <Button type="submit" variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  )
}
