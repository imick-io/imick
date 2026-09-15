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

export type ResumeLocale = "en" | "fr"

/** UI strings around the resume content (section titles, buttons). */
export type ResumeLabels = {
  summary: string
  workExperience: string
  education: string
  tech: string
  downloadPdf: string
  documentTitle: string
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
  title: "Senior Full-Stack Developer & Product Manager",
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
      label: "Core Stack",
      items: [
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "Tailwind CSS",
        "Vue 3",
        "Nuxt.js",
      ],
    },
    {
      label: "Supporting",
      items: [
        "Three.js",
        "GSAP",
        "Sanity",
        "Stripe",
        "PostgreSQL",
        "Firebase",
        "Vercel",
        "Claude Code",
      ],
    },
    {
      label: "Languages",
      items: ["English", "French"],
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
    "Senior full-stack developer and product manager with 9+ years across AI, fintech, and SaaS, shipping high-performance web products for North American startups and enterprises, most recently ComfyUI, the $500M-valuation open-source generative AI platform. Specializes in Next.js, React, TypeScript, and Node.js, pairing an AI-augmented development workflow with rigorous engineering discipline and a product management background. Bilingual, English and French.",
  workExperience: [
    {
      role: "Senior Front-End Developer",
      company: "ComfyUI",
      companySuffix: "Contract via Toptal",
      dates: "2026",
      bullets: [
        "Designed a Claude Code chat workflow for Comfy Org, the $500M-valuation San Francisco startup behind ComfyUI: anyone on the team creates a production page through chat alone, no code and no UI, with Vercel preview URLs and an approval workflow gating the merge to production.",
        "Integrated PayloadCMS as the structural backbone of that workflow: chat-created pages assemble existing, structured content blocks instead of generating one-off code, keeping the site's architecture consistent and letting marketing update pages without engineering.",
        "Built and maintained features in ComfyUI's complex, high-performance web application, a platform with 4M+ users, 150K+ daily downloads, and an ecosystem of 60K+ community-built nodes.",
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
      role: "Senior Full-Stack Developer",
      company: "Afi Expertise",
      companySuffix: "Client of Concreo",
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
      role: "Senior Full-Stack Developer & Product Manager",
      company: "TakeUp",
      companySuffix: "Contract via Toptal",
      dates: "2024 – 2026",
      bullets: [
        "Rebuilt the web application from the ground up, migrating a live product with a paying customer base from Bubble.io to Next.js with zero downtime.",
        "Sole developer of the web application over the 18-month engagement, acting as de facto product manager: decided which features to build, owned the architecture, and shipped from spec to production on an AI pricing platform managing live room rates for hotels, boutique hotels, and B&Bs.",
        "Designed and built the pricing workflows operators use to preview, edit, and approve AI-driven rate recommendations, in Next.js, React, shadcn/ui, and Server Actions.",
        "Connected the front end to Python and FastAPI services running pricing logic and AI inference, owning the latency and error-handling story across the boundary.",
        "Wired organization-based authentication with Clerk for multi-property access patterns.",
      ],
      tech: ["React", "Next.js", "TypeScript", "Highcharts", "Clerk", "Node.js", "CSS"],
    },
    {
      role: "Founder & Senior Product Manager",
      company: "Concreo Solutions Inc.",
      dates: "2020 – Present",
      bullets: [
        "Founded and run a product engineering consultancy, delivering six client engagements (marked \"Client of Concreo\" below) end to end across ed-tech, HR-tech, food delivery, and creative industries, from scoping and architecture through production launch and post-launch support.",
        "Shipped every engagement to production with a maintainable handoff; two clients converted to ongoing retainers, and clients repeatedly extend engagements or return with new projects.",
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
      role: "Senior Full-Stack Developer",
      company: "Humanly",
      companySuffix: "Client of Concreo",
      dates: "2024 – Present",
      bullets: [
        "Own the marketing website of Humanly, an AI hiring platform, end to end; engaged directly after Humanly acquired Teamable, a previous client.",
        "Built the multi-page site in Next.js, Sanity, Tailwind CSS, and shadcn/ui, with a reusable component layer that shortened time-to-feature and a content model non-technical teammates ship with, no engineering required.",
        "Delivered polished, animated, WCAG-accessible experiences across desktop, tablet, and mobile.",
      ],
      tech: ["Next.js", "React", "Sanity Studio", "Tailwind CSS", "Shadcn", "Resend"],
    },
    {
      role: "Full-Stack & 3D Developer",
      company: "Wearesky",
      companySuffix: "Client of Concreo",
      dates: "2022 – 2024",
      bullets: [
        "Designed and built a 3D-centric web experience with Nuxt.js, Three.js, and GSAP that became the brand's primary visual differentiator.",
        "Optimized heavy 3D assets to render smoothly across devices, increasing mobile interactions, and built a reusable Vue component library for 3D-driven layouts.",
      ],
      tech: ["Vue 3", "Nuxt.js", "Three.js", "GSAP", "Tailwind CSS", "Contentful", "Google Analytics 4"],
    },
    {
      role: "Front-End Developer",
      company: "Teamable",
      companySuffix: "Client of Concreo",
      dates: "2022 – 2024",
      bullets: [
        "Designed and shipped Teamable.com's UI in Next.js and Tailwind CSS for the venture-backed, San Francisco-based hiring platform, with WCAG-compliant accessibility and responsive performance.",
        "Teamable was acquired by Humanly in 2024, which then engaged me directly for its own site.",
      ],
      tech: ["Next.js", "React", "Tailwind CSS", "Google Analytics 4"],
    },
    {
      role: "Front-End Developer",
      company: "Grics",
      companySuffix: "Client of Concreo",
      dates: "2021 – 2022",
      bullets: [
        "Built the reusable component suite for an internal admin dashboard that became the team's component reference.",
        "Hardened quality with Jest test suites and Storybook documentation used by developers and stakeholders alike.",
      ],
      tech: ["Vue 3", "Nuxt.js", "Vuetify", "Jest", "Storybook", "Azure DevOps"],
    },
    {
      role: "Full-Stack Developer",
      company: "TakeIn",
      companySuffix: "Client of Concreo",
      dates: "2020 – 2021",
      bullets: [
        "Built the back end handling concurrent food orders at scale, including secure Stripe payment integration.",
        "Refactored core user and order code paths, measurably improving performance and maintainability.",
      ],
      tech: ["Nuxt.js", "Vue", "Firebase", "Stripe", "Node.js", "TypeScript", "Docker"],
    },
    {
      role: "Product Owner & Front-End Developer",
      company: "Zumrails",
      dates: "2020 – 2021",
      bullets: [
        "Joined Zumrails at its founding stage, shaping the initial product mockups and marketing proposal that defined its fintech payments platform.",
        "Zumrails went on to raise a Series A at a $100M+ valuation (2024).",
      ],
      tech: ["Vue 3", "Nuxt.js", "Tailwind CSS", "Figma", "i18n"],
    },
    {
      role: "Product Owner",
      company: "Flinks",
      dates: "2019",
      bullets: [
        "Owned the Wealth Data product, expanding Flinks' data coverage from banking to investment and wealth accounts, and built the product-led growth initiative: a platform letting customers self-onboard without talking to a sales rep.",
        "Drove product vision, roadmap, release planning, and user story elaboration across both initiatives.",
        "Flinks was acquired by National Bank of Canada for $100M (2021).",
      ],
      tech: ["Aha!", "Figma", "Research", "Bootstrap"],
    },
    {
      role: "Business Intelligence Consultant",
      company: "CGI",
      dates: "2017 – 2019",
      bullets: [
        "Built reporting and forecasting dashboards in Tableau and Power BI for enterprise clients, including a major Canadian bank, that became the source of truth for executive KPI monitoring.",
        "Designed scenario and sensitivity models to predict financial outcomes and pressure-test strategic initiatives.",
      ],
      tech: ["Tableau", "Power BI", "Microsoft Dynamics CRM", "SQL"],
    },
  ],
}

// French edition. Content mirrors resumeContent entry for entry; company and
// technology names stay untranslated. Uses noun-phrase bullet style, standard
// in French-language resumes.
export const resumeContentFr: ResumeContent = {
  monogram: "MB",
  name: "Michael Boutin",
  title: "Développeur full-stack senior et gestionnaire de produit",
  location: "Montréal, QC, Canada",
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
      label: "Technologies principales",
      items: [
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "Tailwind CSS",
        "Vue 3",
        "Nuxt.js",
      ],
    },
    {
      label: "Complémentaires",
      items: [
        "Three.js",
        "GSAP",
        "Sanity",
        "Stripe",
        "PostgreSQL",
        "Firebase",
        "Vercel",
        "Claude Code",
      ],
    },
    {
      label: "Langues",
      items: ["Français", "Anglais"],
    },
  ],
  education: [
    {
      degree: "Baccalauréat en administration des affaires",
      institution: "Université Laval",
      location: "Québec, Canada",
      dates: "2012 – 2015",
    },
    {
      degree: "DEC en informatique",
      institution: "Cégep de Sainte-Foy",
      location: "Québec, Canada",
      dates: "2010 – 2012",
    },
  ],
  summary:
    "Développeur full-stack senior et gestionnaire de produit avec plus de 9 ans d'expérience en IA, en fintech et en SaaS, livrant des produits web performants pour des startups et des entreprises nord-américaines, plus récemment ComfyUI, la plateforme d'IA générative open source valorisée à 500 M$. Spécialisé en Next.js, React, TypeScript et Node.js, combinant un flux de développement augmenté par l'IA, une discipline d'ingénierie rigoureuse et une expérience en gestion de produit. Bilingue, français et anglais.",
  workExperience: [
    {
      role: "Développeur front-end senior",
      company: "ComfyUI",
      companySuffix: "Contrat via Toptal",
      dates: "2026",
      bullets: [
        "Conception d'un flux de création de pages par clavardage avec Claude Code pour Comfy Org, la startup de San Francisco valorisée à 500 M$ derrière ComfyUI : n'importe qui dans l'équipe crée une page de production par simple conversation, sans code ni interface, avec des URL de prévisualisation Vercel et un flux d'approbation avant la mise en production.",
        "Intégration de PayloadCMS comme ossature structurelle de ce flux : les pages créées par clavardage assemblent des blocs de contenu structurés existants au lieu de générer du code ponctuel, gardant l'architecture du site cohérente et permettant au marketing de mettre à jour les pages sans ingénierie.",
        "Développement et maintenance de fonctionnalités dans l'application web complexe et performante de ComfyUI, une plateforme comptant plus de 4 M d'utilisateurs, 150 K téléchargements quotidiens et un écosystème de 60 K nœuds créés par la communauté.",
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
      role: "Développeur full-stack senior",
      company: "Afi Expertise",
      companySuffix: "Client de Concreo",
      dates: "2026",
      bullets: [
        "Architecture et refonte complète d'afiexpertise.com avec Next.js, Sanity et Tailwind CSS pour une entreprise de formation corporative bilingue (FR/EN).",
        "Intégration du système de gestion de formation Administrate pour alimenter un catalogue de plus de 360 cours avec filtrage à facettes par faculté, sujet et certification.",
        "Développement du paiement de cours intégré avec Stripe, transformant le site d'une brochure en plateforme transactionnelle.",
        "Modernisation du CMS par la migration du contenu vers Sanity, permettant à l'équipe de contenu d'être autonome dans les deux langues.",
        "Préservation et amélioration du référencement (SEO) pendant la migration, en laissant un code nettement plus maintenable.",
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
      role: "Développeur full-stack senior et gestionnaire de produit",
      company: "TakeUp",
      companySuffix: "Contrat via Toptal",
      dates: "2024 – 2026",
      bullets: [
        "Refonte complète de l'application web, migrant un produit en service avec une clientèle payante de Bubble.io vers Next.js sans interruption.",
        "Seul développeur de l'application web sur un mandat de 18 mois, agissant aussi comme gestionnaire de produit : choix des fonctionnalités à développer, responsabilité de l'architecture et livraison de la spécification à la production, pour une plateforme de tarification par IA gérant en temps réel les tarifs de chambres d'hôtels, d'hôtels-boutiques et de gîtes.",
        "Conception et développement des flux de tarification que les opérateurs utilisent pour prévisualiser, modifier et approuver les recommandations de prix générées par l'IA, en Next.js, React, shadcn/ui et Server Actions.",
        "Connexion du front-end aux services Python et FastAPI exécutant la logique de tarification et l'inférence IA, avec responsabilité de la latence et de la gestion des erreurs.",
        "Mise en place de l'authentification par organisation avec Clerk pour les accès multi-établissements.",
      ],
      tech: ["React", "Next.js", "TypeScript", "Highcharts", "Clerk", "Node.js", "CSS"],
    },
    {
      role: "Fondateur et gestionnaire de produit senior",
      company: "Concreo Solutions Inc.",
      dates: "2020 – Présent",
      bullets: [
        "Fondation et direction d'une firme-conseil en ingénierie de produit, livrant six mandats clients (identifiés « Client de Concreo » ci-dessous) de bout en bout en ed-tech, RH-tech, livraison alimentaire et industries créatives, du cadrage et de l'architecture jusqu'au lancement en production et au soutien post-lancement.",
        "Tous les mandats livrés en production avec une transition maintenable; deux clients convertis en contrats d'entretien continus, et des clients qui prolongent régulièrement leurs mandats ou reviennent avec de nouveaux projets.",
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
      role: "Développeur full-stack senior",
      company: "Humanly",
      companySuffix: "Client de Concreo",
      dates: "2024 – Présent",
      bullets: [
        "Responsable de bout en bout du site web marketing de Humanly, une plateforme d'embauche par IA; mandaté directement après l'acquisition de Teamable, un client précédent.",
        "Développement du site multipage en Next.js, Sanity, Tailwind CSS et shadcn/ui, avec une couche de composants réutilisables qui accélère chaque nouvelle page et un modèle de contenu que les collègues non techniques utilisent sans ingénierie.",
        "Livraison d'expériences soignées, animées et conformes WCAG sur ordinateur, tablette et mobile.",
      ],
      tech: ["Next.js", "React", "Sanity Studio", "Tailwind CSS", "Shadcn", "Resend"],
    },
    {
      role: "Développeur full-stack et 3D",
      company: "Wearesky",
      companySuffix: "Client de Concreo",
      dates: "2022 – 2024",
      bullets: [
        "Conception et développement d'une expérience web centrée sur la 3D avec Nuxt.js, Three.js et GSAP, devenue le principal différenciateur visuel de la marque.",
        "Optimisation d'actifs 3D lourds pour un rendu fluide sur tous les appareils, augmentant les interactions mobiles, et création d'une bibliothèque de composants Vue réutilisables pour les mises en page 3D.",
      ],
      tech: ["Vue 3", "Nuxt.js", "Three.js", "GSAP", "Tailwind CSS", "Contentful", "Google Analytics 4"],
    },
    {
      role: "Développeur front-end",
      company: "Teamable",
      companySuffix: "Client de Concreo",
      dates: "2022 – 2024",
      bullets: [
        "Conception et livraison de l'interface de Teamable.com en Next.js et Tailwind CSS pour la plateforme d'embauche de San Francisco financée par capital de risque, avec accessibilité conforme WCAG et performance sur tous les appareils.",
        "Teamable a été acquise par Humanly en 2024, qui m'a ensuite mandaté directement pour son propre site.",
      ],
      tech: ["Next.js", "React", "Tailwind CSS", "Google Analytics 4"],
    },
    {
      role: "Développeur front-end",
      company: "Grics",
      companySuffix: "Client de Concreo",
      dates: "2021 – 2022",
      bullets: [
        "Création de la suite de composants réutilisables d'un tableau de bord administratif interne, devenue la référence de composants de l'équipe.",
        "Renforcement de la qualité avec des suites de tests Jest et une documentation Storybook utilisées autant par les développeurs que par les parties prenantes.",
      ],
      tech: ["Vue 3", "Nuxt.js", "Vuetify", "Jest", "Storybook", "Azure DevOps"],
    },
    {
      role: "Développeur full-stack",
      company: "TakeIn",
      companySuffix: "Client de Concreo",
      dates: "2020 – 2021",
      bullets: [
        "Développement du back-end gérant des commandes de repas simultanées à grande échelle, incluant une intégration de paiement Stripe sécurisée.",
        "Refactorisation des chemins de code critiques des utilisateurs et des commandes, améliorant mesurablement la performance et la maintenabilité.",
      ],
      tech: ["Nuxt.js", "Vue", "Firebase", "Stripe", "Node.js", "TypeScript", "Docker"],
    },
    {
      role: "Product Owner et développeur front-end",
      company: "Zumrails",
      dates: "2020 – 2021",
      bullets: [
        "Arrivée aux tout débuts de Zumrails, contribuant aux premières maquettes produit et à la proposition marketing qui ont défini sa plateforme de paiements fintech.",
        "Zumrails a ensuite levé une série A à une valorisation de plus de 100 M$ (2024).",
      ],
      tech: ["Vue 3", "Nuxt.js", "Tailwind CSS", "Figma", "i18n"],
    },
    {
      role: "Product Owner",
      company: "Flinks",
      dates: "2019",
      bullets: [
        "Responsable du produit Wealth Data, étendant la couverture de données de Flinks des comptes bancaires aux comptes d'investissement, et création de l'initiative de croissance par le produit (PLG) : une plateforme permettant aux clients de s'inscrire en libre-service sans parler à un représentant.",
        "Direction de la vision produit, de la feuille de route, de la planification des versions et de l'élaboration des récits utilisateur pour les deux initiatives.",
        "Flinks a été acquise par la Banque Nationale du Canada pour 100 M$ (2021).",
      ],
      tech: ["Aha!", "Figma", "Recherche", "Bootstrap"],
    },
    {
      role: "Conseiller en intelligence d'affaires",
      company: "CGI",
      dates: "2017 – 2019",
      bullets: [
        "Création de tableaux de bord de rapports et de prévisions dans Tableau et Power BI pour des clients d'envergure, dont une grande banque canadienne, devenus la référence pour le suivi des indicateurs de direction.",
        "Conception de scénarios et de modèles de sensibilité pour prédire les résultats financiers et éprouver les initiatives stratégiques.",
      ],
      tech: ["Tableau", "Power BI", "Microsoft Dynamics CRM", "SQL"],
    },
  ],
}

export const resumeLabels: Record<ResumeLocale, ResumeLabels> = {
  en: {
    summary: "Summary",
    workExperience: "Work Experience",
    education: "Education",
    tech: "Tech:",
    downloadPdf: "Download PDF",
    documentTitle: "Michael Boutin resume",
  },
  fr: {
    summary: "Sommaire",
    workExperience: "Expérience professionnelle",
    education: "Formation",
    tech: "Technologies :",
    downloadPdf: "Télécharger le PDF",
    documentTitle: "CV de Michael Boutin",
  },
}

export const resumeContentByLocale: Record<ResumeLocale, ResumeContent> = {
  en: resumeContent,
  fr: resumeContentFr,
}

export const resumePdfPathByLocale: Record<ResumeLocale, string> = {
  en: "/resume.pdf",
  fr: "/resume-fr.pdf",
}

export function parseResumeLocale(value: unknown): ResumeLocale {
  return value === "fr" ? "fr" : "en"
}
