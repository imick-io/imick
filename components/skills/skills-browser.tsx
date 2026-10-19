"use client"

import { useMemo, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"

import { FilterChipButton } from "@/components/ui/filter-chip"
import { Input } from "@/components/ui/input"
import { installClosure } from "@/lib/skills-handbook/graph"
import type { Handbook, Skill, SkillRun } from "@/lib/skills-handbook/types"
import { cn } from "@/lib/utils"

const RUN_LABEL: Record<SkillRun, string> = { you: "you type it", auto: "Claude picks it", loop: "agent loop" }
const RUN_CLASS: Record<SkillRun, string> = {
  you: "border-primary/40 bg-primary/10 text-primary",
  auto: "border-border bg-muted text-muted-foreground",
  loop: "border-foreground bg-foreground text-background",
}
const RUN_FILTERS: { id: SkillRun | "all"; title: string }[] = [
  { id: "all", title: "All" },
  { id: "you", title: "You type it" },
  { id: "auto", title: "Claude picks it" },
  { id: "loop", title: "Run by the loop" },
]

function Runs({ skill }: { skill: Skill }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skill.runs.map((r) => (
        <span key={r} className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[11px]", RUN_CLASS[r])}>
          {RUN_LABEL[r]}
        </span>
      ))}
    </div>
  )
}

function SkillList({ names, empty, onPick }: { names: string[]; empty: string; onPick: (n: string) => void }) {
  if (!names.length) return <p className="text-sm italic text-muted-foreground">{empty}</p>
  return (
    <div className="flex flex-wrap gap-1.5">
      {names.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPick(n)}
          className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-xs transition-colors hover:border-primary hover:text-primary"
        >
          {n}
        </button>
      ))}
    </div>
  )
}

export function SkillsBrowser({ skills, groups }: Pick<Handbook, "skills" | "groups">) {
  const [query, setQuery] = useState("")
  const [run, setRun] = useState<SkillRun | "all">("all")
  const [selected, setSelected] = useState(skills.find((s) => s.name === "wayfinder")?.name ?? skills[0]?.name)
  const explorer = useRef<HTMLDivElement>(null)

  const byName = useMemo(() => new Map(skills.map((s) => [s.name, s])), [skills])
  const q = query.trim().toLowerCase()
  const matches = (s: Skill) =>
    (run === "all" || s.runs.includes(run)) && (!q || s.name.includes(q) || s.summary.toLowerCase().includes(q))
  const visibleGroups = groups
    .map((g) => ({ ...g, skills: skills.filter((s) => s.group === g.id && matches(s)) }))
    .filter((g) => g.skills.length)

  const pick = (name: string, scroll = false) => {
    setSelected(name)
    if (scroll) explorer.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const current = selected ? byName.get(selected) : undefined
  const usedBy = current ? skills.filter((s) => s.uses.includes(current.name)).map((s) => s.name) : []
  const around = current
    ? [...new Set([...current.next, ...skills.filter((s) => s.next.includes(current.name)).map((s) => s.name)])]
    : []
  const closure = current ? installClosure(current.name, skills) : []

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            id="skills-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills"
            aria-label="Search skills"
            className="max-w-xs bg-card"
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by how a skill runs">
            {RUN_FILTERS.map((f) => (
              <FilterChipButton key={f.id} active={run === f.id} aria-pressed={run === f.id} onClick={() => setRun(f.id)}>
                {f.title}
              </FilterChipButton>
            ))}
          </div>
        </div>

        {visibleGroups.length ? (
          visibleGroups.map((g) => (
            <div key={g.id} className="flex flex-col gap-3">
              <div>
                <h3 className="font-display text-lg font-bold">{g.title}</h3>
                <p className="text-sm text-muted-foreground">{g.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.skills.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => pick(s.name, true)}
                    className={cn(
                      "flex flex-col gap-2 rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary",
                      selected === s.name ? "border-primary" : "border-border"
                    )}
                  >
                    <span className="font-mono text-sm font-semibold">{s.name}</span>
                    <span className="text-sm text-muted-foreground">{s.summary}</span>
                    <Runs skill={s} />
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm italic text-muted-foreground">No skill matches &ldquo;{query}&rdquo;.</p>
        )}
      </div>

      <div ref={explorer} id="dependencies" className="flex scroll-mt-24 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">What calls what</p>
          <h3 className="display-xs">Dependencies</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">
            A skill <b className="text-foreground">uses</b> another when it loads it mid-run. It <b className="text-foreground">hands off</b> to
            the one that normally comes next. A project needs every skill its skills use, committed in{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">.claude/skills/</code>: agents in the loop&apos;s sandboxes only
            see the repo.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex max-h-80 flex-col gap-0.5 overflow-y-auto rounded-lg border border-border bg-card p-2 md:max-h-[520px]" role="listbox" aria-label="Choose a skill">
            {groups.map((g) => {
              const list = skills.filter((s) => s.group === g.id)
              if (!list.length) return null
              return (
                <div key={g.id} className="flex flex-col gap-0.5">
                  <p className="px-2.5 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{g.title}</p>
                  {list.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      role="option"
                      aria-selected={selected === s.name}
                      onClick={() => pick(s.name)}
                      className={cn(
                        "rounded-md px-2.5 py-1.5 text-left font-mono text-xs transition-colors",
                        selected === s.name ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>

          {current ? (
            <div className="flex flex-col gap-5 self-start rounded-lg border border-border bg-card p-6" aria-live="polite">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-mono text-xl font-semibold">{current.name}</h4>
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    SKILL.md
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
                <Runs skill={current} />
                <p className="text-base leading-relaxed">{current.summary}</p>
                <p className="text-xs text-muted-foreground">From {current.source}</p>
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                {[
                  { title: "Uses", names: current.uses, empty: "Nothing: it stands alone" },
                  { title: "Used by", names: usedBy, empty: "No other skill loads it" },
                  { title: "Comes before / after", names: around, empty: "Not part of a chain" },
                ].map((rel) => (
                  <div key={rel.title} className="flex flex-col gap-2 rounded-md bg-muted/60 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{rel.title}</p>
                    <SkillList names={rel.names} empty={rel.empty} onPick={(n) => pick(n)} />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {closure.length ? (
                  <>
                    To install <code className="font-mono text-foreground">{current.name}</code>, also install{" "}
                    {closure.map((n, i) => (
                      <span key={n}>
                        <code className="font-mono text-foreground">{n}</code>
                        {i < closure.length - 1 ? ", " : "."}
                      </span>
                    ))}
                  </>
                ) : (
                  "Installs on its own: it loads no other skill."
                )}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
