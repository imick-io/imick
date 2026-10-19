import { describe, expect, it } from "vitest"

import fallback from "./handbook.fallback.json"
import { drawEdges, evaluate, placeNodes } from "./flow-geometry"
import { installClosure, isUsableHandbook } from "./index"
import type { Flow, FlowLayout, Handbook } from "./types"

const layout: FlowLayout = {
  width: 980,
  nodeWidth: 196,
  top: 76,
  row: 92,
  nodeHeight: 58,
  nodeHeightWithPills: 78,
}

const flow: Flow = {
  id: "test",
  title: "Test",
  description: "",
  rows: 2,
  columns: { left: 100, right: 400 },
  lanes: [],
  nodes: {
    a: { col: "left", row: 0, lane: "you", title: "A" },
    b: { col: "right", row: 1, lane: "loop", title: "B", pills: [{ role: "agent", label: "x" }] },
  },
  edges: [],
}

describe("flow geometry", () => {
  const nodes = placeNodes(flow, layout)

  it("places nodes on their column and row", () => {
    expect(nodes.a).toMatchObject({ x: 2, y: 76, w: 196, h: 58 })
    expect(nodes.b).toMatchObject({ x: 302, y: 168, h: 78 })
  })

  it("resolves anchors, offsets, rows and midpoints", () => {
    expect(evaluate("a.cx", nodes, layout)).toBe(100)
    expect(evaluate("a.B", nodes, layout)).toBe(134)
    expect(evaluate("b.cx-50", nodes, layout)).toBe(350)
    expect(evaluate("b.cy+12", nodes, layout)).toBe(219)
    expect(evaluate("row1", nodes, layout)).toBe(197)
    expect(evaluate("mid(a.cx,b.cx)", nodes, layout)).toBe(250)
    expect(evaluate("mid(a.B,mid(a.cx,b.cx))", nodes, layout)).toBe(192)
    expect(evaluate(870, nodes, layout)).toBe(870)
  })

  it("rejects what it can't resolve", () => {
    expect(() => evaluate("c.cx", nodes, layout)).toThrow(/Unknown node/)
    expect(() => evaluate("a.middle", nodes, layout)).toThrow(/Unknown flow expression/)
  })
})

describe("the bundled handbook", () => {
  const handbook = fallback as unknown as Handbook

  it("is usable, and every flowchart draws", () => {
    expect(isUsableHandbook(handbook)).toBe(true)
    for (const f of handbook.flows) {
      const edges = drawEdges(f, placeNodes(f, handbook.flowLayout), handbook.flowLayout)
      expect(edges.length).toBe(f.edges.length)
    }
  })

  it("has no em-dash", () => {
    expect(JSON.stringify(handbook)).not.toContain(String.fromCharCode(0x2014))
  })

  it("links only to skills it lists", () => {
    const names = new Set(handbook.skills.map((s) => s.name))
    for (const s of handbook.skills) {
      for (const n of [...s.uses, ...s.next]) expect(names, `${s.name} → ${n}`).toContain(n)
    }
  })

  it("rejects a file the page can't draw", () => {
    expect(isUsableHandbook(null)).toBe(false)
    expect(isUsableHandbook({ ...handbook, skills: undefined })).toBe(false)
    const broken = structuredClone(handbook)
    broken.flows[0].edges[0].points[0] = ["nowhere.cx", 0]
    expect(isUsableHandbook(broken)).toBe(false)
  })

  it("follows what a skill loads, transitively", () => {
    const closure = installClosure("dig", handbook.skills)
    expect(closure).toContain("research")
    expect(closure).not.toContain("dig")
  })
})
