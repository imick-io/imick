import { experience, type Experience } from "./data/experience"

export type RoleChip = {
  company: string
  role: string
  outcome: string
  href?: string
}

const TAKEUP_OUTCOME = "Two years senior full-stack"
const FLINKS_OUTCOME = "acquired $100M"
const ZUMRAILS_OUTCOME = "$100M+ raise"

function findEngagement(entries: Experience[], name: string) {
  for (const entry of entries) {
    const match = entry.engagements?.find((e) => e.name === name)
    if (match) return match
  }
  return undefined
}

function findEmployer(entries: Experience[], company: string) {
  return entries.find((e) => e.company === company)
}

export function getPreviousRolesStrip(): RoleChip[] {
  const takeup = findEngagement(experience, "Takeup")
  if (!takeup) {
    throw new Error("getPreviousRolesStrip: missing Takeup engagement in experience data")
  }

  const flinks = findEmployer(experience, "Flinks")
  if (!flinks) {
    throw new Error("getPreviousRolesStrip: missing Flinks employer in experience data")
  }

  const zumrails = findEmployer(experience, "Zumrails")
  if (!zumrails) {
    throw new Error("getPreviousRolesStrip: missing Zumrails employer in experience data")
  }

  return [
    { company: "Takeup", role: takeup.role, outcome: TAKEUP_OUTCOME },
    { company: "Flinks", role: flinks.role, outcome: FLINKS_OUTCOME },
    { company: "Zumrails", role: zumrails.role, outcome: ZUMRAILS_OUTCOME },
  ]
}
