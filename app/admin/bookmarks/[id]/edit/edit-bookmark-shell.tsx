"use client"

import type { Bookmark } from "@/lib/bookmarks-meta"
import type { Category } from "@/lib/categories"
import { EditBookmarkForm } from "./edit-bookmark-form"
import { GenerateAiButton } from "./generate-ai-button"
import { RefetchButton } from "./refetch-button"
import { DeleteButton } from "./delete-button"

interface Props {
  bookmark: Bookmark
  allCategories: Category[]
}

export function EditBookmarkShell({ bookmark, allCategories }: Props) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <GenerateAiButton bookmarkId={bookmark.id} />
          <RefetchButton bookmarkId={bookmark.id} />
          <DeleteButton bookmarkId={bookmark.id} title={bookmark.title} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{bookmark.title}</h1>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors break-all"
          >
            {bookmark.url}
          </a>
        </div>
      </div>

      <EditBookmarkForm
        key={bookmark.updatedAt.getTime()}
        bookmark={bookmark}
        allCategories={allCategories}
      />
    </>
  )
}
