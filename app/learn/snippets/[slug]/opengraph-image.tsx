import { ogContentType, ogSize, renderOgImage } from "@/lib/og"
import { getSnippetBySlug } from "@/lib/snippets"

export const contentType = ogContentType
export const size = ogSize

export default async function Image(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const snippet = getSnippetBySlug(slug)
  const title = snippet?.title ?? "Snippet"
  const eyebrow = snippet?.language ?? "Code"
  return renderOgImage({ eyebrow, title })
}
