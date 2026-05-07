-- Migrate pros/cons from text to text[], splitting on newlines and stripping
-- bullet markers. Postgres does not allow subqueries directly in USING, so we
-- wrap the conversion logic in a temporary IMMUTABLE function and drop it
-- after the type change.

CREATE OR REPLACE FUNCTION __split_lines_to_array(input TEXT) RETURNS TEXT[] AS $$
  SELECT COALESCE(
    array_agg(trimmed ORDER BY ordinality) FILTER (WHERE trimmed <> ''),
    ARRAY[]::text[]
  )
  FROM unnest(string_to_array(input, E'\n')) WITH ORDINALITY AS t(line, ordinality),
  LATERAL (SELECT trim(regexp_replace(line, '^[-+*•]\s*', '')) AS trimmed) sub;
$$ LANGUAGE SQL IMMUTABLE;
--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "pros" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "pros" TYPE text[] USING __split_lines_to_array("pros");
--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "pros" SET DEFAULT ARRAY[]::text[];
--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "pros" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "cons" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "cons" TYPE text[] USING __split_lines_to_array("cons");
--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "cons" SET DEFAULT ARRAY[]::text[];
--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "cons" SET NOT NULL;
--> statement-breakpoint
DROP FUNCTION __split_lines_to_array(TEXT);
