export type ResumeChipGroup = {
  label: string
  items: string[]
}

export type ResumeEducation = {
  degree: string
  institution: string
  location: string
  dates: string
}

export type ResumeWorkEntry = {
  role: string
  company: string
  companySuffix?: string
  dates: string
  bullets: string[]
  tech: string[]
}

export type ResumeContent = {
  monogram: string
  name: string
  title: string
  location: string
  contactLinks: { label: string; href: string; kind: "linkedin" | "website" }[]
  chipGroups: ResumeChipGroup[]
  education: ResumeEducation[]
  summary: string
  workExperience: ResumeWorkEntry[]
}

export const resumeContent: ResumeContent = {
  monogram: "MB",
  name: "Michael Boutin",
  title: "Senior Product Engineer & Full-Stack Developer",
  location: "Montreal, QC, Canada",
  contactLinks: [
    {
      label: "i-mick",
      href: "https://www.linkedin.com/in/i-mick/",
      kind: "linkedin",
    },
    { label: "imick.io", href: "https://imick.io", kind: "website" },
  ],
  chipGroups: [
    {
      label: "Languages",
      items: [
        "JavaScript",
        "TypeScript",
        "HTML5",
        "CSS / SCSS",
        "SQL",
        "GraphQL / REST",
      ],
    },
    {
      label: "Frameworks & Libraries",
      items: [
        "Vue 3",
        "Nuxt.js",
        "React",
        "Next.js",
        "NestJS",
        "Express.js",
        "Svelte",
        "SvelteKit",
        "Tailwind CSS",
        "Vuetify",
        "Bootstrap",
        "Three.js",
        "GSAP",
        "Laravel",
        "Redux",
        "Pinia",
        "Jest",
        "Highcharts",
        "Shadcn",
      ],
    },
    {
      label: "Platforms & Tools",
      items: [
        "Claude Code",
        "Codex",
        "Firebase",
        "Vercel",
        "GCP",
        "AWS Amplify",
        "Docker",
        "Clerk",
        "Sanity",
        "Contentful",
        "Algolia",
        "Stripe",
        "Figma",
        "Storybook",
        "Git",
        "GitHub",
        "Jira",
      ],
    },
    {
      label: "Databases",
      items: [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Cloud Firestore",
        "NoSQL",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor's in Business Administration",
      institution: "Laval University",
      location: "Quebec, Canada",
      dates: "2012 – 2015",
    },
    {
      degree: "DCS in Computer Science",
      institution: "Cégep de Sainte-Foy",
      location: "Quebec, Canada",
      dates: "2010 – 2012",
    },
  ],
  summary:
    "Senior product engineer with 9+ years building high-performance web products for Canadian and American enterprises and startups. Verified Toptal expert since 2021, specializing in Next.js, React, TypeScript, and Node.js. Combines an AI-augmented development workflow with rigorous engineering discipline, consistently shipping products built for speed, scalability, and accessibility.",
  workExperience: [
    {
      role: "Front-End Developer",
      company: "ComfyUI",
      companySuffix: "Contract via Concreo",
      dates: "2026 – Present",
      bullets: [
        "Improve and maintain the marketing site for a generative AI infrastructure company focused on node-based UI tools and community-driven AI workflows.",
        "Build and maintain features in ComfyUI's complex, high-performance web application for node-based AI workflows.",
        "Ship responsive, accessible front-end experiences across the marketing and product surfaces.",
      ],
      tech: [
        "Vue 3",
        "Astro",
        "PayloadCMS",
        "TypeScript",
        "CodeRabbit",
        "Tailwind CSS",
        "CustomerIO",
        "Supabase",
        "PostgreSQL",
        "GCP",
      ],
    },
    {
      role: "Full-Stack Developer",
      company: "Afi Expertise",
      companySuffix: "Contract via Concreo",
      dates: "2026",
      bullets: [
        "Architected and rebuilt afiexpertise.com from scratch with Next.js, Sanity, and Tailwind CSS for a bilingual (FR/EN) corporate training company.",
        "Integrated the Administrate training management system to power a 360+ course catalog with faceted filtering by faculty, subject, and certification.",
        "Built in-app course checkout with Stripe, turning the site from a brochure into a transactional platform.",
        "Modernized the CMS by migrating content into Sanity, enabling the content team to self-serve in both languages.",
        "Preserved and improved SEO through the migration while leaving a markedly more maintainable codebase.",
      ],
      tech: [
        "Next.js",
        "React",
        "TypeScript",
        "Sanity",
        "Tailwind CSS",
        "Stripe",
        "Administrate",
        "HubSpot",
      ],
    },
    {
      role: "Senior Frontend Developer",
      company: "TakeUp LLC",
      dates: "2024 – 2026",
      bullets: [
        "Built product UI for an AI-powered pricing platform used to manage room rates for hotels, boutique hotels, and B&Bs.",
        "Developed front-end features with React, Next.js, shadcn/ui, and Server Actions to support complex pricing workflows.",
        "Integrated authenticated product flows using Clerk, including user and organization-based access patterns.",
        "Connected front-end experiences to Python/FastAPI backend services for pricing logic and AI-powered functionality.",
        "Partnered with senior engineers in a high-autonomy team to ship features across the UI and support backend-driven workflows.",
      ],
      tech: ["React", "Next.js", "TypeScript", "Highcharts", "Clerk", "Node.js", "CSS"],
    },
    {
      role: "Full-Stack Developer & Co-Founder",
      company: "Concreo Solutions Inc.",
      dates: "2021 – Present",
      bullets: [
        "Founded Concreo.io to provide businesses with an unparalleled web presence, substantially increasing client engagements and brand reputation.",
        "Oversaw development and deployment of digital solutions, enhancing client satisfaction and business outcomes.",
        "Pioneered strategies ensuring lightning-fast load times, improving bounce rates by 20%.",
        "Architected a high-availability infrastructure achieving 99.95% uptime during peak traffic.",
        "Led a team of experts fostering a culture of innovation, dedication, and client-centric delivery.",
      ],
      tech: [
        "React",
        "Vue",
        "Nuxt.js",
        "Next.js",
        "Svelte",
        "Firebase",
        "Tailwind CSS",
        "PostgreSQL",
        "MySQL",
        "Laravel",
        "AWS Amplify",
        "GCP",
        "Vercel",
      ],
    },
    {
      role: "Full-Stack Developer",
      company: "humanly.io",
      companySuffix: "Fixed-price Contract via Concreo",
      dates: "2024 – 2026",
      bullets: [
        "Built and maintained a multi-page marketing website using Next.js, Sanity, Tailwind CSS, and shadcn/ui.",
        "Implemented reusable UI components improving consistency and speeding up future page updates.",
        "Integrated Sanity CMS so non-technical teammates could update copy and content without code changes.",
        "Delivered polished, animated front-end experiences with an accessibility-first approach.",
      ],
      tech: ["Next.js", "React", "Sanity Studio", "Tailwind CSS", "Shadcn", "Resend"],
    },
    {
      role: "Full-Stack & 3D Developer",
      company: "Wearesky.com",
      companySuffix: "Fixed-price Contract via Concreo",
      dates: "2022 – 2023",
      bullets: [
        "Crafted a 3D-centric user interface using Nuxt.js, Three.js, and GSAP, setting the website apart in its niche.",
        "Built responsive 3D designs that rendered flawlessly across diverse screen sizes, increasing mobile interactions.",
        "Constructed a library of reusable Vue components tailored for 3D applications, streamlining future development.",
      ],
      tech: ["Vue 3", "Nuxt.js", "Three.js", "GSAP", "Tailwind CSS", "Contentful", "Google Analytics 4"],
    },
    {
      role: "Front-End Developer",
      company: "Teamable",
      companySuffix: "Fixed-price Contract via Concreo",
      dates: "2022",
      bullets: [
        "Developed and launched a streamlined user interface using Next.js, enhancing UX and site performance.",
        "Designed intuitive web pages with Tailwind CSS, resulting in a 20% increase in user engagement.",
        "Enhanced accessibility ensuring WCAG compliance and optimized codebase for a 15% performance improvement.",
      ],
      tech: ["Next.js", "React", "Tailwind CSS", "NestJS", "Google Analytics 4"],
    },
    {
      role: "Front-End Developer",
      company: "Grics",
      companySuffix: "Fixed-price Contract via Concreo",
      dates: "2021 – 2022",
      bullets: [
        "Crafted a comprehensive suite of reusable components for an internal admin dashboard, ensuring UI consistency.",
        "Authored automated tests with Jest and documented components within Storybook for developers and stakeholders.",
      ],
      tech: ["Vue 3", "Nuxt.js", "Vuetify", "Jest", "Storybook", "Azure DevOps"],
    },
    {
      role: "Full-Stack Developer",
      company: "TakeIn",
      companySuffix: "Fixed-price Contract via Concreo",
      dates: "2020 – 2021",
      bullets: [
        "Developed a robust, scalable back end handling simultaneous food orders and integrated secure Stripe payment gateways.",
        "Refactored substantial portions of the codebase, enhancing system performance and maintainability.",
        "Navigated complex NoSQL database architecture managing users and orders at scale.",
      ],
      tech: ["Nuxt.js", "Vue", "Firebase", "Stripe", "Node.js", "TypeScript", "Docker"],
    },
    {
      role: "Product Manager & Front-End Developer",
      company: "Zum (Zumrails.com)",
      dates: "2019 – 2020",
      bullets: [
        "Contributed to defining the product roadmap based on company strategy, market research, and analytic data.",
        "Built the front end and interfaces, defining and implementing metrics related to the product strategy.",
        "Collected and analyzed qualitative and quantitative customer feedback to drive decisions.",
      ],
      tech: ["Vue 3", "Nuxt.js", "Tailwind CSS", "Figma", "i18n"],
    },
    {
      role: "Product Manager",
      company: "Flinks",
      dates: "2019",
      bullets: [
        "Defined the product vision, roadmap, and growth opportunities; led planning of product release plans.",
        "Managed the product features backlog, iteration planning, and user story elaboration.",
      ],
      tech: ["Aha!", "Figma", "Research", "Bootstrap"],
    },
    {
      role: "Business Intelligence Analyst",
      company: "CGI",
      dates: "2017 – 2019",
      bullets: [
        "Identified business needs and developed reporting dashboards in Tableau and Power BI.",
        "Developed scenarios and sensitivity models to recommend options for strategic initiatives and predict financial outcomes.",
      ],
      tech: ["Tableau", "Power BI", "Microsoft Dynamics CRM", "SQL"],
    },
  ],
}
