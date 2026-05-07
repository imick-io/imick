import type { Metadata } from "next"
import { ClassCard } from "@/components/learn/class-card"
import { siteConfig } from "@/lib/config"
import { getAllClassesForRender } from "@/lib/classes"

const description = `Structured classes by ${siteConfig.name} -- deep-dives you can follow start to finish.`

export const metadata: Metadata = {
  title: "Classes",
  description,
  alternates: { canonical: "/learn/classes" },
  openGraph: {
    type: "website",
    url: "/learn/classes",
    siteName: siteConfig.handle,
    title: `Classes | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Classes | ${siteConfig.name}`,
    description,
  },
}

export default function ClassesIndexPage() {
  const classes = getAllClassesForRender()

  return (
    <div className="flex flex-col gap-10 px-6 py-16 md:py-20">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Learn</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Classes</h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Structured courses on topics I write and ship.
        </p>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {classes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/30 p-10 text-center">
            <p className="text-base font-medium text-foreground">First class coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The first class is being written. Check back shortly.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <li key={cls.slug}>
                <ClassCard cls={cls} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
