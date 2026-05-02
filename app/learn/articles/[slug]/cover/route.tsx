import { renderArticleCover } from "@/lib/og"
import { getPostBySlug } from "@/lib/posts"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return new Response("Not found", { status: 404 })
  return renderArticleCover({ title: post.title, category: post.category })
}
