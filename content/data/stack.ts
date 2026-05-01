export type StackItem = {
  name: string
  category: "language" | "framework" | "database" | "infrastructure" | "tool"
  order: number
}

export const stack: StackItem[] = [
  { name: "TypeScript", category: "language", order: 1 },
  { name: "React", category: "framework", order: 2 },
  { name: "Next.js", category: "framework", order: 3 },
  { name: "Node.js", category: "language", order: 4 },
  { name: "PostgreSQL", category: "database", order: 5 },
  { name: "Tailwind CSS", category: "tool", order: 6 },
]
