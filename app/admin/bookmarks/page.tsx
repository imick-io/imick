import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { bookmarks } from "@/lib/db/schema"
import { CATEGORY_LABELS } from "@/lib/bookmarks"
import { desc } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Bookmarks" }

export default async function AdminBookmarksPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login")
  }

  const rows = await db.select().from(bookmarks).orderBy(desc(bookmarks.createdAt))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bookmarks ({rows.length})</h1>
        <Link
          href="/admin/bookmarks/new"
          className="text-sm font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          + New
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No bookmarks yet.{" "}
          <Link href="/admin/bookmarks/new" className="underline">
            Add one
          </Link>
          .
        </p>
      ) : (
        <div className="border rounded-lg divide-y">
          {rows.map((b) => (
            <div key={b.id} className="px-4 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{b.title}</span>
                  {!b.published && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[b.category]}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground truncate max-w-xs"
                  >
                    {b.url}
                  </a>
                </div>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground">
                {new Date(b.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
