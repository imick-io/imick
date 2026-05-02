import { ogContentType, ogSize, renderOgImage } from "@/lib/og"
import { siteConfig } from "@/lib/config"

export const alt = `${siteConfig.name} — ${siteConfig.role}`
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: siteConfig.role,
    title: siteConfig.name,
  })
}
