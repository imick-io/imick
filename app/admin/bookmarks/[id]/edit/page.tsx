import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getBookmarkById } from "@/lib/bookmarks"
import { getAllCategories } from "@/lib/categories"
import { EditBookmarkForm } from "./edit-bookmark-form"
import { RefetchButton } from "./refetch-button"
import { GenerateAiButton } from "./generate-ai-button"
import { DeleteButton } from "./delete-button"

export const metadata: Metadata = { title: "Edit Bookmark" }

type Props = { params: Promise<{ id: string }> }

export default async function EditBookmarkPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login")
  }

  const { id } = await params
  const [bookmark, allCategories] = await Promise.all([
    getBookmarkById(id),
    getAllCategories(),
  ])
  if (!bookmark) notFound()

  return (
    <div className="max-w-2xl space-y-8">
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
    </div>
  )
}
