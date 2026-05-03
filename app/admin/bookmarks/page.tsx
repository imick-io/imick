import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getAdminBookmarks, CATEGORY_LABELS } from "@/lib/bookmarks"
import { categoryEnum } from "@/lib/db/schema"

export const metadata: Metadata = { title: "Bookmarks" }

type Props = {
  searchParams: Promise<{ category?: string; status?: string }>
}

export default async function AdminBookmarksPage({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login")
  }

  const { category, status } = await searchParams
  const validStatus =
    status === "published" || status === "draft" ? status : "all"
  const validCategory = (categoryEnum.enumValues as readonly string[]).includes(category ?? "")
    ? category
    : undefined

  const rows = await getAdminBookmarks({ category: validCategory, status: validStatus })

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bookmarks ({rows.length})</h1>
        <Link
          href="/admin/bookmarks/new"
          className="text-sm font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          + New
        </Link>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-3">
        {/* category filter */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Category:</span>
          <Link
            href={buildUrl({ status: validStatus })}
            className={`px-2 py-0.5 rounded ${!validCategory ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            All
          </Link>
          {categoryEnum.enumValues.map((cat) => (
            <Link
              key={cat}
              href={buildUrl({ category: cat, status: validStatus })}
              className={`px-2 py-0.5 rounded ${validCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
        </div>

        {/* status filter */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Status:</span>
          {(["all", "published", "draft"] as const).map((s) => (
            <Link
              key={s}
              href={buildUrl({ category: validCategory, status: s === "all" ? undefined : s })}
              className={`px-2 py-0.5 rounded capitalize ${validStatus === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* list */}
      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No bookmarks match the current filters.{" "}
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
                  <Link
                    href={`/admin/bookmarks/${b.id}/edit`}
                    className="font-medium text-sm truncate hover:underline"
                  >
                    {b.title}
                  </Link>
                  {!b.published && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                      Draft
                    </span>
                  )}
                  {(b.rating != null || b.reviewText) && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                      Reviewed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[b.category]}
                  </span>
                  {b.tags.length > 0 && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {b.tags.slice(0, 3).join(", ")}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(b.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/admin/bookmarks/${b.id}/edit`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function buildUrl(params: { category?: string; status?: string }) {
  const q = new URLSearchParams()
  if (params.category) q.set("category", params.category)
  if (params.status && params.status !== "all") q.set("status", params.status)
  const qs = q.toString()
  return `/admin/bookmarks${qs ? `?${qs}` : ""}`
}
