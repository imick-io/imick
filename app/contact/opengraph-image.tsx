import { ogContentType, ogSize, renderOgImage } from "@/lib/og"

export const alt = "Get in touch"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Contact",
    title: "Get in touch.",
  })
}
