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
