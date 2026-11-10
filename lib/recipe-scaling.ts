// Scales the free-text quantities in an ingredient note ("3 cloves, minced",
// "1/2 tsp", "2-3 bananas") alongside the gram weight. Each comma or
// semicolon separated segment has its leading quantity scaled; segments that
// describe a per-unit size ("each"), a percentage, or a temperature are left
// alone, as are segments that do not start with a number ("to taste").

const NUMBER = String.raw`\d+\s+\d+/\d+|\d+/\d+|\d+(?:\.\d+)?`
const LEADING = new RegExp(
  String.raw`^(${NUMBER})(?:\s*-\s*(${NUMBER}))?(?![\d%°./-])(\s*)(.*)$`
)
const CAN_SIZE = /^\d+(?:\.\d+)? oz can\b/

// Countable words that appear after a quantity in recipe notes.
const PLURALS: Record<string, string> = {
  banana: "bananas",
  bottle: "bottles",
  can: "cans",
  clove: "cloves",
  cup: "cups",
  disc: "discs",
  egg: "eggs",
  fillet: "fillets",
  lemon: "lemons",
  lime: "limes",
  onion: "onions",
  pound: "pounds",
  recipe: "recipes",
  sprig: "sprigs",
  thigh: "thighs",
}
const SINGULARS = Object.fromEntries(
  Object.entries(PLURALS).map(([one, many]) => [many, one])
)

// Amounts are rounded to what a cook would measure: fine fractions under 1,
// quarters and thirds up to 5, halves up to 10, whole numbers above.
const FINE = [
  1 / 16,
  1 / 8,
  1 / 4,
  1 / 3,
  3 / 8,
  1 / 2,
  5 / 8,
  2 / 3,
  3 / 4,
  7 / 8,
]
const COARSE = [0, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4]
const FRACTION_LABELS = new Map<number, string>([
  [1 / 16, "1/16"],
  [1 / 8, "1/8"],
  [1 / 4, "1/4"],
  [1 / 3, "1/3"],
  [3 / 8, "3/8"],
  [1 / 2, "1/2"],
  [5 / 8, "5/8"],
  [2 / 3, "2/3"],
  [3 / 4, "3/4"],
  [7 / 8, "7/8"],
])

function nearest(value: number, candidates: number[]): number {
  return candidates.reduce((best, c) =>
    Math.abs(c - value) < Math.abs(best - value) ? c : best
  )
}

function parseQuantity(text: string): number {
  const parts = text.trim().split(/\s+/)
  return parts.reduce((sum, part) => {
    const [num, den] = part.split("/")
    return sum + (den ? Number(num) / Number(den) : Number(num))
  }, 0)
}

export function formatQuantity(value: number): string {
  if (value <= 0) return "0"
  if (value >= 10) return String(Math.round(value))
  if (value < 1) {
    const fraction = nearest(value, [...FINE, 1])
    return fraction === 1 ? "1" : FRACTION_LABELS.get(fraction)!
  }
  const steps = value < 5 ? COARSE : [0, 1 / 2]
  let whole = Math.floor(value)
  let fraction = nearest(value - whole, [...steps, 1])
  if (fraction === 1) {
    whole += 1
    fraction = 0
  }
  return fraction === 0
    ? String(whole)
    : `${whole} ${FRACTION_LABELS.get(fraction)}`
}

// Inflects the counted noun, which is the first or second word ("3 cloves",
// "3 medium cloves").
function inflect(rest: string, quantity: number): string {
  const match = rest.match(/^((?:\w+ )?)(\w+)(.*)$/)
  if (!match) return rest
  const [, adjective, word, tail] = match
  const forms = quantity > 1 ? PLURALS : SINGULARS
  const inflected = forms[word.toLowerCase()]
  if (inflected) return adjective + inflected + tail
  if (adjective)
    return inflect(adjective.trimEnd(), quantity) + " " + word + tail
  return rest
}

function scaleSegment(segment: string, scale: number): string {
  if (/\beach\b/.test(segment)) return segment
  if (CAN_SIZE.test(segment)) {
    return `${formatQuantity(scale)} × ${segment}`
  }
  const match = segment.match(LEADING)
  if (!match) return segment
  const [, low, high, space, rest] = match
  const scaledLow = parseQuantity(low) * scale
  const scaledHigh = high ? parseQuantity(high) * scale : undefined
  const quantity = high
    ? `${formatQuantity(scaledLow)}-${formatQuantity(scaledHigh!)}`
    : formatQuantity(scaledLow)
  return quantity + space + inflect(rest, scaledHigh ?? scaledLow)
}

export function scaleNote(note: string, scale: number): string {
  if (scale === 1) return note
  return note
    .split(/([,;]\s*)/)
    .map((part, i) => (i % 2 === 0 ? scaleSegment(part, scale) : part))
    .join("")
}
