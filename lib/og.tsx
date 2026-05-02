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
