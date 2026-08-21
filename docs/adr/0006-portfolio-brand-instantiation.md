# Portfolio brand instantiation: cobalt + warm bone + Manrope

The portfolio is the top of a contracts-primary funnel. It shipped with an inherited shadcn baseline (a muted teal/olive accent, a generic ~10px radius, Geist + Instrument Serif fonts) that was never a deliberate brand choice. `DESIGN.md` describes the *structure* wanted (single accent, two-face typography, surface-contrast elevation, pill geometry) as a role-abstract, open-source-safe spec. This ADR records the concrete *instantiation* of that system for imick.io, so the values are a reviewed decision rather than ad-hoc styling.

## Decision

Three coupled brand decisions, non-negotiable and taken together:

1. **Brand Accent = electric cobalt `#3d5afe`** (`oklch(0.555 0.243 268.8)`). Lifted to `#6b85ff` (`oklch(0.657 0.182 271.5)`) in warm-dark mode so it clears AA as text/CTA against the warm-dark canvas; `--primary-foreground` flips to warm ink on the lifted accent. The accent lives only in `--primary`/`--ring`; `--accent` stays a neutral warm hover surface.
2. **Canvas Soft = warm bone `#f1ede3`** (`oklch(0.946 0.014 88.7)`), with white cards and warm-ink text in light mode. Warm-dark mode uses a warm-dark canvas `#14110d` and dark card `#1a1814`, ink inverted to warm near-white. Existing user-toggled dark mode (`theme-provider` / `theme-toggle`) is kept unchanged.
3. **Display Sans = Manrope, Body Sans = Inter.** Manrope carries display/headline moments (800; 400/600 for utility headings) via `--font-display`; Inter carries all running text (400/600) via `--font-sans`. Geist Mono is retained for code. There is no serif. `font-heading`/`font-serif` are kept as aliases of the display face so existing call sites keep rendering after the swap.

Supporting decisions:

- **Radius base shifts to `1.5rem` (24px)** with the full scale `sm` 8 / `md` 12 / `lg` 16 / `xl` 24 / `pill` / `full`. Buttons and cards adopt the canonical `rounded-xl` (24px) pill; form inputs (`input`, `textarea`, `select` trigger) hold `rounded-md` (12px) so they do not read as overly-rounded pills.
- **Semantic palette** (positive / warning / negative) is preserved with a ~5deg warm hue shift rather than inventing new families; `--destructive` moves to hue 32.
- **Tertiary peach and cyan accents from the original spec are dropped** to hold single-accent discipline.
- **Polarity-flip editorial map (locked):** dark moments are only the homepage closing CTA (`hero-band` dark), the /about resume CTA card (`card-feature` dark), and the always-dark footer. No other dark moments.

## Rationale

**Why cobalt + bone + Manrope, together.** The muted teal read as a safe, forgettable shadcn portfolio. A single saturated cobalt against a warm bone canvas gives the headline a magazine-cover frame that earns the discovery-call CTA, while the warm neutral keeps long-form reading comfortable. Manrope's heavy display weights supply the two-face contrast the system depends on; Inter is a neutral, dimensionally-precise body face. The three are coupled: cobalt needs the warm neutral to avoid reading cold/corporate, and the heavy display face needs the reserved accent so nothing competes with it.

**Why depersonalize `DESIGN.md`.** Instantiating the system verbatim from an external brand would visually impersonate them. Keeping `DESIGN.md` role-abstract (Brand Accent, Display Sans, Canvas Soft) with a small "Current Instantiation" block removes impersonation risk and keeps the spec forkable, while this ADR carries the concrete, imick.io-specific values.

**Why keep oklch and the existing dark-mode plumbing.** The swap is scoped to presentation. Migrating color models or the theme toggle would widen blast radius for no brand benefit.

## Consequences

- `app/globals.css`: `:root` and `.dark` token sets rewritten to the cobalt/bone/warm-dark values; radius scale set to concrete `sm`/`md`/`lg`/`xl` + `pill`; `--radius` base `1.5rem`; display-scale `@utility` classes added (`display-mega` … `display-xs`); `--font-display` wired, `--font-heading`/`--font-serif` aliased to it.
- `app/layout.tsx`: Manrope + Inter loaded via `next/font/google` (Geist and Instrument Serif removed); Geist Mono retained.
- shadcn primitives re-derived at the token level: `button` default `rounded-xl`; `input`/`textarea`/`select` trigger `rounded-md`. No contract changes.
- New brand primitive `components/ui/brand/hero-band.tsx` (`tone="light" | "dark"`) joins the existing `content-band` and `card-feature`.
- Rollout is a Foundation PR (this token/type/primitive swap, current layouts intact) followed by page-by-page PRs (homepage, /about, /resume, /contact, /learn, /admin + /bookmarks). The site stays usable at every step.
- Note: this ADR is numbered `0006`; `0005` was already taken by the background-bookmark-enrichment decision when this work landed (the PRD had reserved `0005` before that number was used).
