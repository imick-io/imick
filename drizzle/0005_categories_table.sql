CREATE TABLE "categories" (
  "slug" text PRIMARY KEY,
  "label" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

INSERT INTO "categories" ("slug", "label") VALUES
  ('dev-tools', 'Dev Tools'),
  ('libraries-frameworks', 'Libraries & Frameworks'),
  ('design', 'Design'),
  ('learning', 'Learning'),
  ('ai-productivity', 'AI & Productivity'),
  ('infrastructure', 'Infrastructure'),
  ('inspiration', 'Inspiration'),
  ('community', 'Community')
ON CONFLICT DO NOTHING;

INSERT INTO "categories" ("slug", "label")
SELECT DISTINCT
  b.category,
  initcap(replace(b.category, '-', ' '))
FROM "bookmarks" b
WHERE b.category IS NOT NULL
  AND b.category NOT IN (SELECT slug FROM "categories")
ON CONFLICT DO NOTHING;

ALTER TABLE "bookmarks"
  ADD CONSTRAINT "bookmarks_category_categories_slug_fk"
  FOREIGN KEY ("category") REFERENCES "categories"("slug") ON DELETE SET NULL;
