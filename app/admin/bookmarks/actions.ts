"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { bookmarks } from "@/lib/db/schema"
import { fetchMicrolink } from "@/lib/microlink"
import { enrichBookmark } from "@/lib/bookmark-enrichment"
import { slugifyCategory } from "@/lib/bookmarks-meta"
import {
  parseBookmarkUrls,
  normalizeBookmarkUrl,
  partitionNewUrls,
  encodeBatchReport,
} from "@/lib/bookmark-batch"
import { createCategory as dbCreateCategory } from "@/lib/categories"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// ─── helpers ────────────────────────────────────────────────────────────────

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login")
  }
}

function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return []
  return raw.split(",").map((t) => t.trim()).filter(Boolean)
}

function revalidateBookmarksPublic() {
  revalidatePath("/bookmarks", "layout")
}

// ─── create category ───────────────────────────────────────────────────────

const createCategorySchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a kebab-case slug"),
  label: z.string().min(1, "Label is required"),
})

export type CreateCategoryState =
  | { ok: true; slug: string; label: string }
  | { ok: false; errors: Record<string, string[]> }

export async function createCategory(
  _prev: CreateCategoryState | null,
  formData: FormData
): Promise<CreateCategoryState> {
  await requireAdmin()

  const parsed = createCategorySchema.safeParse({
    slug: slugifyCategory(String(formData.get("slug") ?? "")),
    label: String(formData.get("label") ?? "").trim(),
  })
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors }
  }

  const { slug, label } = parsed.data
  await dbCreateCategory({ slug, label })

  return { ok: true, slug, label }
}

// ─── batch create (Paste-to-Drafts) ─────────────────────────────────────────

export type BatchCreateState = { ok: false; error: string }

/** Bare hostname (www. stripped), used for the placeholder title and slug. */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export async function batchCreateBookmarks(
  _prev: BatchCreateState | null,
  formData: FormData
): Promise<BatchCreateState> {
  await requireAdmin()

  const raw = String(formData.get("urls") ?? "")
  const tagList = parseTags(formData.get("tags") as string | null)

  const { valid, invalid } = parseBookmarkUrls(raw)

  if (valid.length === 0 && invalid.length === 0) {
    return { ok: false, error: "Paste at least one URL." }
  }

  const existingRows = await db.select({ url: bookmarks.url }).from(bookmarks)
  const existingKeys = new Set(
    existingRows
      .map((r) => normalizeBookmarkUrl(r.url))
      .filter((k): k is string => k !== null)
  )

  const { toCreate, skipped } = partitionNewUrls(valid, existingKeys)

  // Draft rows are inserted bare: no metadata fetch here. Enrichment (metadata +
  // AI) runs later in the background (PRD #47 Phase 2). A placeholder hostname
  // title keeps the NOT NULL column satisfied until enrichment overwrites it.
  if (toCreate.length > 0) {
    const stamp = Date.now().toString(36)
    await db.insert(bookmarks).values(
      toCreate.map((entry, i) => ({
        url: entry.url,
        slug: `${slugify(hostnameOf(entry.url)) || "bookmark"}-${stamp}-${i}`,
        title: hostnameOf(entry.url),
        tags: tagList,
        aiStatus: "pending" as const,
        publishedAt: null,
      }))
    )
    revalidatePath("/admin/bookmarks")
  }

  const report = encodeBatchReport({
    created: toCreate.length,
    skipped: skipped.map((s) => s.url),
    invalid,
  })

  redirect(`/admin/bookmarks?report=${report}`)
}

// ─── update ─────────────────────────────────────────────────────────────────

const updateSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url("Must be a valid URL"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  colorHex: z
    .string()
    .regex(/^#[0-9a-fA-F]{3,6}$/, "Must be a hex color like #ff5500")
    .optional()
    .or(z.literal("")),
  category: z.string().optional(),
  tags: z.string().optional(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  rating: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : null))
    .refine((v) => v === null || (v >= 1 && v <= 5), "Rating must be 1–5"),
  reviewText: z.string().optional(),
  aiSummary: z.string().optional(),
  publishedAt: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return null
      const d = new Date(v)
      return Number.isNaN(d.getTime()) ? null : d
    }),
}).refine(
  (data) => !(data.publishedAt && !data.category),
  { path: ["publishedAt"], message: "Set a category before publishing." }
)

export type UpdateBookmarkState =
  | { ok: true }
  | { ok: false; errors: Record<string, string[]> }

export async function updateBookmark(
  _prev: UpdateBookmarkState | null,
  formData: FormData
): Promise<UpdateBookmarkState> {
  await requireAdmin()

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    url: formData.get("url"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    logoUrl: formData.get("logoUrl") || "",
    imageUrl: formData.get("imageUrl") || "",
    colorHex: formData.get("colorHex") || "",
    category: formData.get("category") || undefined,
    tags: formData.get("tags") || undefined,
    pros: formData.getAll("pros").filter((v): v is string => typeof v === "string"),
    cons: formData.getAll("cons").filter((v): v is string => typeof v === "string"),
    rating: formData.get("rating") || undefined,
    reviewText: formData.get("reviewText") || undefined,
    aiSummary: formData.get("aiSummary") || undefined,
    publishedAt: formData.get("publishedAt") || undefined,
  })

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors }
  }

  const { id, tags, logoUrl, imageUrl, colorHex, description, pros, cons, reviewText, aiSummary, category, ...rest } =
    parsed.data

  const normalizedCategory = category ? slugifyCategory(category) : null

  await db
    .update(bookmarks)
    .set({
      ...rest,
      category: normalizedCategory || null,
      description: description ?? null,
      logoUrl: logoUrl || null,
      imageUrl: imageUrl || null,
      colorHex: colorHex || null,
      tags: parseTags(tags),
      pros: pros.map((s) => s.trim()).filter(Boolean),
      cons: cons.map((s) => s.trim()).filter(Boolean),
      reviewText: reviewText ?? null,
      aiSummary: aiSummary ?? null,
      updatedAt: new Date(),
    })
    .where(eq(bookmarks.id, id))

  revalidatePath(`/admin/bookmarks/${id}/edit`)
  revalidatePath("/admin/bookmarks")
  revalidateBookmarksPublic()

  return { ok: true }
}

// ─── delete ─────────────────────────────────────────────────────────────────

export async function deleteBookmark(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = formData.get("id") as string
  if (!id) redirect("/admin/bookmarks")
  await db.delete(bookmarks).where(eq(bookmarks.id, id))
  revalidateBookmarksPublic()
  redirect("/admin/bookmarks")
}

// ─── re-fetch metadata ───────────────────────────────────────────────────────

export type RefetchState =
  | { ok: true; message: string }
  | { ok: false; error: string }

export async function refetchMetadata(
  _prev: RefetchState | null,
  formData: FormData
): Promise<RefetchState> {
  await requireAdmin()

  const id = formData.get("id") as string
  if (!id) return { ok: false, error: "Missing bookmark ID." }

  const [existing] = await db
    .select({ url: bookmarks.url })
    .from(bookmarks)
    .where(eq(bookmarks.id, id))
    .limit(1)

  if (!existing) return { ok: false, error: "Bookmark not found." }

  const meta = await fetchMicrolink(existing.url)

  await db
    .update(bookmarks)
    .set({
      title: meta.title,
      description: meta.description,
      logoUrl: meta.logoUrl,
      imageUrl: meta.imageUrl,
      colorHex: meta.colorHex,
      updatedAt: new Date(),
    })
    .where(eq(bookmarks.id, id))

  revalidatePath(`/admin/bookmarks/${id}/edit`)
  revalidateBookmarksPublic()

  return { ok: true, message: "Metadata refreshed successfully." }
}

// ─── generate with AI ──────────────────────────────────────────────────────

export type GenerateAiState =
  | { ok: true; message: string }
  | { ok: false; error: string }

export async function generateWithAi(
  _prev: GenerateAiState | null,
  formData: FormData
): Promise<GenerateAiState> {
  await requireAdmin()

  const id = formData.get("id") as string
  if (!id) return { ok: false, error: "Missing bookmark ID." }

  const force = formData.get("force") === "on"

  const [existing] = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.id, id))
    .limit(1)

  if (!existing) return { ok: false, error: "Bookmark not found." }

  // Shared Enrichment path (ADR 0005): the cron drainer runs the same core.
  // Metadata stays out of the single flow; it has its own Refetch action.
  const result = await enrichBookmark(existing, { force, fetchMetadata: false })

  if (!result.ok) {
    return { ok: false, error: `AI generation failed: ${result.error}` }
  }

  revalidatePath(`/admin/bookmarks/${id}/edit`)
  revalidateBookmarksPublic()

  return {
    ok: true,
    message: "AI generation complete.",
  }
}
