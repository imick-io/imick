import { stack, type StackCategory, type StackItem } from "./data/stack"

const CATEGORY_ORDER: StackCategory[] = [
  "ai",
  "frontend",
  "backend",
  "data",
  "infra",
  "tooling",
]

const CATEGORY_LABEL: Record<StackCategory, string> = {
  ai: "AI",
  frontend: "Frontend",
  backend: "Backend",
  data: "Data",
  infra: "Infrastructure",
  tooling: "Tooling",
}

export type StackGroup = {
  category: StackCategory
  label: string
  items: StackItem[]
}

export function groupStackByCategory(items: StackItem[]): StackGroup[] {
  const groups: StackGroup[] = []
  for (const category of CATEGORY_ORDER) {
    const bucket = items
      .filter((item) => item.category === category)
      .sort((a, b) => a.order - b.order)
    if (bucket.length === 0) continue
    groups.push({ category, label: CATEGORY_LABEL[category], items: bucket })
  }
  return groups
}

export function getStackByCategory(): StackGroup[] {
  return groupStackByCategory(stack)
}
