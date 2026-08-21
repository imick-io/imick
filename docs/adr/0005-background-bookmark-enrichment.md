# Background bookmark enrichment via cron drainer

Admins add **Bookmarks** by URL. **Enrichment** (fetch link metadata + AI generation of Category, Tags, Pros/Cons, AI Summary) is slow and costs a model call per URL. The original flow enriched one Bookmark at a time, synchronously, and force-landed the admin on that bookmark's edit page. This ADR records the move to bulk paste-add with background Enrichment, and the choice of how that background work is driven.

## Decision

A bulk-add textarea accepts many URLs (one per line). Adding is split into two phases:

1. **Phase 1 (synchronous, instant).** Parse and normalize the pasted URLs, dedupe within the paste, skip any that already match an existing Bookmark (normalized: lowercase host, strip trailing slash, http/https and www/non-www treated as equal). Insert the survivors as bare **Draft** rows (`url` + `aiStatus = 'pending'`, `publishedAt = NULL`) in one write. Return the admin to the list with a *created N / skipped M* report.
2. **Phase 2 (background).** A **cron drainer** route runs every minute, selects a small batch of Bookmarks with `aiStatus` in (`pending`, `failed`), marks them `running`, and enriches them (microlink metadata + AI). On success `aiStatus = 'done'`; on error `aiStatus = 'failed'` and `aiAttempts` increments. After 3 failed attempts the row is left terminally `failed` and the drainer skips it until a human hits Retry (which resets `aiAttempts`).

Enrichment status (`pending` / `running` / `done` / `failed`) is a new per-Bookmark field, **orthogonal to the Draft / Scheduled / Published lifecycle** gated on `publishedAt`. Enrichment never sets `publishedAt`; a human still finishes each Draft (Rating, Review, final Category) and publishes.

When the AI picks a Category that does not exist, Enrichment **auto-creates** it — in both the background batch flow and the single "Generate with AI" flow, which is updated to match (previously it only suggested).

## Rationale

**Why background, not synchronous.** Enrichment is a microlink call (up to 8s) plus a Claude call per URL. A synchronous loop over a realistic paste (tens of URLs) blows the function timeout and makes the admin wait on a spinner while one slow URL blocks the rest. Backgrounding lets Drafts appear instantly and decouples paste from processing.

**Why a cron drainer, not `waitUntil` or a queue.**
- `waitUntil` fire-and-forget starts immediately but is **not durable**: a deploy, crash, or exceeding the function's max duration loses in-flight Enrichment, and failures have no automatic retry. For a batch of tens of AI calls that is a real loss.
- A managed queue (Vercel Queues) is durable but adds infrastructure and a delivery/consumer model heavier than this personal-site workload warrants.
- A **cron drainer polling a status column** is durable (survives deploys and crashes — unfinished rows are just `pending`/`failed` and get picked up next tick), **retries for free** (failed rows are re-selected until the attempt cap), and **self-throttles** against microlink/Claude rate limits by draining a few per tick. The only cost is up to ~60s latency before a Draft starts enriching, which is fine for an admin workflow.

**Why an attempt cap.** Without it, a permanently broken URL (404, JS-only page with no extractable text) would be retried every tick forever, burning a Claude call each time. Capping at 3 bounds wasted calls while still tolerating transient failures; manual Retry covers the rare case where a human wants to try again.

**Why auto-create categories.** With no human in the loop at background-enrich time, the alternative (leave Category null on an unknown suggestion) would leave every batch-added Draft uncategorized. The admin accepted an unattended-taxonomy trade-off: categories are curated *after* the fact (merge near-duplicates) rather than gated before creation. The single flow is aligned to the same behavior so the two entry points share one mental model.

## Consequences

- Schema migration (`0007`): add `bookmarks.aiStatus` (enum: `pending` | `running` | `done` | `failed`) and `bookmarks.aiAttempts` (int, default 0). Existing rows backfill to `done` (already enriched by hand or not needing it).
- New cron route drains `pending`/`failed` Bookmarks; registered in the Vercel cron config, running every minute.
- The bulk-add textarea replaces the single-URL create form (one line is a batch of one). `createBookmark` no longer redirects to the edit page; it returns a batch report and stays on the list.
- `generateWithAi` (single flow) changes: it now auto-creates a suggested Category instead of returning it as `suggestedCategory` for manual acceptance, and it writes `aiStatus`/`aiAttempts` like the drainer so every Bookmark carries the outcome of its last Enrichment attempt regardless of trigger.
- The admin list shows an Enrichment badge (`pending` / `enriching` / `enriched` / `failed n/3`) with a Retry action, distinct from the existing Draft / Scheduled / Published filter.
- URL normalization for dedup is shared between the batch skip-check and any future uniqueness constraint. This ADR does **not** add a DB unique constraint on `url`; dedup is enforced at insert time only (revisit if duplicates still slip in).
