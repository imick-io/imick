-- Migrate pros from text to text[], splitting on newlines and stripping bullet markers
ALTER TABLE "bookmarks"
  ALTER COLUMN "pros" SET DEFAULT ARRAY[]::text[];
ALTER TABLE "bookmarks"
  ALTER COLUMN "pros" TYPE text[]
    USING COALESCE(
      (
        SELECT array_agg(trimmed ORDER BY ordinality)
        FROM unnest(string_to_array("pros", E'\n')) WITH ORDINALITY AS t(line, ordinality),
        LATERAL (SELECT trim(regexp_replace(line, '^[-+*•]\s*', '')) AS trimmed) sub
        WHERE sub.trimmed <> ''
      ),
      ARRAY[]::text[]
    );
ALTER TABLE "bookmarks"
  ALTER COLUMN "pros" SET NOT NULL;

-- Migrate cons from text to text[], same logic
ALTER TABLE "bookmarks"
  ALTER COLUMN "cons" SET DEFAULT ARRAY[]::text[];
ALTER TABLE "bookmarks"
  ALTER COLUMN "cons" TYPE text[]
    USING COALESCE(
      (
        SELECT array_agg(trimmed ORDER BY ordinality)
        FROM unnest(string_to_array("cons", E'\n')) WITH ORDINALITY AS t(line, ordinality),
        LATERAL (SELECT trim(regexp_replace(line, '^[-+*•]\s*', '')) AS trimmed) sub
        WHERE sub.trimmed <> ''
      ),
      ARRAY[]::text[]
    );
ALTER TABLE "bookmarks"
  ALTER COLUMN "cons" SET NOT NULL;
