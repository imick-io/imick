ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "is_anonymous" BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS "company" TEXT,
  ADD COLUMN IF NOT EXISTS "linkedin_url" TEXT;

CREATE TABLE IF NOT EXISTS "form_submissions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "source" TEXT NOT NULL,
  "intention" TEXT,
  "subject" TEXT,
  "message" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "form_submissions_user_id_idx" ON "form_submissions" ("user_id");
CREATE INDEX IF NOT EXISTS "form_submissions_source_idx" ON "form_submissions" ("source");
