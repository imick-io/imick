import fallback from "./handbook.fallback.json"
import { drawEdges, placeNodes } from "./flow-geometry"
import type { Handbook } from "./types"

export type { Handbook } from "./types"

// The skills repo regenerates this file on every change to its skills.
export const HANDBOOK_URL = "https://raw.githubusercontent.com/imick-io/skills/main/docs/handbook.json"
export const HANDBOOK_SOURCE = "https://github.com/imick-io/skills/blob/main/docs/handbook.json"

// A handbook is usable when its lists are there and every flowchart resolves.
export function isUsableHandbook(data: unknown): data is Handbook {
  if (!data || typeof data !== "object") return false
  const h = data as Partial<Handbook>
  const lists = [h.flows, h.stages, h.labels, h.journeys, h.groups, h.skills, h.branches, h.settings]
  if (!lists.every(Array.isArray) || !h.intro || !h.install || !h.modes || !h.flowLayout) return false
  try {
    for (const flow of h.flows!) drawEdges(flow, placeNodes(flow, h.flowLayout), h.flowLayout)
    return true
  } catch {
    return false
  }
}

// Read from the public skills repo, refreshed daily. A failed fetch or a file
// the page can't draw falls back to the copy bundled with the site.
export async function getHandbook(): Promise<Handbook> {
  try {
    const res = await fetch(HANDBOOK_URL, { next: { revalidate: 86400 } })
    if (res.ok) {
      const data: unknown = await res.json()
      if (isUsableHandbook(data)) return data
      console.warn("getHandbook: docs/handbook.json can't be drawn, using the bundled copy")
    }
  } catch (error) {
    console.warn(`getHandbook: fetch failed, using the bundled copy: ${String(error)}`)
  }
  return fallback as unknown as Handbook
}

export { installClosure } from "./graph"
