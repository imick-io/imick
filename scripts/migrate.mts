// Custom migration runner.
//
// Why not `drizzle-kit push`? It can't generate a `USING` clause for type
// changes that need data conversion (e.g. text -> text[] with newline split).
// Why not `drizzle-kit migrate`? It expects generated migrations with a
// `meta/_journal.json` and SHA-keyed tracking; our SQL files are hand-written.
//
// Tracks applied migrations in a `__migrations` table (name PK, applied_at).
// Applies any unapplied `drizzle/*.sql` files in lexical order.
//
// Usage:
//   pnpm db:migrate                              apply pending migrations
//   pnpm db:migrate --mark-applied 0000_initial  record a migration as
//                                                applied without running it
//                                                (use to baseline existing DBs)

import nextEnv from "@next/env"
import { neon } from "@neondatabase/serverless"

const { loadEnvConfig } = nextEnv
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

loadEnvConfig(process.cwd())

const MIGRATIONS_DIR = join(process.cwd(), "drizzle")

function splitStatements(content: string): string[] {
  if (content.includes("--> statement-breakpoint")) {
    return content.split("--> statement-breakpoint")
  }
  // Naive split on `;` at end of line. Our hand-written migrations don't
  // contain `;` inside string literals or DO blocks, so this is safe here.
  // If that ever changes, switch to a real parser or add breakpoint markers.
  return content.split(/;\s*\n/).map((s) => s.replace(/;\s*$/, ""))
}

function isExecutable(stmt: string): boolean {
  const stripped = stmt
    .split("\n")
    .map((line) => line.replace(/--.*$/, "").trim())
    .join("\n")
    .trim()
  return stripped.length > 0
}

async function main() {
  const args = process.argv.slice(2)
  const markIdx = args.indexOf("--mark-applied")
  const markTarget = markIdx !== -1 ? args[markIdx + 1] : null

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  const sql = neon(process.env.DATABASE_URL)

  await sql`CREATE TABLE IF NOT EXISTS __migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`

  if (markTarget) {
    const tag = markTarget.replace(/\.sql$/, "")
    await sql`INSERT INTO __migrations (name) VALUES (${tag}) ON CONFLICT DO NOTHING`
    console.log(`Marked ${tag} as applied`)
    return
  }

  const appliedRows = (await sql`SELECT name FROM __migrations`) as Array<{
    name: string
  }>
  const applied = new Set(appliedRows.map((r) => r.name))

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()

  let ran = 0
  for (const file of files) {
    const tag = file.replace(/\.sql$/, "")
    if (applied.has(tag)) {
      console.log(`= ${tag} (already applied)`)
      continue
    }
    const content = readFileSync(join(MIGRATIONS_DIR, file), "utf8")
    const statements = splitStatements(content).filter(isExecutable)
    console.log(`+ Applying ${tag} (${statements.length} statement(s))...`)
    for (const stmt of statements) {
      await sql.query(stmt.trim())
    }
    await sql`INSERT INTO __migrations (name) VALUES (${tag})`
    console.log(`+ ${tag} applied`)
    ran += 1
  }

  if (ran === 0) {
    console.log("No pending migrations.")
  } else {
    console.log(`Applied ${ran} migration(s).`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
