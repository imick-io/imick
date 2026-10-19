import type { Metadata } from "next"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, GithubIcon } from "@hugeicons/core-free-icons"

import { FlowChart } from "@/components/skills/flow-chart"
import { LabelTable } from "@/components/skills/label-table"
import { Command, LabelChip, RichText, SectionHeading } from "@/components/skills/primitives"
import { SkillsBrowser } from "@/components/skills/skills-browser"
import { CardFeature } from "@/components/ui/brand/card-feature"
import { siteConfig } from "@/lib/config"
import { getHandbook, HANDBOOK_SOURCE } from "@/lib/skills-handbook"
import type { JourneyStep, StageTag } from "@/lib/skills-handbook/types"
import { cn } from "@/lib/utils"

// The handbook data is fetched with a one-day revalidation; the page follows.
export const revalidate = 86400

const description =
  "My agent skills for Claude Code: how they take an idea to merged code, the GitHub labels they work with, the agent loop's modes, and which skill uses which."

export const metadata: Metadata = {
  title: "Skills",
  description,
  alternates: { canonical: "/skills" },
  openGraph: {
    type: "website",
    url: "/skills",
    siteName: siteConfig.handle,
    title: "Agent skills handbook",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent skills handbook",
    description,
  },
}

const SECTIONS = [
  { id: "use", title: "Use it" },
  { id: "flows", title: "Flows" },
  { id: "stages", title: "Stages" },
  { id: "labels", title: "Labels" },
  { id: "modes", title: "Modes" },
  { id: "skills", title: "Skills" },
  { id: "dependencies", title: "Dependencies" },
  { id: "branches", title: "Branches" },
]

const TONE_BORDER: Record<string, string> = {
  human: "border-primary",
  agent: "border-foreground",
  park: "border-muted-foreground/50",
  loop: "border-primary",
}

function Tag({ tag }: { tag: StageTag }) {
  return "cmd" in tag ? <Command>{tag.cmd}</Command> : <LabelChip role={tag.role}>{tag.label}</LabelChip>
}

function Steps({ steps }: { steps: JourneyStep[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => {
        const next = steps[i + 1]
        if ("label" in step) {
          return (
            <span key={i} className="inline-flex items-center gap-2">
              <LabelChip role={step.role}>{step.label}</LabelChip>
              {next && "label" in next ? <span className="text-muted-foreground">→</span> : null}
            </span>
          )
        }
        if ("end" in step) {
          return (
            <span key={i} className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {step.end}
            </span>
          )
        }
        return (
          <span key={i} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            → <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground/80">{step.via}</span> →
          </span>
        )
      })}
    </div>
  )
}

export default async function SkillsPage() {
  const handbook = await getHandbook()
  const repoUrl = `https://github.com/${handbook.repo}`

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:gap-24 md:py-24">
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Open source · {handbook.repo}</p>
            <h1 className="display-md max-w-3xl">{handbook.intro.title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={GithubIcon} size={16} />
              GitHub
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={`${repoUrl}/blob/main/CHANGELOG.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Changelog
            </a>
          </div>
        </div>
        <p className="max-w-3xl text-base leading-relaxed md:text-lg">{handbook.intro.lede}</p>
        <div className="grid gap-6 pt-2 md:grid-cols-3">
          {handbook.intro.principles.map((p) => (
            <div key={p.title} className={cn("flex flex-col gap-1 border-t-2 pt-3", TONE_BORDER[p.tone] ?? "border-border")}>
              <p className="font-display text-base font-bold">{p.title}</p>
              <p className="text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
        <nav aria-label="On this page" className="flex flex-wrap gap-2 pt-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex h-8 items-center rounded-pill border border-border bg-card px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </header>

      <section id="use" className="mx-auto w-full max-w-5xl scroll-mt-24">
        <CardFeature variant="sage" className="gap-5 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Use it</p>
          <ol className="grid gap-4 md:grid-cols-3">
            {handbook.install.steps.map((step, i) => (
              <li key={step.command} className="flex flex-col gap-2">
                <p className="text-sm font-semibold">
                  <span className="mr-1.5 font-mono text-muted-foreground">{i + 1}.</span>
                  {step.title}
                </p>
                <code className="overflow-x-auto whitespace-nowrap rounded-md border border-border bg-card px-3 py-2 font-mono text-[0.8rem]">
                  {step.command}
                </code>
              </li>
            ))}
          </ol>
        </CardFeature>
      </section>

      <section id="flows" className="mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-16">
        {handbook.flows.map((flow, i) => (
          <div key={flow.id} id={`flow-${flow.id}`} className="flex scroll-mt-24 flex-col gap-6">
            <SectionHeading eyebrow={i === 0 ? "Overview" : "Agent loop mode"} title={flow.title}>
              <RichText text={flow.description} />
            </SectionHeading>
            <FlowChart flow={flow} layout={handbook.flowLayout} />
            {flow.note ? (
              <p className="max-w-3xl border-l-2 border-primary pl-4 text-sm text-muted-foreground">
                <RichText text={flow.note} />
              </p>
            ) : null}
          </div>
        ))}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <svg width="34" height="10" aria-hidden="true">
              <line x1="0" y1="5" x2="34" y2="5" className="stroke-muted-foreground" strokeWidth={1.5} />
            </svg>
            the main path
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="34" height="10" aria-hidden="true">
              <line x1="0" y1="5" x2="34" y2="5" className="stroke-muted-foreground" strokeWidth={1.5} strokeDasharray="5 4" />
            </svg>
            feedback, and questions to you
          </span>
        </div>
      </section>

      <section id="stages" className="mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-6">
        <SectionHeading eyebrow="Step by step" title="The stages" />
        <ol className="grid gap-4 md:grid-cols-2">
          {handbook.stages.map((stage, i) => (
            <li key={stage.title} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
                <h3 className="font-display text-lg font-bold">{stage.title}</h3>
                <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{stage.who}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
              <div className="flex flex-wrap gap-1.5">
                {stage.tags.map((tag, j) => (
                  <Tag key={j} tag={tag} />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="labels" className="mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-6">
        <SectionHeading eyebrow="Reference" title="Labels">
          A triaged issue carries one <b className="text-foreground">what</b> label (what it is) and one{" "}
          <b className="text-foreground">who</b> label (who acts next). Planning labels mark the issues the planning skills create; loop labels are
          state the agent loop sets while it works. An assignee means claimed: someone, or some agent, is on it now.
        </SectionHeading>
        <LabelTable labels={handbook.labels} />
        <div className="flex flex-col gap-4 pt-6">
          <h3 className="display-xs">Label journeys</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">The same labels, in the order an issue meets them. The tags on the arrows name what moves it.</p>
          <div className="flex flex-col gap-3">
            {handbook.journeys.map((j) => (
              <div key={j.title} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
                <h4 className="font-display text-base font-bold">{j.title}</h4>
                <Steps steps={j.steps} />
                {j.alt ? <Steps steps={j.alt} /> : null}
                {j.note ? <p className="text-sm text-muted-foreground">{j.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modes" className="mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-6">
        <SectionHeading eyebrow="How much waits on you" title="Manual, autopilot, fast, supersonic">
          <RichText text={handbook.modes.settings} />
        </SectionHeading>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-muted/60 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Moment</th>
                {handbook.modes.columns.map((c) => (
                  <th key={c} className="px-4 py-3 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {handbook.modes.rows.map((row) => (
                <tr key={row.moment} className="border-t border-border align-top">
                  <td className="px-4 py-3 font-semibold">{row.moment}</td>
                  {row.cells.map(([who, text], i) => (
                    <td
                      key={i}
                      className={cn("px-4 py-3", who === "you" && "font-medium text-primary", who === "none" && "text-muted-foreground")}
                    >
                      {text}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Highlighted cells wait on you; the rest are done for you.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {handbook.modes.notes.map((note) => (
            <CardFeature key={note.title} variant={note.tone === "loop" ? "accent-pale" : "default"} className="gap-2 p-5">
              <p className="font-display text-base font-bold">{note.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <RichText text={note.body} />
              </p>
            </CardFeature>
          ))}
        </div>
      </section>

      <section id="skills" className="mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-6">
        <SectionHeading eyebrow="Catalog" title="Skills">
          <b className="text-foreground">You type it</b> skills run only when you call them with <Command>/name</Command>.{" "}
          <b className="text-foreground">Claude picks it</b> skills also load on their own when the task fits. Select a skill to see what it
          uses.
        </SectionHeading>
        <SkillsBrowser skills={handbook.skills} groups={handbook.groups} />
      </section>

      <section id="branches" className="mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-6">
        <SectionHeading eyebrow="Where things live" title="Branches and settings" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Branch</th>
                  <th className="px-4 py-3 font-medium">Holds</th>
                  <th className="px-4 py-3 font-medium">Merges into</th>
                </tr>
              </thead>
              <tbody>
                {handbook.branches.map((b) => (
                  <tr key={b.branch} className="border-t border-border align-top">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{b.branch}</td>
                    <td className="px-4 py-3">{b.holds}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.mergesInto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Says</th>
                </tr>
              </thead>
              <tbody>
                {handbook.settings.map((s) => (
                  <tr key={s.file} className="border-t border-border align-top">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{s.file}</td>
                    <td className="px-4 py-3">{s.says}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          All of these are written by <Command>/setup-imick-skills</Command>, run once per project, and stay editable by hand.
        </p>
      </section>

      <p className="mx-auto w-full max-w-5xl border-t border-border pt-6 text-xs text-muted-foreground">
        This page is drawn from{" "}
        <a href={HANDBOOK_SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
          docs/handbook.json
        </a>{" "}
        in {handbook.repo}, regenerated with the skills and refreshed here daily.
      </p>
    </div>
  )
}
