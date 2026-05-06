import type { Metadata } from "next"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { ResumeGateDialog } from "@/components/resume-gate-dialog"
import { siteConfig } from "@/lib/config"
import { experience } from "@/content/data/experience"
import { education } from "@/content/data/education"
import { projects } from "@/content/data/projects"

const aboutDescription = `${siteConfig.name} is a senior full-stack engineer designing and shipping AI-native products end-to-end.`

export const metadata: Metadata = {
  title: "About",
  description: aboutDescription,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    siteName: siteConfig.handle,
    title: `About ${siteConfig.name}`,
    description: aboutDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${siteConfig.name}`,
    description: aboutDescription,
  },
}

function formatMonth(value: string) {
  const [year, month] = value.split("-")
  if (!year || !month) return value
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleString("en-US", { month: "short", year: "numeric" })
}

function formatRange(startDate: string, endDate?: string, current?: boolean) {
  const start = formatMonth(startDate)
  const end = current ? "Present" : endDate ? formatMonth(endDate) : "Present"
  return `${start} — ${end}`
}

export default function AboutPage() {
  const sortedExperience = [...experience]
    .filter((item) => !item.linkedinOnly)
    .sort((a, b) => {
      if (a.current && !b.current) return -1
      if (!a.current && b.current) return 1
      return b.startDate.localeCompare(a.startDate)
    })

  const sortedEducation = [...education].sort((a, b) => {
    const aEnd = a.endYear ?? Number.POSITIVE_INFINITY
    const bEnd = b.endYear ?? Number.POSITIVE_INFINITY
    return bEnd - aEnd
  })

  const sortedProjects = [...projects].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:gap-24 md:py-24">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <p className="text-sm font-medium text-muted-foreground">{siteConfig.role}</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {siteConfig.name}
        </h1>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Bio</h2>
        <p className="text-base leading-relaxed text-foreground md:text-lg">
          {siteConfig.bio}
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <h2 className="text-sm font-medium text-muted-foreground">Experience</h2>
        <ol className="flex flex-col gap-8">
          {sortedExperience.map((item) => (
            <li
              key={`${item.company}-${item.startDate}`}
              className="flex flex-col gap-3 border-l-2 border-border pl-5"
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-medium text-foreground">{item.role}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatRange(item.startDate, item.endDate, item.current)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
              </div>
              {item.description ? (
                <p className="text-sm leading-relaxed text-foreground/90">{item.description}</p>
              ) : null}
              {item.highlights.length > 0 ? (
                <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-foreground/90 marker:text-muted-foreground">
                  {item.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
              {item.engagements && item.engagements.length > 0 ? (
                <div className="mt-2 flex flex-col gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Engagements
                  </p>
                  <ol className="flex flex-col gap-6 border-l border-border/60 pl-5">
                    {[...item.engagements]
                      .sort((a, b) => a.order - b.order)
                      .map((eng) => (
                        <li key={eng.name} className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h4 className="text-base font-medium text-foreground">
                                {eng.name}
                                <span className="font-normal text-muted-foreground">
                                  {" · "}
                                  {eng.role}
                                </span>
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatRange(eng.startDate, eng.endDate, eng.current)}
                              </span>
                            </div>
                            {eng.summary ? (
                              <p className="text-sm leading-relaxed text-foreground/90">
                                {eng.summary}
                              </p>
                            ) : null}
                          </div>
                          {eng.highlights.length > 0 ? (
                            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-foreground/90 marker:text-muted-foreground">
                              {eng.highlights.map((highlight, i) => (
                                <li key={i}>{highlight}</li>
                              ))}
                            </ul>
                          ) : null}
                          {eng.tech && eng.tech.length > 0 ? (
                            <ul className="flex flex-wrap gap-1.5 pt-1">
                              {eng.tech.map((t) => (
                                <li
                                  key={t}
                                  className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground"
                                >
                                  {t}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      ))}
                  </ol>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <h2 className="text-sm font-medium text-muted-foreground">Education</h2>
        <ol className="flex flex-col gap-6">
          {sortedEducation.map((item) => (
            <li
              key={`${item.institution}-${item.startYear}`}
              className="flex flex-col gap-1"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-medium text-foreground">
                  {item.degree}
                  {item.field ? `, ${item.field}` : ""}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {item.startYear}
                  {item.endYear ? ` — ${item.endYear}` : " — Present"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.institution}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <h2 className="text-sm font-medium text-muted-foreground">Open Source</h2>
        <ul className="flex flex-col gap-4">
          {sortedProjects.map((project) => (
            <li key={project.name}>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <HugeiconsIcon icon={GithubIcon} size={18} />
                    <span className="text-base font-medium">{project.name}</span>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={16}
                    className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col items-start gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Resume</h2>
        <p className="text-sm text-muted-foreground">
          Download the full PDF resume.
        </p>
        <ResumeGateDialog />
      </section>
    </div>
  )
}
