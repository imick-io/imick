// Pure seam for the Paste-to-Drafts bulk-add flow (PRD #47, issue #49).
//
// Parses a pasted blob of URLs into normalized, deduped, validated entries and
// partitions them against the set of Bookmarks that already exist. No DB, no
// network: the server action reads existing normalized keys and passes them in,
// keeping this module unit-testable in isolation (cf. lib/bookmarks-meta.ts).

/** A validated, normalized URL: the original as pasted plus its dedupe key. */
export type ParsedUrl = {
  /** The URL exactly as it appeared in the paste (stored on the Draft row). */
  url: string
  /** The normalized dedupe key (see {@link normalizeBookmarkUrl}). */
  key: string
}

export type ParsedUrls = {
  /** Valid entries, deduped within the paste, in first-seen order. */
  valid: ParsedUrl[]
  /** Tokens that were not valid http(s) URLs, in order, for reporting. */
  invalid: string[]
}

export type Partition = {
  /** Entries with no matching existing key: inserted as new Drafts. */
  toCreate: ParsedUrl[]
  /** Entries that already exist as a Bookmark, for the skipped report. */
  skipped: ParsedUrl[]
}

/**
 * Reduce a URL to a comparison key so trivial variants collapse to one:
 * lowercase host, `www.` stripped, http/https unified (scheme dropped),
 * trailing slashes removed, fragment dropped, query string preserved.
 *
 * Returns `null` for anything that is not a parseable http(s) URL.
 */
export function normalizeBookmarkUrl(raw: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(raw.trim())
  } catch {
    return null
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "")
  const path = parsed.pathname.replace(/\/+$/, "")
  return `${host}${path}${parsed.search}`
}

/**
 * Parse a pasted blob into valid, normalized, in-paste-deduped entries plus the
 * invalid tokens. Splits on newlines, commas, and any whitespace; trims and
 * drops blanks; preserves first-seen order for both valid entries and dupes.
 */
export function parseBookmarkUrls(raw: string): ParsedUrls {
  const tokens = raw.split(/[\s,]+/).filter(Boolean)

  const valid: ParsedUrl[] = []
  const invalid: string[] = []
  const seen = new Set<string>()

  for (const token of tokens) {
    const key = normalizeBookmarkUrl(token)
    if (key === null) {
      invalid.push(token)
      continue
    }
    if (seen.has(key)) continue
    seen.add(key)
    valid.push({ url: token, key })
  }

  return { valid, invalid }
}

/**
 * Split parsed entries into those to create and those that already exist,
 * comparing each entry's normalized key against `existing`.
 */
export function partitionNewUrls(
  parsed: ParsedUrl[],
  existing: ReadonlySet<string>
): Partition {
  const toCreate: ParsedUrl[] = []
  const skipped: ParsedUrl[] = []

  for (const entry of parsed) {
    if (existing.has(entry.key)) {
      skipped.push(entry)
    } else {
      toCreate.push(entry)
    }
  }

  return { toCreate, skipped }
}

// ─── batch report transport ──────────────────────────────────────────────────
//
// The batch-create action redirects back to the admin list rather than the edit
// page, so the summary travels in the URL. Encoded as base64url'd JSON to keep
// arbitrary URLs (with their own query strings) intact through the query param.

export type BatchReport = {
  /** How many Drafts were inserted. */
  created: number
  /** URLs skipped because they already exist, as pasted. */
  skipped: string[]
  /** Tokens that were not valid URLs. */
  invalid: string[]
}

export function encodeBatchReport(report: BatchReport): string {
  return Buffer.from(JSON.stringify(report)).toString("base64url")
}

export function decodeBatchReport(param: string | undefined | null): BatchReport | null {
  if (!param) return null
  try {
    const parsed = JSON.parse(Buffer.from(param, "base64url").toString("utf8"))
    if (
      typeof parsed?.created === "number" &&
      Array.isArray(parsed?.skipped) &&
      Array.isArray(parsed?.invalid)
    ) {
      return parsed as BatchReport
    }
    return null
  } catch {
    return null
  }
}
