// Experience data, populated during /grill-me bio interview.
//
// Structure decisions (locked):
// - Concreo is a top-level employer entry. Takeup is promoted to a top-level
//   sibling with `via: { name: "Concreo" }` because its weight (senior full-stack)
//   deserves visual parity with Zumrails/Flinks/CGI rather than burial as a
//   Concreo engagement.
// - Humanly and Teamable remain nested under Concreo with full descriptions
//   (logos do reputation work).
// - Wearesky, Takein, Grics remain nested under Concreo as compact entries
//   (renderer surfaces name + role + summary + tech only; highlights array
//   kept for export but hidden on imick.io).
// - CGI is a full entry. IG Wealth Management and SMB Accountant are
//   intentionally omitted from this file.
// - Toptal Top 3% mentioned in Concreo's description.
// - Verb-framing rewrite applied to all entries.
// - Concreo startDate aligned with Takein startDate (Takein was the first
//   engagement that became Concreo client work; formal incorporation date
//   intentionally aligned to that point).

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
  /** Optional company outcome label (e.g. acquisition or raise). Rendered as a small badge. */
  outcome?: string
  /** When true, the renderer surfaces only name + role + summary + tech. The highlights array is kept for export but hidden on imick.io. */
  compact?: boolean
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
  /** Contractual wrapper for engagements that flowed through a parent agency (e.g. Takeup via Concreo). */
  via?: { name: string; role?: string; url?: string }
  /** Optional company outcome label (e.g. acquisition or raise). Rendered as a small badge. */
  outcome?: string
  /** When true, entry is kept in the data file for record but excluded from imick.io render. Surface only on LinkedIn. */
  linkedinOnly?: boolean
  order: number
}

export const experience: Experience[] = [
  {
    company: "Concreo",
    role: "Founder & Senior Product Engineer",
    startDate: "2020-08",
    current: true,
    location: "Remote, Canada & USA",
    description:
      "Independent agency delivering senior product, design, and engineering on AI-native products. Member of the Toptal Top 3% network.",
    highlights: [
      "Lead AI product engagements end-to-end for selected clients: design, frontend, backend, and the production craft around AI features.",
      "Ship full-stack products in Next.js, React, and Server Actions, integrating Python and FastAPI services and AI APIs.",
      "Run product ownership and hands-on engineering on every engagement, not one or the other.",
    ],
    engagements: [
      {
        name: "Humanly",
        role: "Full-Stack Developer",
        startDate: "2024-06",
        current: true,
        summary:
          "Built and maintained Humanly's multi-page marketing website with a CMS-driven content pipeline.",
        highlights: [
          "Built a reusable component layer in Next.js and shadcn/ui that shortened time-to-feature on later pages.",
          "Wired Sanity content modeling so non-technical teammates ship copy edits without engineering.",
          "Shipped animated, responsive experiences with WCAG accessibility on desktop, tablet, and mobile.",
        ],
        tech: ["Next.js", "Sanity", "Tailwind CSS", "shadcn/ui", "GitHub"],
        order: 1,
      },
      {
        name: "Teamable",
        role: "Front-End Developer",
        startDate: "2022-11",
        endDate: "2024-05",
        summary:
          "Designed and shipped Teamable.com's UI in Next.js and React, optimizing for performance, accessibility, and component reuse.",
        highlights: [
          "Built a reusable React component library that shortened time-to-feature on later pages.",
          "Deployed and maintained the platform on Vercel.",
          "Shipped responsive, WCAG-accessible UI across desktop, tablet, and mobile.",
        ],
        tech: ["Next.js", "React", "Vercel", "Tailwind CSS", "GitHub"],
        outcome: "Acquired by Humanly (2024)",
        order: 2,
      },
      {
        name: "Wearesky",
        role: "Full-Stack & 3D Developer",
        startDate: "2022-07",
        endDate: "2024-04",
        summary:
          "Designed and built a 3D-centric web experience as the brand's primary visual differentiator.",
        highlights: [
          "Optimized loading for heavy 3D assets and deployed on Vercel.",
          "Built a reusable Vue component library for 3D-driven, responsive layouts.",
        ],
        tech: ["Nuxt.js", "Vue", "Tailwind CSS", "Vercel", "Three.js", "GitHub"],
        compact: true,
        order: 3,
      },
      {
        name: "Grics",
        role: "Front-End Developer",
        startDate: "2021-08" /* TODO confirm */,
        endDate: "2022-02" /* TODO confirm */,
        summary:
          "Built a reusable component suite for an internal admin dashboard, with Storybook documentation and Jest test coverage.",
        highlights: [
          "Built a reusable component suite with Storybook docs that became the team's component reference.",
          "Wrote Jest test suites that hardened component-level QA.",
        ],
        tech: ["React", "Storybook", "Jest", "Microsoft Azure DevOps"],
        compact: true,
        order: 4,
      },
      {
        name: "Takein",
        role: "Full-Stack Developer",
        startDate: "2020-08",
        endDate: "2021-06",
        summary:
          "Refactored core portions of Takein's codebase and built backend handling for concurrent order processing.",
        highlights: [
          "Refactored core code paths in user and order systems for performance and maintainability.",
          "Built data-model handling for concurrent user and order state.",
          "Built backend handling for high-concurrency food orders, including payment gateway integration.",
          "Shipped customer-facing ordering flows.",
        ],
        tech: ["Next.js", "Firebase", "Docker", "GitHub"],
        compact: true,
        order: 5,
      },
    ],
    order: 1,
  },
  {
    company: "ComfyUI",
    role: "Front-End Developer",
    startDate: "2026-05",
    current: true,
    location: "San Francisco Bay Area · Remote",
    description:
      "Generative AI infrastructure company building node-based UI tools and community-driven AI workflows.",
    highlights: [
      "Improve and maintain the marketing site, keeping the public face of the product fast, polished, and current.",
      "Build and maintain features in ComfyUI's complex, high-performance web application for node-based AI workflows.",
    ],
    via: { name: "Concreo" },
    order: 2,
  },
  {
    company: "Takeup",
    role: "Senior Full-Stack Engineer",
    startDate: "2024-12",
    endDate: "2026-05",
    location: "Remote",
    description:
      "Shipped product UI for an AI-powered pricing platform managing live room rates for hotels, boutique hotels, and B&Bs.",
    highlights: [
      "Built pricing workflows in Next.js, React, shadcn/ui, and Server Actions, designing how operators preview, edit, and approve AI-driven rate recommendations.",
      "Wired org-based authentication with Clerk for multi-property access patterns.",
      "Connected front-end flows to Python and FastAPI services running pricing logic and AI inference, owning the latency and error-handling story across the boundary.",
      "Owned UI features end-to-end inside a high-autonomy senior-eng team, from product spec to production.",
    ],
    via: { name: "Concreo" },
    order: 3,
  },
  {
    company: "Zumrails",
    role: "Product Owner & Front-End Developer",
    startDate: "2020-01",
    endDate: "2021-05",
    location: "Montreal, Canada",
    description:
      "Drove product strategy and shipped front-end interfaces for Zumrails' fintech platform.",
    highlights: [
      "Owned the product roadmap, metrics, and customer feedback loop for Zumrails' fintech platform.",
      "Prioritized roadmap across competing initiatives based on customer and growth signals.",
      "Shipped features from requirement to release, partnering directly with engineering and stakeholders.",
      "Built the application's front-end interfaces myself, working as both PO and IC.",
    ],
    outcome: "Raised Series A at $100M+ valuation (February 2024)",
    order: 4,
  },
  {
    company: "Flinks",
    role: "Product Owner",
    startDate: "2019-03",
    endDate: "2019-11",
    location: "Montreal, Canada",
    description:
      "Owned the PLG initiative and the Wealth Data product expanding Flinks' coverage from banking to wealth accounts. Led a team of 1 to 5.",
    highlights: [
      "Owned the PLG (Product-Led Growth) initiative, setting metrics, instrumentation, and roadmap to drive self-serve adoption.",
      "Owned the Wealth Data product, expanding Flinks' data coverage from banking to investment and wealth accounts.",
      "Drove roadmap, prioritization, and release planning across both initiatives, aligning stakeholders end to end.",
      "Managed a team of 1 to 5, unblocking delivery and writing user stories alongside the engineers.",
    ],
    outcome: "Acquired by National Bank of Canada, $100M (2021)",
    order: 5,
  },
  {
    company: "CGI",
    role: "Business Intelligence Consultant",
    startDate: "2017-06",
    endDate: "2019-03",
    location: "Montreal, Canada",
    description:
      "Joined as a Business Analyst, moved into Business Intelligence work for enterprise clients including a major Canadian bank.",
    highlights: [
      "Built reporting and forecasting surfaces in Tableau and Power BI for enterprise clients, including a major Canadian bank.",
      "Designed scenario and sensitivity models to predict financial outcomes and pressure-test strategic initiatives.",
      "Built management dashboards that became the source of truth for executive KPI monitoring.",
      "Translated ambiguous business questions into rigorous analytic frameworks under tight timelines.",
    ],
    order: 6,
  },
]
