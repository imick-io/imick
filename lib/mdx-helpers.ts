export type Heading = { depth: 2 | 3; text: string; id: string }

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n")
  const headings: Heading[] = []
  const seen = new Map<string, number>()
  let inFence = false
  let fence: string | null = null

  for (const raw of lines) {
    const line = raw.replace(/\r$/, "")
    const fenceMatch = line.match(/^\s*(```+|~~~+)/)
    if (fenceMatch) {
      const marker = fenceMatch[1][0]
      if (!inFence) {
        inFence = true
        fence = marker
      } else if (fence === marker) {
        inFence = false
        fence = null
      }
      continue
    }
    if (inFence) continue

    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/)
    if (!match) continue
    const depth = match[1].length === 2 ? 2 : 3
    const text = match[2].trim()
    if (!text) continue
    const baseSlug = slugify(text) || `section-${headings.length + 1}`
    const count = seen.get(baseSlug) ?? 0
    seen.set(baseSlug, count + 1)
    const id = count === 0 ? baseSlug : `${baseSlug}-${count}`
    headings.push({ depth: depth as 2 | 3, text, id })
  }

  return headings
}

const WORDS_PER_MINUTE = 200

export function readingTimeMinutes(markdown: string): number {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`>-]/g, " ")
  const words = stripped.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
