-- Enrichment status prefactor (#48). Give every Bookmark an Enrichment status
-- and an attempt counter so background Enrichment (#47) can track progress
-- without a further migration. Orthogonal to the publish lifecycle.
--
-- Existing rows backfill to `done` (already enriched by hand or not needing it)
-- via the NOT NULL DEFAULT on ADD COLUMN, and to `ai_attempts = 0`. Re-running
-- pnpm db:migrate is a no-op (tracked in __migrations); the column IF NOT EXISTS
-- guards keep the ALTERs safe on a partial re-apply.

CREATE TYPE "ai_status" AS ENUM ('pending', 'running', 'done', 'failed');

ALTER TABLE "bookmarks" ADD COLUMN IF NOT EXISTS "ai_status" "ai_status" NOT NULL DEFAULT 'done';

ALTER TABLE "bookmarks" ADD COLUMN IF NOT EXISTS "ai_attempts" INTEGER NOT NULL DEFAULT 0;
