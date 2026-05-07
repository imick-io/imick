import type { Metadata } from "next"
import { FoliosGrid } from "@/components/learn/folios-grid"
import { siteConfig } from "@/lib/config"
import { getAllFoliosForRender } from "@/lib/folios"

const description = `Folios by ${siteConfig.name} -- curated, ordered reading paths through articles and snippets.`

export const metadata: Metadata = {
  title: "Folios",
  description,
  alternates: { canonical: "/learn/folios" },
  openGraph: {
    type: "website",
    url: "/learn/folios",
    siteName: siteConfig.handle,
    title: `Folios | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Folios | ${siteConfig.name}`,
    description,
  },
}

export default function FoliosIndexPage() {
  const folios = getAllFoliosForRender()

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Learn</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Folios</h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Curated reading paths through articles and snippets.
        </p>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {folios.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
            <p className="text-base font-medium text-foreground">First folio coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Curated reading paths are being assembled. Check back shortly.
            </p>
          </div>
        ) : (
          <FoliosGrid folios={folios} />
        )}
      </section>
    </div>
  )
}
