import { ogContentType, ogSize, renderOgImage } from "@/lib/og"

export const alt = "Agent skills handbook"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Open source",
    title: "Agent skills handbook",
  })
}
