import { z } from "zod"

export const intentionOptions = [
  { value: "hiring", label: "Hiring" },
  { value: "freelance", label: "Freelance or Contract" },
  { value: "collaboration", label: "Collaboration" },
  { value: "curious", label: "Just curious" },
] as const

export const intentionValues = intentionOptions.map((o) => o.value) as [
  (typeof intentionOptions)[number]["value"],
  ...(typeof intentionOptions)[number]["value"][],
]

export const resumeGateSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.email("Enter a valid email"),
  company: z.string().trim().min(1, "Company is required"),
  linkedin: z
    .union([z.literal(""), z.url("Enter a valid URL")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  intention: z.enum(intentionValues, { error: "Select an option" }),
})

export type ResumeGateInput = z.infer<typeof resumeGateSchema>
