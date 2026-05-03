import { allPosts } from "content-collections"
import { siteConfig } from "@/lib/config"
import { isDraft } from "@/lib/posts"
import { mdxToHtml } from "@/lib/rss-html"

export const dynamic = "force-static"

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function rfc822(value: string): string {
  return new Date(value).toUTCString()
}

export async function GET() {
  const posts = allPosts
    .filter((p) => !isDraft(p))
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())

  const items = await Promise.all(
    posts.map(async (post) => {
      const link = new URL(`/learn/articles/${post.slug}`, siteConfig.url).toString()
      const html = await mdxToHtml(post.content)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc822(post.publishedAt!)}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`
    })
  )

  const feedUrl = new URL("/learn/articles/feed.xml", siteConfig.url).toString()
  const siteUrl = new URL("/learn/articles", siteConfig.url).toString()
  const lastBuildDate = posts[0]?.publishedAt ? rfc822(posts[0].publishedAt) : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`Articles | ${siteConfig.handle}`)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(`Articles by ${siteConfig.name} — opinions and technical deep-dives.`)}</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
