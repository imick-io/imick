import type { Metadata } from "next"
import { SnippetCard } from "@/components/learn/snippet-card"
import { siteConfig } from "@/lib/config"
import { getAllSnippetsForRender } from "@/lib/snippets"

const description = `Code snippets by ${siteConfig.name} — short, copy-pastable reference code.`

export const metadata: Metadata = {
  title: "Snippets",
  description,
  alternates: { canonical: "/learn/snippets" },
  openGraph: {
    type: "website",
    url: "/learn/snippets",
    siteName: siteConfig.handle,
    title: `Snippets | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Snippets | ${siteConfig.name}`,
    description,
  },
}

export default function SnippetsIndexPage() {
  const snippets = getAllSnippetsForRender()

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Learn</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Snippets</h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Short, copy-pastable code I keep reaching for.
        </p>
      </header>

      <section className="mx-auto w-full max-w-5xl">
        {snippets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
            <p className="text-base font-medium text-foreground">First snippet coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The first snippet is being written. Check back shortly.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {snippets.map((snippet) => (
              <li key={snippet.slug}>
                <SnippetCard snippet={snippet} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
