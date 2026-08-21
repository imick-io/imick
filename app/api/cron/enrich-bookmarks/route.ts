import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { inArray } from "drizzle-orm"
import { db } from "@/lib/db"
import { bookmarks } from "@/lib/db/schema"
import { MAX_ENRICHMENT_ATTEMPTS } from "@/lib/ai-bookmark"
import { enrichBookmark } from "@/lib/bookmark-enrichment"
import {
  selectDrainable,
  DRAIN_BATCH_SIZE,
  STALE_RUNNING_MS,
} from "@/lib/enrichment-queue"

export const dynamic = "force-dynamic"

// Cron drainer (ADR 0005): every tick, drain a small batch of Bookmarks whose
// Enrichment is pending or retryably failed through the shared enrich path.
// Registered in vercel.json on a 1-minute schedule; Vercel sends
// `Authorization: Bearer ${CRON_SECRET}` on cron invocations.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const candidates = await db
    .select()
    .from(bookmarks)
    .where(inArray(bookmarks.aiStatus, ["pending", "running", "failed"]))

  const batch = selectDrainable(candidates, {
    limit: DRAIN_BATCH_SIZE,
    maxAttempts: MAX_ENRICHMENT_ATTEMPTS,
    now: new Date(),
    staleRunningMs: STALE_RUNNING_MS,
  })

  // Sequential on purpose: self-throttles the microlink and Claude calls per
  // tick. A row that fails stays failed/attempt-counted and drains again on a
  // later tick until the cap.
  let done = 0
  let failed = 0
  for (const row of batch) {
    const result = await enrichBookmark(row, { force: false, fetchMetadata: true })
    if (result.ok) done += 1
    else failed += 1
  }

  if (batch.length > 0) {
    revalidatePath("/admin/bookmarks")
  }

  return NextResponse.json({ drained: batch.length, done, failed })
}
