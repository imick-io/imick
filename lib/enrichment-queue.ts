import type { EnrichmentStatus } from "./ai-bookmark"

// Pure selection seam for the cron drainer (ADR 0005): which Bookmarks drain
// this tick, in what order. DB-free so the policy is unit-tested without a
// database, mirroring lib/bookmark-batch.ts.

export type DrainableRow = {
  aiStatus: EnrichmentStatus
  aiAttempts: number
  updatedAt: Date
}

// Small bounded batch per tick: self-throttles microlink (up to 8s each) and
// Claude calls, and keeps a full tick well under the function timeout.
export const DRAIN_BATCH_SIZE = 3

// A running row older than this is treated as interrupted and re-selected.
// Comfortably above any single tick's worst-case duration.
export const STALE_RUNNING_MS = 10 * 60_000

export type DrainOptions = {
  limit: number
  maxAttempts: number
  now: Date
  staleRunningMs: number
}

export function selectDrainable<T extends DrainableRow>(
  rows: T[],
  opts: DrainOptions
): T[] {
  const drainable = (r: DrainableRow): boolean => {
    if (r.aiStatus === "pending") return true
    // A failed row retries until the cap; at the cap it is terminal until a
    // human Retry resets the counter (ADR 0005).
    if (r.aiStatus === "failed") return r.aiAttempts < opts.maxAttempts
    // A running row is normally another tick's in-flight work, but one stuck
    // past the stale threshold was interrupted (deploy, crash) and is
    // reclaimed so it cannot stay stranded forever.
    if (r.aiStatus === "running") {
      return opts.now.getTime() - r.updatedAt.getTime() > opts.staleRunningMs
    }
    return false
  }

  return rows
    .filter(drainable)
    .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
    .slice(0, opts.limit)
}
