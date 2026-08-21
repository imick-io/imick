import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {
  getAdminBookmarks,
  getDistinctCategories,
  isReviewed,
  type AdminStatus,
} from "@/lib/bookmarks"
import { getCategoryLabel, getCategoryMap } from "@/lib/categories"
import { decodeBatchReport } from "@/lib/bookmark-batch"
import { enrichmentBadgeLabel, type EnrichmentStatus } from "@/lib/ai-bookmark"
import { retryEnrichment } from "./actions"

export const metadata: Metadata = { title: "Bookmarks" }

type Props = {
  searchParams: Promise<{ category?: string; status?: string; report?: string }>
}

export default async function AdminBookmarksPage({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login")
  }

  const { category, status, report } = await searchParams
  const batchReport = decodeBatchReport(report)
  const validStatus: AdminStatus =
    status === "published" || status === "draft" || status === "scheduled" ? status : "all"
  const allCategories = await getDistinctCategories()
  const validCategory = category && allCategories.includes(category) ? category : undefined

  const [rows, categoryMap] = await Promise.all([
    getAdminBookmarks({ category: validCategory, status: validStatus }),
    getCategoryMap(),
  ])

  return (
    <div className="space-y-6">
      {/* batch report */}
      {batchReport && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm space-y-2">
          <p className="font-medium">
            Created {batchReport.created}, skipped {batchReport.skipped.length},
            invalid {batchReport.invalid.length}.
          </p>
          {batchReport.skipped.length > 0 && (
            <div className="text-muted-foreground">
              <p className="text-xs uppercase tracking-wide">Skipped (already added)</p>
              <ul className="mt-1 space-y-0.5">
                {batchReport.skipped.map((url) => (
                  <li key={url} className="truncate">
                    {url}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {batchReport.invalid.length > 0 && (
            <div className="text-muted-foreground">
              <p className="text-xs uppercase tracking-wide">Invalid (not a URL)</p>
              <ul className="mt-1 space-y-0.5">
                {batchReport.invalid.map((line) => (
                  <li key={line} className="truncate">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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
          {allCategories.map((cat) => (
            <Link
              key={cat}
              href={buildUrl({ category: cat, status: validStatus })}
              className={`px-2 py-0.5 rounded ${validCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {getCategoryLabel(cat, categoryMap)}
            </Link>
          ))}
        </div>

        {/* status filter */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Status:</span>
          {(["all", "draft", "scheduled", "published"] as const).map((s) => (
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
                  {b.publishedAt === null && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                      Draft
                    </span>
                  )}
                  {b.publishedAt !== null && b.publishedAt > new Date() && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      Scheduled
                    </span>
                  )}
                  {isReviewed(b) && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                      Reviewed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {getCategoryLabel(b.category, categoryMap)}
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
                <EnrichmentBadgePill status={b.aiStatus} attempts={b.aiAttempts} />
                {b.aiStatus === "failed" && (
                  <form action={retryEnrichment}>
                    <input type="hidden" name="id" value={b.id} />
                    <button
                      type="submit"
                      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                      Retry
                    </button>
                  </form>
                )}
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

// Enrichment status is orthogonal to the Draft/Scheduled/Published lifecycle
// (ADR 0005): its badge lives in the right-side cluster with its own colors so
// "still enriching" never reads as "still unpublished".
const enrichmentBadgeClasses: Record<EnrichmentStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  running: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  done: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  failed: "bg-destructive/10 text-destructive",
}

function EnrichmentBadgePill({
  status,
  attempts,
}: {
  status: EnrichmentStatus
  attempts: number
}) {
  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${enrichmentBadgeClasses[status]}`}
    >
      {enrichmentBadgeLabel({ status, attempts })}
    </span>
  )
}

function buildUrl(params: { category?: string; status?: string }) {
  const q = new URLSearchParams()
  if (params.category) q.set("category", params.category)
  if (params.status && params.status !== "all") q.set("status", params.status)
  const qs = q.toString()
  return `/admin/bookmarks${qs ? `?${qs}` : ""}`
}
