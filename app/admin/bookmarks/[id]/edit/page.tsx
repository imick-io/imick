import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getBookmarkById } from "@/lib/bookmarks"
import { getAllCategories } from "@/lib/categories"
import { EditBookmarkShell } from "./edit-bookmark-shell"

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
      <EditBookmarkShell bookmark={bookmark} allCategories={allCategories} />
    </div>
  )
}
