import { ogContentType, ogSize, renderOgImage } from "@/lib/og"

export const alt = "Privacy"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Privacy",
    title: "What I collect, why, and how to opt out.",
  })
}
