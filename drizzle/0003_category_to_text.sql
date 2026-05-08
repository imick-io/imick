ALTER TABLE "bookmarks" ALTER COLUMN "category" DROP NOT NULL;
ALTER TABLE "bookmarks" ALTER COLUMN "category" TYPE text USING "category"::text;
DROP TYPE IF EXISTS "category";
