"use client"

import { useState } from "react"

import { FilterChipButton } from "@/components/ui/filter-chip"
import type { Handbook } from "@/lib/skills-handbook/types"

import { LabelChip } from "./primitives"

const KINDS = [
  { id: "all", title: "All" },
  { id: "What", title: "What" },
  { id: "Who", title: "Who" },
  { id: "Planning", title: "Planning" },
  { id: "Loop", title: "Loop state" },
  { id: "other", title: "Parked & other" },
] as const

const NAMED = new Set(["What", "Who", "Planning", "Loop"])

export function LabelTable({ labels }: { labels: Handbook["labels"] }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all")
  const shown = labels.filter((l) => kind === "all" || l.kind === kind || (kind === "other" && !NAMED.has(l.kind)))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter labels by kind">
        {KINDS.map((k) => (
          <FilterChipButton key={k.id} active={kind === k.id} aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
            {k.title}
          </FilterChipButton>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/60 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Label</th>
              <th className="px-4 py-3 font-medium">Kind</th>
              <th className="px-4 py-3 font-medium">Means</th>
              <th className="px-4 py-3 font-medium">Set by</th>
              <th className="px-4 py-3 font-medium">What happens next</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l.name} className="border-t border-border align-top">
                <td className="px-4 py-3">
                  <LabelChip role={l.role}>{l.name}</LabelChip>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{l.kind}</td>
                <td className="px-4 py-3">{l.means}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.setBy}</td>
                <td className="px-4 py-3">{l.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
