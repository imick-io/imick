// Experience data, populated during /grill-me bio interview.
//
// Structure decisions (locked):
// - Concreo is a top-level employer entry. ComfyUI and Takeup are top-level
//   siblings with `via: { name: "Toptal" }` because they were sourced through
//   Toptal (not Concreo clients) and their weight deserves visual parity with
//   Zumrails/Flinks/CGI rather than burial as a Concreo engagement.
// - Humanly and Teamable remain nested under Concreo with full descriptions
//   (logos do reputation work).
// - Wearesky, Takein, Grics remain nested under Concreo as compact entries
//   (renderer surfaces name + role + summary + tech only; highlights array
//   kept for export but hidden on imick.io).
// - CGI is a full entry. IG Wealth Management and SMB Accountant are
//   intentionally omitted from this file.
// - Toptal membership (network member since 2021) mentioned in Concreo's
//   description; Toptal is the sourcing channel for ComfyUI and Takeup,
//   Concreo the delivery vehicle for direct clients.
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
      "My independent consultancy: I source clients directly and deliver senior product, design, and engineering on AI-native products under the Concreo banner. Separately, a Toptal network member since 2021, through which the Toptal-sourced engagements below flow.",
    highlights: [
      "Lead AI product engagements end-to-end for selected clients: design, frontend, backend, and the production craft around AI features.",
      "Ship full-stack products in Next.js, React, and Server Actions, integrating Python and FastAPI services and AI APIs.",
      "Run product ownership and hands-on engineering on every engagement, not one or the other.",
    ],
    engagements: [
      {
        name: "Afi Expertise",
        role: "Senior Full-Stack Engineer",
        startDate: "2026",
        endDate: "2026",
        summary:
          "Architected and rebuilt afiexpertise.com from scratch as a bilingual (FR/EN) training platform with a 360+ course catalog and in-app checkout.",
        highlights: [
          "Rebuilt the site end to end in Next.js, Sanity, and Tailwind CSS, replacing the legacy platform.",
          "Integrated the Administrate training management system to power the 360+ course catalog with faceted filtering by faculty, subject, and certification.",
          "Built in-app course checkout with Stripe, turning the site from a brochure into a transactional platform.",
          "Migrated content into Sanity so the content team self-serves in both languages.",
          "Preserved and improved SEO through the migration while leaving a markedly more maintainable codebase.",
        ],
        tech: ["Next.js", "Sanity", "Tailwind CSS", "Stripe", "Administrate", "HubSpot"],
        url: "https://www.afiexpertise.com/en",
        order: 1,
      },
      {
        name: "Humanly",
        role: "Senior Full-Stack Engineer",
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
        order: 2,
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
        order: 3,
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
        order: 4,
      },
      {
        name: "Grics",
        role: "Front-End Developer",
        startDate: "2021",
        endDate: "2022",
        summary:
          "Built a reusable component suite for an internal admin dashboard, with Storybook documentation and Jest test coverage.",
        highlights: [
          "Built a reusable component suite with Storybook docs that became the team's component reference.",
          "Wrote Jest test suites that hardened component-level QA.",
        ],
        tech: ["Vue 3", "Nuxt.js", "Vuetify", "Storybook", "Jest", "Microsoft Azure DevOps"],
        compact: true,
        order: 5,
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
        tech: ["Nuxt.js", "Vue", "Firebase", "Stripe", "Docker", "GitHub"],
        compact: true,
        order: 6,
      },
    ],
    order: 1,
  },
  {
    company: "ComfyUI",
    role: "Senior Front-End Engineer",
    startDate: "2026-05",
    endDate: "2026-09",
    location: "San Francisco Bay Area · Remote",
    description:
      "San Francisco startup behind the leading open-source platform for node-based generative AI, backed by $48M in venture funding at a $500M valuation, with 4M+ users worldwide.",
    via: { name: "Toptal", url: "https://www.toptal.com" },
    highlights: [
      "Designed a Claude Code chat workflow for page creation: anyone on the team creates a production page through chat alone, no code and no UI, with Vercel preview URLs and an approval workflow gating the merge to production.",
      "Integrated PayloadCMS as the structural backbone of that workflow: chat-created pages assemble existing, structured content blocks instead of generating one-off code, keeping the site's architecture consistent and letting marketing update pages without engineering.",
      "Built and maintained features in ComfyUI's complex, high-performance web application, a platform with 150K+ daily downloads and 60K+ community-built nodes.",
    ],
    order: 2,
  },
  {
    company: "Takeup",
    role: "Senior Full-Stack Developer & Product Manager",
    startDate: "2024-12",
    endDate: "2026-05",
    location: "Remote",
    description:
      "Shipped product UI for an AI-powered pricing platform managing live room rates for hotels, boutique hotels, and B&Bs.",
    highlights: [
      "Rebuilt the web application from the ground up, migrating a live product with a paying customer base from Bubble.io to Next.js with zero downtime.",
      "Built pricing workflows in Next.js, React, shadcn/ui, and Server Actions, designing how operators preview, edit, and approve AI-driven rate recommendations.",
      "Wired org-based authentication with Clerk for multi-property access patterns.",
      "Connected front-end flows to Python and FastAPI services running pricing logic and AI inference, owning the latency and error-handling story across the boundary.",
      "Sole developer of the web application, acting as de facto product manager: decided which features to build, owned the architecture, and shipped from spec to production.",
    ],
    via: { name: "Toptal", url: "https://www.toptal.com" },
    order: 3,
  },
  {
    company: "Zumrails",
    role: "Product Owner & Front-End Developer",
    startDate: "2020-01",
    endDate: "2021-05",
    location: "Montreal, Canada",
    description:
      "Joined Zumrails at its founding stage, shaping the initial product definition for its fintech payments platform.",
    highlights: [
      "Shaped the initial product mockups that defined what the platform would become.",
      "Drafted the initial marketing proposal alongside the founding team.",
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
      "Owned the PLG initiative and the Wealth Data product expanding Flinks' coverage from banking to wealth accounts.",
    highlights: [
      "Built the PLG (Product-Led Growth) initiative: a platform letting customers self-onboard and start using the product without talking to a sales rep.",
      "Owned the Wealth Data product, expanding Flinks' data coverage from banking to investment and wealth accounts.",
      "Drove roadmap, prioritization, and release planning across both initiatives, aligning stakeholders end to end.",
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
