import { drawEdges, flowHeight, placeNodes } from "@/lib/skills-handbook/flow-geometry"
import type { Flow, FlowLane, FlowLayout, LabelRole } from "@/lib/skills-handbook/types"
import { cn } from "@/lib/utils"

const LANE_BAR: Record<FlowLane["tone"], string> = {
  you: "fill-primary",
  loop: "fill-foreground",
  gh: "fill-muted-foreground/60",
}

const NODE_STROKE: Record<FlowLane["tone"], string> = {
  you: "stroke-primary/70",
  loop: "stroke-foreground/50",
  gh: "stroke-muted-foreground/40",
}

const PILL: Record<LabelRole, { rect: string; text: string; dash?: boolean }> = {
  human: { rect: "fill-primary/10 stroke-primary/40", text: "fill-primary" },
  agent: { rect: "fill-foreground stroke-foreground", text: "fill-background" },
  plan: { rect: "fill-secondary stroke-border", text: "fill-secondary-foreground" },
  loop: { rect: "fill-card stroke-primary/60", text: "fill-primary", dash: true },
  what: { rect: "fill-muted stroke-border", text: "fill-muted-foreground" },
  park: { rect: "fill-card stroke-muted-foreground/50", text: "fill-muted-foreground", dash: true },
}

// Text widths are estimated: SVG can't measure before it renders.
const pillWidth = (label: string) => label.length * 6.4 + 18
const edgeLabelWidth = (label: string) => label.length * 6.3 + 12

export function FlowChart({ flow, layout }: { flow: Flow; layout: FlowLayout }) {
  const nodes = placeNodes(flow, layout)
  const edges = drawEdges(flow, nodes, layout)
  const height = flowHeight(flow, layout)
  const arrowId = `flow-${flow.id}-arrow`
  // A node's lane is the tone of the column it sits in: you, loop or gh.
  const toneOf = (lane: string) => (lane in NODE_STROKE ? lane : "gh") as FlowLane["tone"]

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card" role="region" aria-label={flow.title} tabIndex={0}>
      <svg
        viewBox={`0 0 ${layout.width} ${height}`}
        className="block h-auto w-full min-w-[780px]"
        role="img"
        aria-label={`${flow.title}: ${flow.description.replaceAll("`", "")}`}
      >
        <defs>
          <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {flow.lanes.map((lane, i) => (
          <g key={lane.name}>
            <rect x={lane.x} y={0} width={lane.width} height={height} className={i % 2 ? "fill-muted/40" : "fill-card"} />
            {i > 0 ? <line x1={lane.x} y1={0} x2={lane.x} y2={height} className="stroke-border" /> : null}
            <rect x={lane.x} y={0} width={lane.width} height={4} className={LANE_BAR[lane.tone]} />
            <text x={lane.x + 18} y={30} className="fill-foreground font-display text-[15px] font-extrabold">
              {lane.name}
            </text>
            <text x={lane.x + 18} y={48} className="fill-muted-foreground font-sans text-[12px]">
              {lane.sub}
            </text>
          </g>
        ))}

        {edges.map((edge, i) => (
          <path
            key={i}
            d={edge.path}
            className="fill-none stroke-muted-foreground"
            strokeWidth={1.5}
            strokeDasharray={edge.dash ? "5 4" : undefined}
            markerEnd={edge.arrow ? `url(#${arrowId})` : undefined}
          />
        ))}

        {Object.values(nodes).map((node) => {
          const tx = node.x + 14
          return (
            <g key={node.id}>
              <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={10} className={cn("fill-card", NODE_STROKE[toneOf(node.lane)])} strokeWidth={1.2} />
              <text x={tx} y={node.y + 24} className={node.cmd ? "fill-foreground font-mono text-[12px] font-semibold" : "fill-foreground font-display text-[14px] font-bold"}>
                {node.cmd ?? node.title}
              </text>
              {node.sub ? (
                <text x={tx} y={node.y + 43} className="fill-muted-foreground font-sans text-[11.5px]">
                  {node.sub}
                </text>
              ) : null}
              {(node.pills ?? []).map((pill) => (
                <g key={pill.label}>
                  <rect
                    x={tx}
                    y={node.y + 52}
                    width={pillWidth(pill.label)}
                    height={17}
                    rx={8.5}
                    className={PILL[pill.role].rect}
                    strokeDasharray={PILL[pill.role].dash ? "3 2" : undefined}
                  />
                  <text x={tx + 9} y={node.y + 64.5} className={cn("font-mono text-[10.5px] font-semibold", PILL[pill.role].text)}>
                    {pill.label}
                  </text>
                </g>
              ))}
            </g>
          )
        })}

        {edges.map((edge, i) =>
          edge.label ? (
            <g key={`label-${i}`}>
              <rect
                x={edge.label.x - edgeLabelWidth(edge.label.text) / 2}
                y={edge.label.y - 10}
                width={edgeLabelWidth(edge.label.text)}
                height={18}
                rx={4}
                className="fill-card"
              />
              <text x={edge.label.x} y={edge.label.y + 3.5} textAnchor="middle" className="fill-foreground/80 font-sans text-[11.5px] font-semibold">
                {edge.label.text}
              </text>
            </g>
          ) : null
        )}
      </svg>
    </div>
  )
}
