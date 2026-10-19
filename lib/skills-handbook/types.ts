// The shape of docs/handbook.json in imick-io/skills, generated there by
// `sync.py regen`. The /skills page renders it as is.

export type LabelRole = "what" | "agent" | "human" | "plan" | "loop" | "park"

export type StageTag = { cmd: string } | { label: string; role: LabelRole }

export type JourneyStep =
  | { label: string; role: LabelRole }
  | { via: string }
  | { end: string }

// A flowchart coordinate: a number, a node anchor ("build.cy", "triage.cx-50"),
// the middle of a row ("row9"), or the midpoint of two ("mid(a,b)").
export type FlowExpr = string | number

export type FlowNode = {
  col: string
  row: number
  lane: string
  title?: string
  cmd?: string
  sub?: string
  pills?: { role: LabelRole; label: string }[]
}

export type FlowEdge = {
  points: [FlowExpr, FlowExpr][]
  label?: string
  at?: [FlowExpr, FlowExpr]
  dash?: boolean
  join?: boolean
}

export type FlowLane = {
  name: string
  sub: string
  x: number
  width: number
  tone: "you" | "loop" | "gh"
}

export type Flow = {
  id: string
  title: string
  description: string
  note?: string
  rows: number
  columns: Record<string, number>
  lanes: FlowLane[]
  nodes: Record<string, FlowNode>
  edges: FlowEdge[]
}

export type FlowLayout = {
  width: number
  nodeWidth: number
  top: number
  row: number
  nodeHeight: number
  nodeHeightWithPills: number
}

export type SkillRun = "you" | "auto" | "loop"

export type Skill = {
  name: string
  group: string
  summary: string
  description: string
  runs: SkillRun[]
  uses: string[]
  next: string[]
  source: string
  url: string
}

export type Handbook = {
  repo: string
  intro: {
    title: string
    lede: string
    principles: { tone: "human" | "agent" | "park"; title: string; body: string }[]
  }
  install: { steps: { title: string; command: string }[] }
  flows: Flow[]
  flowLayout: FlowLayout
  stages: { title: string; who: string; body: string; tags: StageTag[] }[]
  labels: {
    name: string
    role: LabelRole
    kind: string
    means: string
    setBy: string
    next: string
  }[]
  journeys: { title: string; steps: JourneyStep[]; alt?: JourneyStep[]; note?: string }[]
  modes: {
    columns: string[]
    rows: { moment: string; cells: [string, string][] }[]
    notes: { tone: string; title: string; body: string }[]
    settings: string
  }
  groups: { id: string; title: string; description: string }[]
  skills: Skill[]
  branches: { branch: string; holds: string; mergesInto: string }[]
  settings: { file: string; says: string }[]
}
