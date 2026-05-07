"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { bookmarks, categoryEnum } from "@/lib/db/schema"
import { fetchMicrolink } from "@/lib/microlink"
import { parseProsConsText } from "@/lib/bookmark-helpers"
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

// ─── create ─────────────────────────────────────────────────────────────────

const createSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  category: z.enum(categoryEnum.enumValues),
  tags: z.string().optional(),
})

export type CreateBookmarkState =
  | { ok: true; bookmarkId: string }
  | { ok: false; errors: Record<string, string[]> }

export async function createBookmark(
  _prev: CreateBookmarkState | null,
  formData: FormData
): Promise<CreateBookmarkState> {
  await requireAdmin()

  const parsed = createSchema.safeParse({
    url: formData.get("url"),
    category: formData.get("category"),
    tags: formData.get("tags"),
  })
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors }
  }

  const { url, category, tags } = parsed.data
  const meta = await fetchMicrolink(url)
  const tagList = parseTags(tags)
  const slug = `${slugify(meta.title || new URL(url).hostname)}-${Date.now().toString(36)}`

  const [row] = await db
    .insert(bookmarks)
    .values({
      url,
      slug,
      title: meta.title,
      description: meta.description,
      logoUrl: meta.logoUrl,
      imageUrl: meta.imageUrl,
      colorHex: meta.colorHex,
      category,
      tags: tagList,
      published: false,
    })
    .returning({ id: bookmarks.id })

  redirect(`/admin/bookmarks/${row.id}/edit`)
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
  category: z.enum(categoryEnum.enumValues),
  tags: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  rating: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : null))
    .refine((v) => v === null || (v >= 1 && v <= 5), "Rating must be 1–5"),
  reviewText: z.string().optional(),
  aiSummary: z.string().optional(),
  published: z.boolean(),
})

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
    category: formData.get("category"),
    tags: formData.get("tags") || undefined,
    pros: formData.get("pros") || undefined,
    cons: formData.get("cons") || undefined,
    rating: formData.get("rating") || undefined,
    reviewText: formData.get("reviewText") || undefined,
    aiSummary: formData.get("aiSummary") || undefined,
    published: formData.get("published") === "on",
  })

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors }
  }

  const { id, tags, logoUrl, imageUrl, colorHex, description, pros, cons, reviewText, aiSummary, ...rest } =
    parsed.data

  await db
    .update(bookmarks)
    .set({
      ...rest,
      description: description ?? null,
      logoUrl: logoUrl || null,
      imageUrl: imageUrl || null,
      colorHex: colorHex || null,
      tags: parseTags(tags),
      pros: parseProsConsText(pros),
      cons: parseProsConsText(cons),
      reviewText: reviewText ?? null,
      aiSummary: aiSummary ?? null,
      updatedAt: new Date(),
    })
    .where(eq(bookmarks.id, id))

  return { ok: true }
}

// ─── delete ─────────────────────────────────────────────────────────────────

export async function deleteBookmark(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = formData.get("id") as string
  if (!id) redirect("/admin/bookmarks")
  await db.delete(bookmarks).where(eq(bookmarks.id, id))
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

  return { ok: true, message: "Metadata refreshed successfully." }
}
