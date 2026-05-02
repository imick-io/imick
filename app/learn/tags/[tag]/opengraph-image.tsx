import { ogContentType, ogSize, renderOgImage } from "@/lib/og"

export const contentType = ogContentType
export const size = ogSize

export default async function Image(
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag: encodedTag } = await params
  const tag = decodeURIComponent(encodedTag)
  return renderOgImage({ eyebrow: "Tag", title: `#${tag}` })
}
