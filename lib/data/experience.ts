// Experience data — populated during /grill-me bio interview.
//
// Structure decisions (locked):
// - Q5a: Hierarchical. Concreo is the top-level employer; Toptal/Concreo client work is nested as engagements.
// - Q5b: CGI is a full entry. IG Wealth Management and SMB Accountant are linkedinOnly (kept for record, not rendered on imick.io).
// - Q5c: Toptal Top 3% mentioned as a footnote in Concreo's description.
// - Q5d: Verb-framing rewrite applied to all entries.
// - Q5e: Dates pending — every YYYY-MM marked /* TODO confirm */ still needs the real date pasted from LinkedIn.

export type Engagement = {
  name: string
  role: string
  startDate: string
  endDate?: string
  current?: boolean
  summary: string
  highlights: string[]
  tech?: string[]
  url?: string
  order: number
}

export type Experience = {
  company: string
  role: string
  startDate: string
  endDate?: string
  current?: boolean
  location?: string
  description: string
  highlights: string[]
  /** Nested client engagements rendered under this employer (used by Concreo). */
  engagements?: Engagement[]
  /** When true, entry is kept in the data file for record but excluded from imick.io render. Surface only on LinkedIn. */
  linkedinOnly?: boolean
  order: number
}

export const experience: Experience[] = [
  {
    company: "Concreo",
    role: "Founder, AI Product Engineer",
    startDate: "YYYY-MM" /* TODO confirm */,
    current: true,
    location: "Remote, Canada & USA",
    description:
      "Independent agency delivering senior product, design, and engineering on AI-native products. Member of the Toptal Top 3% network.",
    highlights: [
      "Lead AI product engagements end-to-end for selected clients across the full surface: design, frontend, backend integration, and the production craft around AI features.",
      "Design and ship full-stack products in Next.js, React, Server Actions, and shadcn/ui, integrating Python and FastAPI services and AI APIs.",
      "Combine product ownership (roadmap, metrics, stakeholder alignment) with hands-on engineering (architecture, observability, eval design) on every engagement.",
    ],
    engagements: [
      {
        name: "Takeup",
        role: "AI Product Engineer",
        startDate: "YYYY-MM" /* TODO confirm */,
        endDate: "2026-05",
        summary:
          "Shipped product UI for an AI-powered pricing platform managing live room rates for hotels, boutique hotels, and B&Bs.",
        highlights: [
          "Built complex pricing workflows in Next.js, React, shadcn/ui, and Server Actions, designing how operators preview, edit, and approve AI-driven rate recommendations.",
          "Integrated org-based authentication with Clerk for multi-property access patterns across the app.",
          "Connected front-end flows to Python and FastAPI services running pricing logic and AI inference, owning the latency and error-handling story across the boundary.",
          "Operated in a high-autonomy team alongside senior engineers, owning UI features end-to-end from product spec to production.",
        ],
        tech: [
          "React",
          "Next.js",
          "shadcn/ui",
          "Server Actions",
          "Clerk",
          "Python",
          "FastAPI",
          "PostHog",
          "Claude Code",
          "Vercel",
          "GitHub",
        ],
        order: 1,
      },
      {
        name: "Humanly",
        role: "Full-Stack Developer",
        startDate: "YYYY-MM" /* TODO confirm */,
        endDate: "YYYY-MM" /* TODO confirm */,
        summary:
          "Built and maintained Humanly's multi-page marketing website with a CMS-driven content pipeline.",
        highlights: [
          "Built and maintained Humanly's marketing site in Next.js, Sanity, Tailwind, and shadcn/ui.",
          "Established a reusable component layer that accelerated downstream page work and kept design consistent across breakpoints.",
          "Integrated Sanity content modeling so non-technical teammates ship copy and content edits without engineering involvement.",
          "Shipped polished animated experiences with WCAG-aligned accessibility preserved across desktop, tablet, and mobile.",
        ],
        tech: ["Next.js", "Sanity", "Tailwind CSS", "shadcn/ui", "GitHub"],
        order: 2,
      },
      {
        name: "Teamable",
        role: "Front-End Developer",
        startDate: "YYYY-MM" /* TODO confirm */,
        endDate: "YYYY-MM" /* TODO confirm */,
        summary:
          "Designed and shipped Teamable.com's user interface in Next.js and React, focused on performance, accessibility, and design system reuse.",
        highlights: [
          "Designed and shipped Teamable.com's user interface in Next.js and React, with Tailwind for the visual system.",
          "Established a reusable React component library that reduced time-to-feature on subsequent work.",
          "Deployed and maintained the platform on Vercel with attention to load times and reliability.",
          "Implemented responsive design and WCAG-aligned accessibility across desktop, tablet, and mobile.",
        ],
        tech: ["Next.js", "React", "Vercel", "Tailwind CSS", "GitHub"],
        order: 3,
      },
      {
        name: "Wearesky",
        role: "Full-Stack & 3D Developer",
        startDate: "YYYY-MM" /* TODO confirm */,
        endDate: "YYYY-MM" /* TODO confirm */,
        summary:
          "Designed and built a 3D-centric web experience as the brand's primary visual differentiator.",
        highlights: [
          "Designed and built a 3D-centric web experience using Nuxt.js, Vue, and Three.js, with the 3D treatment as the brand differentiator.",
          "Engineered the site for fast load on 3D assets and deployed on Vercel.",
          "Shipped a reusable Vue component library tailored for 3D-driven layouts and responsive 3D rendering.",
        ],
        tech: ["Nuxt.js", "Vue", "Tailwind CSS", "Vercel", "Three.js", "GitHub"],
        order: 4,
      },
      {
        name: "Takein",
        role: "Full-Stack Developer",
        startDate: "YYYY-MM" /* TODO confirm */,
        endDate: "YYYY-MM" /* TODO confirm */,
        summary:
          "Refactored core portions of Takein's codebase and built backend handling for concurrent order processing.",
        highlights: [
          "Refactored core portions of the codebase to improve performance and maintainability across user and order systems.",
          "Worked across the data model managing concurrent user and order state.",
          "Built backend handling for high-concurrency food orders and integrated payment gateways for secure transactions.",
          "Shipped front-end flows for the customer-facing ordering experience.",
        ],
        tech: ["Next.js", "Firebase", "Docker", "GitHub"],
        order: 5,
      },
      {
        name: "Grics",
        role: "Front-End Developer",
        startDate: "YYYY-MM" /* TODO confirm */,
        endDate: "YYYY-MM" /* TODO confirm */,
        summary:
          "Built a reusable component suite for an internal admin dashboard, with Storybook documentation and Jest test coverage.",
        highlights: [
          "Built a reusable component suite for an internal admin dashboard, with Storybook documentation that became the team's component reference.",
          "Wrote Jest test suites covering component behavior, hardening the dashboard's QA process.",
        ],
        tech: ["React", "Storybook", "Jest", "Microsoft Azure DevOps"],
        order: 6,
      },
    ],
    order: 1,
  },
  {
    company: "Zumrails",
    role: "Product Owner & Front-End Developer",
    startDate: "YYYY-MM" /* TODO confirm */,
    endDate: "YYYY-MM" /* TODO confirm */,
    location: "Montreal, Canada" /* TODO confirm */,
    description:
      "Drove product strategy and shipped front-end interfaces for Zumrails' fintech platform.",
    highlights: [
      "Owned product roadmap, metrics, and customer-feedback loops for the Zumrails fintech platform.",
      "Identified strategic opportunities and prioritized roadmap across competing initiatives.",
      "Translated requirements into shipped features by partnering directly with engineering and stakeholders.",
      "Built the application's front-end interfaces, bridging product ownership and IC delivery.",
    ],
    order: 2,
  },
  {
    company: "Flinks",
    role: "Product Owner",
    startDate: "YYYY-MM" /* TODO confirm */,
    endDate: "YYYY-MM" /* TODO confirm */,
    location: "Montreal, Canada" /* TODO confirm */,
    description:
      "Owned the PLG initiative and the Wealth Data product expanding Flinks' coverage from banking to wealth accounts. Led a team of 1 to 5.",
    highlights: [
      "Owned the PLG (Product-Led Growth) initiative, setting metrics, instrumentation, and roadmap to drive self-serve adoption.",
      "Owned the Wealth Data product, expanding Flinks' data coverage from banking to investment and wealth accounts for fintech consumers.",
      "Led roadmap, prioritization, release planning, and stakeholder alignment for both initiatives.",
      "Managed a team of 1 to 5, removing impediments and elaborating user stories for delivery.",
    ],
    order: 3,
  },
  {
    company: "CGI",
    role: "Business Intelligence Consultant",
    startDate: "YYYY-MM" /* TODO confirm */,
    endDate: "YYYY-MM" /* TODO confirm */,
    location: "Montreal, Canada",
    description:
      "Joined as a Business Analyst, moved into Business Intelligence work for enterprise clients including a major Canadian bank.",
    highlights: [
      "Built reporting and forecasting surfaces in Tableau and Power BI for enterprise clients, including a major Canadian bank.",
      "Designed scenario and sensitivity models to inform strategic initiatives and predict financial outcomes.",
      "Established management dashboards that became the source of truth for executive KPI monitoring.",
      "Translated ambiguous business questions into rigorous analytic frameworks, often on tight timelines.",
    ],
    order: 4,
  },
  // Below: kept for record, excluded from imick.io render. Surface only on LinkedIn.
  {
    company: "IG Wealth Management",
    role: "Financial Advisor",
    startDate: "YYYY-MM" /* TODO confirm */,
    endDate: "YYYY-MM" /* TODO confirm */,
    location: "Quebec, Canada" /* TODO confirm */,
    description: "Advised individual clients on wealth management strategy.",
    highlights: [],
    linkedinOnly: true,
    order: 5,
  },
  {
    company: "Local SMB",
    role: "Accountant",
    startDate: "YYYY-MM" /* TODO confirm */,
    endDate: "YYYY-MM" /* TODO confirm */,
    location: "Quebec, Canada" /* TODO confirm */,
    description: "Accounting work for a small and medium business.",
    highlights: [],
    linkedinOnly: true,
    order: 6,
  },
]
