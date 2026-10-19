import type { Flow, FlowExpr, FlowLayout, FlowNode } from "./types"

export type PlacedNode = FlowNode & {
  id: string
  x: number
  y: number
  w: number
  h: number
}

type Anchor = "L" | "R" | "T" | "B" | "cx" | "cy"

// Nodes sit on a grid: a named column (its centre x) and a row.
export function placeNodes(flow: Flow, layout: FlowLayout): Record<string, PlacedNode> {
  const placed: Record<string, PlacedNode> = {}
  for (const [id, node] of Object.entries(flow.nodes)) {
    const cx = flow.columns[node.col]
    if (cx === undefined) throw new Error(`Flow "${flow.id}": node "${id}" has unknown column "${node.col}"`)
    const h = node.pills?.length ? layout.nodeHeightWithPills : layout.nodeHeight
    placed[id] = {
      ...node,
      id,
      x: cx - layout.nodeWidth / 2,
      y: layout.top + node.row * layout.row,
      w: layout.nodeWidth,
      h,
    }
  }
  return placed
}

export function flowHeight(flow: Flow, layout: FlowLayout) {
  return layout.top + flow.rows * layout.row + 6
}

function anchor(node: PlacedNode, name: Anchor) {
  switch (name) {
    case "L":
      return node.x
    case "R":
      return node.x + node.w
    case "T":
      return node.y
    case "B":
      return node.y + node.h
    case "cx":
      return node.x + node.w / 2
    case "cy":
      return node.y + node.h / 2
  }
}

// Splits "a,b" at its top-level comma, ignoring commas inside nested mid().
function splitArgs(inner: string): [string, string] {
  let depth = 0
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i]
    if (c === "(") depth++
    else if (c === ")") depth--
    else if (c === "," && depth === 0) return [inner.slice(0, i), inner.slice(i + 1)]
  }
  throw new Error(`mid() needs two arguments: "${inner}"`)
}

export function evaluate(
  expr: FlowExpr,
  nodes: Record<string, PlacedNode>,
  layout: FlowLayout
): number {
  if (typeof expr === "number") return expr
  const e = expr.replace(/\s+/g, "")
  if (/^-?\d+(\.\d+)?$/.test(e)) return Number(e)

  if (e.startsWith("mid(") && e.endsWith(")")) {
    const [a, b] = splitArgs(e.slice(4, -1))
    return (evaluate(a, nodes, layout) + evaluate(b, nodes, layout)) / 2
  }

  const row = e.match(/^row(\d+)$/)
  if (row) return layout.top + Number(row[1]) * layout.row + layout.nodeHeight / 2

  const ref = e.match(/^(\w+)\.(L|R|T|B|cx|cy)([+-]\d+(?:\.\d+)?)?$/)
  if (ref) {
    const node = nodes[ref[1]]
    if (!node) throw new Error(`Unknown node "${ref[1]}" in "${expr}"`)
    return anchor(node, ref[2] as Anchor) + (ref[3] ? Number(ref[3]) : 0)
  }

  throw new Error(`Unknown flow expression "${expr}"`)
}

export type DrawnEdge = {
  path: string
  dash: boolean
  arrow: boolean
  label?: { text: string; x: number; y: number }
}

export function drawEdges(flow: Flow, nodes: Record<string, PlacedNode>, layout: FlowLayout): DrawnEdge[] {
  return flow.edges.map((edge) => {
    const path = edge.points
      .map(([x, y], i) => `${i ? "L" : "M"}${evaluate(x, nodes, layout)},${evaluate(y, nodes, layout)}`)
      .join(" ")
    return {
      path,
      dash: Boolean(edge.dash),
      arrow: !edge.join,
      label:
        edge.label && edge.at
          ? { text: edge.label, x: evaluate(edge.at[0], nodes, layout), y: evaluate(edge.at[1], nodes, layout) }
          : undefined,
    }
  })
}
