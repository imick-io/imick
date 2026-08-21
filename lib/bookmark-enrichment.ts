import { eq } from "drizzle-orm"
import { db } from "./db"
import { bookmarks, type Bookmark } from "./db/schema"
import { fetchMicrolink } from "./microlink"
import { extractPageText } from "./page-text"
import {
  generateBookmarkAi,
  mergeAiFields,
  nextEnrichmentState,
  MAX_ENRICHMENT_ATTEMPTS,
} from "./ai-bookmark"
import { getDistinctCategories } from "./bookmarks"
import { createCategory, categoryExists, humanizeSlug } from "./categories"

export type EnrichResult = { ok: true } | { ok: false; error: string }

interface EnrichOptions {
  // Overwrite AI-owned fields even when already set (single-flow "force").
  force: boolean
  // Also fetch microlink metadata (title, description, logo, image, color).
  // The drainer needs it because batch-created Drafts are bare; the single
  // flow leaves metadata to its dedicated Refetch action.
  fetchMetadata: boolean
}

// The one Enrichment path (ADR 0005): both the single "Generate with AI" flow
// and the background cron drainer run a Bookmark through here, so every row
// carries the outcome of its last attempt via nextEnrichmentState regardless
// of trigger. Never writes Rating, Review, or publishedAt.
//
// Three phases: claim (persist `running` so concurrent drainer ticks skip the
// row), attempt, account. The try spans the whole attempt including the final
// write, so any failure lands the row in `failed` with its attempt counted; an
// interruption inside the claim window is reclaimed via the stale-running rule.
export async function enrichBookmark(
  existing: Bookmark,
  { force, fetchMetadata }: EnrichOptions
): Promise<EnrichResult> {
  const running = nextEnrichmentState(
    { status: existing.aiStatus, attempts: existing.aiAttempts },
    "start",
    MAX_ENRICHMENT_ATTEMPTS
  )
  await db
    .update(bookmarks)
    .set({ aiStatus: running.status, aiAttempts: running.attempts, updatedAt: new Date() })
    .where(eq(bookmarks.id, existing.id))

  try {
    const metadata = fetchMetadata ? await fetchMicrolink(existing.url) : null
    const microlinkDescription = metadata?.description ?? existing.description ?? ""

    const pageText = (await extractPageText(existing.url)) ?? ""

    const allTagRows = await db.select({ tags: bookmarks.tags }).from(bookmarks)
    const existingTags = [...new Set(allTagRows.flatMap((r) => r.tags))]
    const existingCategories = await getDistinctCategories()

    console.log("[enrichBookmark] calling AI", {
      bookmarkId: existing.id,
      url: existing.url,
      pageTextLength: pageText.length,
      pageTextExtracted: pageText.length > 0,
      microlinkDescriptionLength: microlinkDescription.length,
      existingTagsCount: existingTags.length,
      existingCategoriesCount: existingCategories.length,
      force,
      fetchMetadata,
    })

    const { suggestedCategory: aiSuggested, ...mergeable } = await generateBookmarkAi({
      url: existing.url,
      pageText,
      microlinkDescription,
      existingTags,
      existingCategories,
    })

    const merged = mergeAiFields(
      {
        category: existing.category,
        tags: existing.tags,
        pros: existing.pros,
        cons: existing.cons,
        aiSummary: existing.aiSummary,
      },
      mergeable,
      force
    )

    // Resolve the Category to assign. When AI is filling the slot (no human
    // category yet, or a forced regenerate) prefer its out-of-list suggestion
    // over the constrained best-fit; a human-set category is left untouched.
    const aiOwnsCategory = force || existing.category === null
    let categoryToSave: string | null = merged.category
    if (aiOwnsCategory && aiSuggested && aiSuggested !== merged.category) {
      categoryToSave = aiSuggested
    }

    // Auto-create an AI-suggested Category that does not exist yet, then assign
    // it (ADR 0005) instead of surfacing it for manual acceptance.
    if (categoryToSave && !(await categoryExists(categoryToSave))) {
      await createCategory({
        slug: categoryToSave,
        label: humanizeSlug(categoryToSave),
      })
    }

    const done = nextEnrichmentState(running, "success", MAX_ENRICHMENT_ATTEMPTS)

    console.log("[enrichBookmark] populating fields", {
      bookmarkId: existing.id,
      force,
      category: categoryToSave,
      tags: merged.tags,
      prosCount: merged.pros.length,
      consCount: merged.cons.length,
      aiSummaryLength: merged.aiSummary.length,
    })

    await db
      .update(bookmarks)
      .set({
        ...merged,
        category: categoryToSave,
        ...(metadata
          ? {
              title: metadata.title,
              description: metadata.description,
              logoUrl: metadata.logoUrl,
              imageUrl: metadata.imageUrl,
              colorHex: metadata.colorHex,
            }
          : {}),
        aiStatus: done.status,
        aiAttempts: done.attempts,
        updatedAt: new Date(),
      })
      .where(eq(bookmarks.id, existing.id))

    return { ok: true }
  } catch (err) {
    console.error("[enrichBookmark] failed", { bookmarkId: existing.id, url: existing.url }, err)
    const failed = nextEnrichmentState(running, "failure", MAX_ENRICHMENT_ATTEMPTS)
    await db
      .update(bookmarks)
      .set({ aiStatus: failed.status, aiAttempts: failed.attempts, updatedAt: new Date() })
      .where(eq(bookmarks.id, existing.id))
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
