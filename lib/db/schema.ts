import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// Enrichment status: the per-Bookmark state of its last Enrichment attempt.
// Orthogonal to the Draft / Scheduled / Published lifecycle (see CONTEXT.md,
// ADR 0005). Backfilled to `done` for pre-existing rows by migration 0007.
export const aiStatusEnum = pgEnum("ai_status", [
  "pending",
  "running",
  "done",
  "failed",
])

// --- better-auth core tables ---

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  company: text("company"),
  linkedinUrl: text("linkedin_url"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const formSubmissions = pgTable("form_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  source: text("source").notNull(),
  intention: text("intention"),
  subject: text("subject"),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type FormSubmission = typeof formSubmissions.$inferSelect
export type NewFormSubmission = typeof formSubmissions.$inferInsert

// --- Bookmarks ---

export const categories = pgTable("categories", {
  slug: text("slug").primaryKey(),
  label: text("label").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type Category = typeof categories.$inferSelect

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  imageUrl: text("image_url"),
  colorHex: text("color_hex"),
  category: text("category").references(() => categories.slug, {
    onDelete: "set null",
  }),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  pros: text("pros").array().notNull().default(sql`ARRAY[]::text[]`),
  cons: text("cons").array().notNull().default(sql`ARRAY[]::text[]`),
  aiSummary: text("ai_summary"),
  aiStatus: aiStatusEnum("ai_status").notNull().default("done"),
  aiAttempts: integer("ai_attempts").notNull().default(0),
  rating: integer("rating"),
  reviewText: text("review_text"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert
export type BookmarkCategory = string
