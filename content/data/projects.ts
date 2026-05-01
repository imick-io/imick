export type Project = {
  name: string
  description: string
  githubUrl: string
  url?: string
  stars?: number
  featured?: boolean
  order: number
}

export const projects: Project[] = [
  {
    name: "imick.io",
    description: "My open-source personal portfolio and content platform.",
    githubUrl: "https://github.com/PLACEHOLDER/imick-io",
    featured: true,
    order: 1,
  },
]
