"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { db } from "@/lib/db"
import { bookmarks, categoryEnum } from "@/lib/db/schema"
import { fetchMicrolink } from "@/lib/microlink"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

const createSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  category: z.enum(categoryEnum.enumValues),
  tags: z.string().optional(),
})

export type CreateBookmarkState =
  | { ok: true; bookmarkId: string }
  | { ok: false; errors: Record<string, string[]> }

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login")
  }
}

export async function createBookmark(
  _prev: CreateBookmarkState | null,
  formData: FormData
): Promise<CreateBookmarkState> {
  await requireAdmin()

  const raw = {
    url: formData.get("url") as string,
    category: formData.get("category") as string,
    tags: formData.get("tags") as string | undefined,
  }

  const parsed = createSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors }
  }

  const { url, category, tags } = parsed.data
  const meta = await fetchMicrolink(url)

  const tagList = tags
    ? tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : []

  const baseSlug = slugify(meta.title || new URL(url).hostname)
  const slug = `${baseSlug}-${Date.now().toString(36)}`

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

  redirect(`/admin/bookmarks?created=${row.id}`)
}
