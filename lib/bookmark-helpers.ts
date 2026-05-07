export function parseProsConsText(raw: string | null | undefined): string[] {
  if (!raw) return []
  return raw
    .split("\n")
    .map((line) => line.replace(/^[-•+*]\s*/, "").trim())
    .filter(Boolean)
}
