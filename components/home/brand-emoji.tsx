/*
 * Brand emoji: flat SVG glyphs for recipes on the home page.
 * Shared spec so the set stays coherent as it grows: rounded emoji-like
 * geometry, foreground main silhouette, muted secondary shade, exactly one
 * primary-green accent per glyph. Colors resolve through theme classes, so
 * every glyph adapts to light and dark automatically.
 */

export function BrandEmoji({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  switch (slug) {
    case "smash-burgers":
      return <BurgerEmoji className={className} />
    case "slow-beef-ragu":
      return <RaguEmoji className={className} />
    case "basque-cheesecake":
      return <CheesecakeEmoji className={className} />
    case "shakshuka":
      return <ShakshukaEmoji className={className} />
    default:
      return <RaguEmoji className={className} />
  }
}

type GlyphProps = { className?: string }

function BurgerEmoji({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {/* top bun */}
      <path
        d="M12 26c0-9 9-15 20-15s20 6 20 15v2H12z"
        className="fill-foreground"
      />
      {/* seeds punched out of the bun */}
      <ellipse cx="24" cy="20" rx="2" ry="1.3" className="fill-background" />
      <ellipse cx="32" cy="17" rx="2" ry="1.3" className="fill-background" />
      <ellipse cx="40" cy="20" rx="2" ry="1.3" className="fill-background" />
      {/* lettuce, the green accent */}
      <rect x="10" y="30" width="44" height="6" rx="3" className="fill-primary" />
      {/* patty */}
      <rect x="12" y="38" width="40" height="7" rx="3.5" className="fill-muted-foreground" />
      {/* bottom bun */}
      <path
        d="M12 47h40v1c0 5-4 8-9 8H21c-5 0-9-3-9-8z"
        className="fill-foreground"
      />
    </svg>
  )
}

function RaguEmoji({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {/* steam, the green accent */}
      <path
        d="M26 6c-2 3 2 5 0 9M38 6c-2 3 2 5 0 9"
        className="stroke-primary"
        fill="none"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      {/* pasta mound peeking over the rim */}
      <path
        d="M14 28c2-7 9-11 18-11s16 4 18 11z"
        className="fill-muted-foreground"
      />
      {/* bowl */}
      <path
        d="M8 28h48v5c0 12-10 21-24 21S8 45 8 33z"
        className="fill-foreground"
      />
    </svg>
  )
}

function CheesecakeEmoji({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {/* mint on top, the green accent */}
      <circle cx="32" cy="9" r="4" className="fill-primary" />
      {/* burnt basque top */}
      <path
        d="M10 26c0-5 10-9 22-9s22 4 22 9v5H10z"
        className="fill-foreground"
      />
      {/* cake body */}
      <path
        d="M10 31h44v16a7 7 0 01-7 7H17a7 7 0 01-7-7z"
        className="fill-muted-foreground"
      />
    </svg>
  )
}

function ShakshukaEmoji({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {/* handle */}
      <rect x="48" y="31" width="14" height="6" rx="3" className="fill-foreground" />
      {/* pan */}
      <circle cx="29" cy="34" r="22" className="fill-foreground" />
      <circle cx="29" cy="34" r="17" className="fill-muted-foreground" />
      {/* eggs, yolks carry the green accent */}
      <circle cx="23" cy="28" r="6.5" className="fill-background" />
      <circle cx="23" cy="28" r="2.8" className="fill-primary" />
      <circle cx="36" cy="41" r="6.5" className="fill-background" />
      <circle cx="36" cy="41" r="2.8" className="fill-primary" />
    </svg>
  )
}
