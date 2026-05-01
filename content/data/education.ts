export type Education = {
  institution: string
  degree: string
  field?: string
  startYear: number
  endYear?: number
  order: number
}

export const education: Education[] = [
  {
    institution: "Your University",
    degree: "Bachelor of Science",
    field: "Computer Science",
    startYear: 2015,
    endYear: 2019,
    order: 1,
  },
]
