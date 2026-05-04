import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/config"

export const ogSize = { width: 1200, height: 630 } as const
export const ogContentType = "image/png"

type RenderOgImageOptions = {
  eyebrow: string
  title: string
}

export function renderOgImage({ eyebrow, title }: RenderOgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a3a3a3",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 128,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 32,
            color: "#a3a3a3",
          }}
        >
          <span style={{ display: "flex" }}>{siteConfig.handle}</span>
          <span style={{ display: "flex" }}>{siteConfig.role}</span>
        </div>
      </div>
    ),
    { ...ogSize }
  )
}

type RenderBookmarkCoverOptions = {
  title: string
  eyebrow: string
  logoUrl?: string | null
  rating?: number | null
  accentColor?: string | null
}

function darkenHex(hex: string, factor = 0.35) {
  const value = hex.replace("#", "")
  if (value.length !== 6) return "#1f1f2e"
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  const dr = Math.round(r * factor)
  const dg = Math.round(g * factor)
  const db = Math.round(b * factor)
  return `rgb(${dr}, ${dg}, ${db})`
}

export function renderBookmarkCover({
  title,
  eyebrow,
  logoUrl,
  rating,
  accentColor,
}: RenderBookmarkCoverOptions) {
  const accent = accentColor && /^#?[0-9a-fA-F]{6}$/.test(accentColor)
    ? accentColor.startsWith("#")
      ? accentColor
      : `#${accentColor}`
    : "#3b82f6"
  const dark = darkenHex(accent, 0.18)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: `linear-gradient(135deg, #0a0a0a 0%, ${dark} 100%)`,
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            color: accent,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 7,
              background: accent,
            }}
          />
          {eyebrow}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- ImageResponse uses Satori, which only supports raw <img>.
            <img
              src={logoUrl}
              alt=""
              width={120}
              height={120}
              style={{
                width: 120,
                height: 120,
                borderRadius: 24,
                background: "#fafafa",
                objectFit: "contain",
              }}
            />
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              flex: 1,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#a3a3a3",
          }}
        >
          <span style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ display: "flex" }}>{siteConfig.handle}</span>
            {rating != null ? (
              <>
                <span style={{ display: "flex", color: "#404040" }}>·</span>
                <span style={{ display: "flex", color: "#fbbf24", letterSpacing: "0.05em" }}>
                  {"★".repeat(rating)}
                  <span style={{ color: "#404040" }}>{"★".repeat(5 - rating)}</span>
                </span>
              </>
            ) : null}
          </span>
          <span style={{ display: "flex" }}>{siteConfig.name}</span>
        </div>
      </div>
    ),
    { ...ogSize }
  )
}

type ArticleCategory = "opinion" | "technical" | "other"

const categoryGradients: Record<ArticleCategory, { from: string; to: string; accent: string }> = {
  opinion: { from: "#1a0b1f", to: "#3a0d2c", accent: "#ec4899" },
  technical: { from: "#0a1424", to: "#0d2a4a", accent: "#3b82f6" },
  other: { from: "#0f0f14", to: "#1f1f2e", accent: "#a3a3a3" },
}

const categoryEyebrow: Record<ArticleCategory, string> = {
  opinion: "Opinion",
  technical: "Technical",
  other: "Other",
}

type RenderArticleCoverOptions = {
  title: string
  category: ArticleCategory
}

export function renderArticleCover({ title, category }: RenderArticleCoverOptions) {
  const palette = categoryGradients[category]
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            color: palette.accent,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 7,
              background: palette.accent,
            }}
          />
          {categoryEyebrow[category]}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#a3a3a3",
          }}
        >
          <span style={{ display: "flex" }}>{siteConfig.handle}</span>
          <span style={{ display: "flex" }}>{siteConfig.name}</span>
        </div>
      </div>
    ),
    { ...ogSize }
  )
}
