export type Experience = {
  company: string
  role: string
  startDate: string
  endDate?: string
  current?: boolean
  location?: string
  description: string
  highlights: string[]
  order: number
}

export const experience: Experience[] = [
  {
    company: "Your Company",
    role: "Senior Software Engineer",
    startDate: "2023-01",
    current: true,
    location: "Remote",
    description: "Replace with your actual experience.",
    highlights: ["Replace with your actual highlights"],
    order: 1,
  },
]
