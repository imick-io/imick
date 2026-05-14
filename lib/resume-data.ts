import { siteConfig } from "./config"
import { experience, type Experience, type Engagement } from "./data/experience"
import { education, type Education } from "./data/education"
import { stack, type StackItem } from "./data/stack"
import { groupStackByCategory, type StackGroup } from "./stack-grouped"

export type ResumeHeader = {
  name: string
  role: string
  email: string
  linkedin: { url: string; display: string }
  github: { url: string; display: string }
  website: string
  location: string
}

export type ResumeEngagement = Omit<Engagement, "summary" | "highlights"> & {
  summary?: string
  highlights?: string[]
}

export type ResumeExperience = Omit<Experience, "engagements"> & {
  engagements?: ResumeEngagement[]
}

export type ResumeData = {
  header: ResumeHeader
  bio: string
  experience: ResumeExperience[]
  education: Education[]
  skills: StackGroup[]
}

function stripCompactFields(engagement: Engagement): ResumeEngagement {
  if (!engagement.compact) return engagement
  const { summary: _summary, highlights: _highlights, ...rest } = engagement
  return rest
}

export function buildResumeData(
  experienceData: Experience[],
  educationData: Education[],
  stackData: StackItem[]
): ResumeData {
  const orderedExperience = experienceData
    .filter((entry) => !entry.linkedinOnly)
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((entry) => ({
      ...entry,
      engagements: entry.engagements
        ? entry.engagements
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(stripCompactFields)
        : undefined,
    }))

  const orderedEducation = educationData
    .slice()
    .sort((a, b) => a.order - b.order)

  return {
    header: {
      name: siteConfig.name,
      role: siteConfig.role,
      email: siteConfig.resumeEmail,
      linkedin: {
        url: siteConfig.resumeLinkedinUrl,
        display: siteConfig.resumeLinkedinDisplay,
      },
      github: {
        url: siteConfig.resumeGithubUrl,
        display: siteConfig.resumeGithubDisplay,
      },
      website: siteConfig.handle,
      location: siteConfig.resumeLocation,
    },
    bio: siteConfig.resumeBio,
    experience: orderedExperience,
    education: orderedEducation,
    skills: groupStackByCategory(stackData),
  }
}

export function getResumeData(): ResumeData {
  return buildResumeData(experience, education, stack)
}
