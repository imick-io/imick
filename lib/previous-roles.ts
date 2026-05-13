import { experience, type Experience } from "./data/experience"

export type RoleChip = {
  company: string
  role: string
  outcome: string
  href?: string
}

type ChipSource = {
  company: string
  outcome: string
  find: (entries: Experience[]) => { role: string } | undefined
}

const findEmployer = (company: string) => (entries: Experience[]) =>
  entries.find((e) => e.company === company)

const findEngagement = (name: string) => (entries: Experience[]) =>
  entries.flatMap((e) => e.engagements ?? []).find((e) => e.name === name)

const CHIPS: readonly ChipSource[] = [
  { company: "Takeup", outcome: "Two years senior full-stack", find: findEngagement("Takeup") },
  { company: "Flinks", outcome: "acquired $100M", find: findEmployer("Flinks") },
  { company: "Zumrails", outcome: "$100M+ raise", find: findEmployer("Zumrails") },
]

export function getPreviousRolesStrip(): RoleChip[] {
  return CHIPS.map(({ company, outcome, find }) => {
    const match = find(experience)
    if (!match) {
      throw new Error(`getPreviousRolesStrip: missing ${company} in experience data`)
    }
    return { company, role: match.role, outcome }
  })
}
