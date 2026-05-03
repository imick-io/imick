import { allSnippets } from "content-collections"
import { siteConfig } from "@/lib/config"
import { isSnippetDraft } from "@/lib/snippets"
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
  const snippets = allSnippets
    .filter((s) => !isSnippetDraft(s))
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())

  const items = await Promise.all(
    snippets.map(async (snippet) => {
      const link = new URL(`/learn/snippets/${snippet.slug}`, siteConfig.url).toString()
      const description = snippet.description ?? `${snippet.language} snippet — ${snippet.title}`
      const html = await mdxToHtml(snippet.content)
      return `    <item>
      <title>${escapeXml(snippet.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc822(snippet.publishedAt!)}</pubDate>
      <description>${escapeXml(description)}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`
    })
  )

  const feedUrl = new URL("/learn/snippets/feed.xml", siteConfig.url).toString()
  const siteUrl = new URL("/learn/snippets", siteConfig.url).toString()
  const lastBuildDate = snippets[0]?.publishedAt ? rfc822(snippets[0].publishedAt) : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`Snippets | ${siteConfig.handle}`)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(`Code snippets by ${siteConfig.name} — short, copy-pastable reference code.`)}</description>
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
