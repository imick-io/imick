// Education data — populated during /grill-me bio interview (Q7).
//
// Decisions (locked):
// - Single entry: BBA Finance at Université Laval, 2012–2015.
// - No additional certifications, online courses, or conference credentials surfaced. Articles + courses on imick.io's /learn carry the continuous-learning signal instead.
// - Page position: stays after Experience and before Open Source as currently rendered in app/about/page.tsx.

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
    institution: "Université Laval",
    degree: "Bachelor of Business Administration",
    field: "Finance",
    startYear: 2012,
    endYear: 2015,
    order: 1,
  },
]
