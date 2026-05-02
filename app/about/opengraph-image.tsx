import { ogContentType, ogSize, renderOgImage } from "@/lib/og"
import { siteConfig } from "@/lib/config"

export const alt = `About ${siteConfig.name}`
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "About",
    title: siteConfig.name,
  })
}
