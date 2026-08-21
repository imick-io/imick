# Design System

This is a role-abstract specification of the portfolio's design system. It
describes structure and mechanics, not a specific brand. Roles (Brand Accent,
Display Sans, Canvas Soft, Ink) are named abstractly so the spec is
open-source-safe and forkable. The concrete values this repo currently ships
live in the **Current Instantiation** block below; swap that block to re-skin.

The canonical decisions behind the current instantiation are recorded in
`docs/adr/0006-portfolio-brand-instantiation.md`.

## Overview

The system is built on four ideas:

1. **A single accent.** One Brand Accent carries every intentional highlight
   (primary CTAs, focus rings, active states). Tertiary accents are not used;
   the discipline is what makes the accent read as opinion rather than
   decoration. The accent is reserved, never a background wash.
2. **A two-face type system.** A Display Sans handles headline/display moments
   at heavy weights; a Body Sans handles all running text. A monospace face is
   retained for code surfaces. There is no serif.
3. **Surface-contrast elevation.** Depth comes from surface tone (Canvas Soft
   under white/near-white cards, an Ink card for the rare dark moment), not from
   heavy shadows. Pages compose surfaces via primitives rather than restyling.
4. **Pill geometry.** The radius base is large; buttons and cards adopt the
   canonical pill radius, while form inputs stay a step smaller so they do not
   read as overly-rounded pills.

## Color roles

Every role is defined for both a light polarity and a warm-dark polarity
(user-toggled dark mode). Values are oklch.

| Role            | Purpose                                                    |
| --------------- | ---------------------------------------------------------- |
| Brand Accent    | Single accent: primary CTA, focus ring, active state       |
| Canvas          | Page background                                             |
| Canvas Soft     | Tinted surface for `sage`-toned cards / chips              |
| Card            | Default elevated surface (white in light, ink in dark)      |
| Ink             | Foreground text; also the dark card / dark hero surface     |
| Muted           | Neutral hover surface + secondary text                      |
| Positive / Warning / Negative | Semantic states, hue-shifted ~5deg warm    |

**Accessibility.** The Brand Accent must clear AA contrast as text/CTA against
both Canvas and Canvas Soft in light mode, and against the warm-dark Canvas in
dark mode (the accent is lifted in dark to hold AA).

## Typography

Display scale (Display Sans, heavy weights):

| Utility        | Size / Leading |
| -------------- | -------------- |
| `display-mega` | 126 / 107      |
| `display-xl`   | 64 / 54        |
| `display-md`   | 40 / 34        |
| `display-sm`   | 32 / 38        |
| `display-xs`   | 24 / 31        |

Body text uses the Body Sans at 400 (running text) and 600 (emphasis).

## Spacing scale

`{spacing.xxs}` 2, `{spacing.xs}` 4, `{spacing.sm}` 8, `{spacing.md}` 12,
`{spacing.lg}` 16, `{spacing.xl}` 24, `{spacing.2xl}` 32, `{spacing.3xl}` 48.

## Radius scale

`sm` 8, `md` 12, `lg` 16, `xl` 24, `pill` (stadium), `full` (circle). The
`--radius` base is 24px so `rounded-xl` is the default pill geometry. Form
inputs deliberately hold `md` (12px).

## Surface primitives

Under `components/ui/brand/`. Each exposes a simple variant prop (`tone` /
`variant`) and forwards `ref` + children. No free-form `className` override on
the variants the spec covers.

- **`hero-band`** (`tone="light" | "dark"`). Full-bleed hero surface. Owns band
  padding. Dark tone is an Ink canvas with accent headline text, reserved for
  the locked polarity-flip moments.
- **`content-band`**. White content surface for long-form/editorial content;
  centres a reading-width column and exposes a display heading slot.
- **`card-feature`** (`variant="default" | "sage" | "accent-pale" | "dark"`).
  Editorial card. default = white; sage = Canvas Soft tint; accent-pale = pale
  Brand Accent tint; dark = Ink card with accent text.

## Polarity-flip editorial map (locked)

Dark moments are intentional and few: the homepage closing CTA (`hero-band`
dark), the /about resume CTA card (`card-feature` dark), and the always-dark
footer. No other dark moments outside the footer.

---

## Current Instantiation

The values this repo currently ships (see ADR 0006):

- **Brand Accent:** electric cobalt `#3d5afe` (lifted to `#6b85ff` in dark for AA).
- **Canvas Soft:** warm bone `#f1ede3`. Warm-dark canvas `#14110d`, dark card `#1a1814`.
- **Ink:** warm near-black.
- **Display Sans:** Manrope (800 for display, 400/600 for utility headings).
- **Body Sans:** Inter (400/600).
- **Mono:** Geist Mono (code surfaces).
- **Radius base:** 24px (`--radius: 1.5rem`).
