import { ogContentType, ogSize, renderOgImage } from "@/lib/og"

export const alt = "Newsletter"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Newsletter",
    title: "Notes on shipping software.",
  })
}
