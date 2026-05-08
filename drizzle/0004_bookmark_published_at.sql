ALTER TABLE "bookmarks" ADD COLUMN "published_at" timestamp;
UPDATE "bookmarks" SET "published_at" = "created_at" WHERE "published" = true;
ALTER TABLE "bookmarks" DROP COLUMN "published";
