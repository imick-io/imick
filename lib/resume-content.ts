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
  title: "Senior Product Engineer & Forward-Deployed Engineer",
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
        "PostHog",
        "Sentry",
      ],
    },
    {
      label: "AI",
      items: [
        "Claude Code",
        "Claude API",
        "OpenAI API",
        "Agentic AI",
        "Prompt Engineering",
        "GitHub Copilot",
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
    "Product engineer and technical lead with 9+ years across AI, fintech, and SaaS, working as a forward-deployed engineer: embedding with a client's leadership and teams, learning how the business actually runs, and turning their problems into AI-powered tools in production. Started on the business side, as a BI consultant working with CGI's executive team and a business analyst at Flinks. Most recently led the design and team-wide adoption of an AI-driven publishing workflow at ComfyUI, the $500M-valuation open-source generative AI platform, and owned the entire web application of an AI pricing platform serving 150+ hotel properties. Reviews code daily, leads and mentors developers, and pairs an AI-augmented workflow with rigorous engineering discipline in Next.js, React, TypeScript, and Node.js. Bilingual, English and French.",
  workExperience: [
    {
      role: "Senior Front-End Developer",
      company: "ComfyUI",
      companySuffix: "Contract via Toptal",
      dates: "2026",
      bullets: [
        "Forward-deployed with the marketing team: learned how they publish, then built a Slack-to-Claude agent pipeline around their workflow so non-engineers ship production pages.",
        "Proposed, designed, and drove to full adoption a Claude Code chat workflow for Comfy Org, the $500M-valuation San Francisco startup behind ComfyUI: anyone on the team creates a production page through chat alone, no code and no UI, gated by Vercel preview URLs and an approval step before merge. It is now the standard publishing tool of the entire marketing team.",
        "Owned the architecture decision behind it, making PayloadCMS the structural backbone: chat-created pages assemble existing, structured content blocks instead of generating one-off code, so the site stays consistent as non-engineers ship pages without engineering.",
        "Led one developer and acted as reviewer of record: daily code review of engineering and marketing-authored changes, triage and resolution of CodeRabbit findings, and the conventions that kept AI-assisted contributions safe to merge.",
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
      role: "Senior Full-Stack Developer & Architect",
      company: "Afi Expertise",
      companySuffix: "Client of Concreo",
      dates: "2026",
      bullets: [
        "Brought in to rebuild afiexpertise.com end to end for a bilingual (FR/EN) corporate training company: owned the architecture review, the choice of services, and the delivery of the new Next.js, Sanity, and Tailwind CSS platform from first commit to launch.",
        "Worked forward-deployed with the client: learned how AFI runs its training and enrollment operations, then shaped the platform and its integrations around that workflow.",
        "Integrated the Administrate training management system to power a 360+ course catalog with faceted filtering by faculty, subject, and certification, mapping its API onto the client's enrollment workflow and engineering around the platform's limitations.",
        "Built in-app course checkout with Stripe, turning the site from a brochure into a transactional platform.",
        "Modernized the CMS by migrating content into Sanity, enabling the content team to self-serve in both languages.",
        "Preserved and improved SEO through the migration while leaving a markedly more maintainable codebase.",
        "Delivered the rebuild with my own AI development workflow built on Claude Code, combining custom and existing agent skills to ship faster.",
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
      role: "Lead Full-Stack Developer & Product Manager",
      company: "TakeUp",
      companySuffix: "Contract via Toptal",
      dates: "2024 – 2026",
      bullets: [
        "Owned the entire web application of an AI pricing platform managing live room rates for 150+ hotels, boutique hotels, and B&Bs: architecture, roadmap, specs, and delivery, as the sole web developer across an 18-month engagement.",
        "Rebuilt the product from the ground up, migrating 70 live properties and their paying users from Bubble.io to Next.js: kept the core AI and property data intact, migrated only property metadata, and cut over with no data-migration downtime beyond a brief DNS switch.",
        "Worked as the client's forward-deployed engineer: embedded daily with the founders and the data science team on product direction, writing the specs and defining the roadmap that turned AI rate recommendations into workflows operators trust to preview, edit, and approve, built in Next.js, React, shadcn/ui, and Server Actions.",
        "Connected the front end to Python and FastAPI services running pricing logic and AI inference, owning the latency and error-handling story across the boundary.",
        "Established the engineering baseline: PostHog product analytics, Sentry error monitoring, an automated test suite, CI that gates every deploy on passing tests, and organization-based authentication with Clerk for multi-property access.",
      ],
      tech: ["React", "Next.js", "TypeScript", "Highcharts", "Clerk", "PostHog", "Sentry", "Node.js", "CSS"],
    },
    {
      role: "Founder & Senior Product Manager",
      company: "Concreo Solutions Inc.",
      dates: "2020 – Present",
      bullets: [
        "Founded and run a product engineering consultancy, delivering six client engagements (marked \"Client of Concreo\" below) end to end across ed-tech, HR-tech, food delivery, and creative industries, from scoping and architecture through production launch and post-launch support.",
        "Work in a forward-deployed model: embed with each client's leadership, map the business problem, and own delivery from prototype to production.",
        "Deliberately hands-on: every engagement is scoped, architected, built, and shipped personally so the quality is guaranteed by the person accountable for it. Every project reached production with a maintainable handoff, two clients converted to ongoing retainers, and new work comes through Toptal and referrals.",
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
        "Own the marketing website of Humanly, an AI hiring platform, end to end, including its roadmap; engaged directly after Humanly acquired Teamable, a previous client.",
        "Embedded engineering partner to the marketing team: built the multi-page site in Next.js, Sanity, Tailwind CSS, and shadcn/ui, with a reusable component layer that shortened time-to-feature and a content model non-technical teammates ship with, no engineering required.",
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
        "Optimized heavy 3D assets to render smoothly across devices, improving mobile engagement, and built a reusable Vue component library for 3D-driven layouts.",
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
        "Built the reusable component suite for an internal admin dashboard, adopted by a team of roughly 10 developers as its component reference.",
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
        "Joined Zumrails as its fourth team member at founding stage and helped define the initial product: the first mockups and the marketing proposal that shaped its fintech payments platform. The team had grown to 10 by the time I left.",
        "Zumrails went on to raise a Series A at a $100M+ valuation (2024).",
      ],
      tech: ["Vue 3", "Nuxt.js", "Tailwind CSS", "Figma", "i18n"],
    },
    {
      role: "Business Analyst & Product Owner",
      company: "Flinks",
      dates: "2019",
      bullets: [
        "Started as a business analyst, mapping, cleaning up, and automating internal processes, which built the end-to-end understanding of the platform I later relied on as Product Owner.",
        "Owned the Wealth Data product, expanding Flinks' data coverage from banking to investment and wealth accounts, and launched the product-led growth initiative: an invitation-only platform letting customers self-onboard without talking to a sales rep.",
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
        "Worked directly with CGI's executive team to build their business intelligence reporting and forecasting in Tableau and Power BI, which became the source of truth for executive KPI monitoring.",
        "Embedded in the business intelligence unit of a major Canadian bank, delivering reporting for the entire bank, which meant learning how complex banking processes work end to end before reporting on them.",
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
  title: "Ingénieur produit senior et ingénieur déployé chez le client",
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
        "PostHog",
        "Sentry",
      ],
    },
    {
      label: "IA",
      items: [
        "Claude Code",
        "Claude API",
        "OpenAI API",
        "IA agentique",
        "Ingénierie de prompts",
        "GitHub Copilot",
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
    "Ingénieur produit et responsable technique avec plus de 9 ans d'expérience en IA, en fintech et en SaaS, travaillant comme ingénieur déployé chez le client (forward-deployed engineer) : intégration auprès de la direction et des équipes du client, compréhension du fonctionnement réel de l'entreprise, et transformation de ses problèmes en outils propulsés par l'IA, en production. Parcours amorcé côté affaires, comme conseiller BI auprès de la haute direction de CGI et analyste d'affaires chez Flinks. Plus récemment, direction de la conception et de l'adoption par toute l'équipe d'un flux de publication piloté par l'IA chez ComfyUI, la plateforme d'IA générative open source valorisée à 500 M$, et responsabilité complète de l'application web d'une plateforme de tarification par IA desservant plus de 150 établissements hôteliers. Revue de code quotidienne, encadrement de développeurs, et un flux de travail augmenté par l'IA allié à une discipline d'ingénierie rigoureuse en Next.js, React, TypeScript et Node.js. Bilingue, français et anglais.",
  workExperience: [
    {
      role: "Développeur front-end senior",
      company: "ComfyUI",
      companySuffix: "Contrat via Toptal",
      dates: "2026",
      bullets: [
        "Déploiement auprès de l'équipe marketing : compréhension de sa façon de publier, puis construction autour de son flux d'un pipeline Slack vers un agent Claude permettant à des non-ingénieurs de publier des pages en production.",
        "Proposition, conception et adoption complète d'un flux de création de pages par clavardage avec Claude Code pour Comfy Org, la startup de San Francisco valorisée à 500 M$ derrière ComfyUI : n'importe qui dans l'équipe crée une page de production par simple conversation, sans code ni interface, avec des URL de prévisualisation Vercel et une étape d'approbation avant la fusion. C'est aujourd'hui l'outil de publication standard de toute l'équipe marketing.",
        "Responsable de la décision d'architecture sous-jacente, faisant de PayloadCMS l'ossature structurelle du flux : les pages créées par clavardage assemblent des blocs de contenu structurés existants au lieu de générer du code ponctuel, gardant le site cohérent pendant que des non-ingénieurs publient sans ingénierie.",
        "Encadrement d'un développeur et rôle de réviseur de référence : revue de code quotidienne des changements de l'ingénierie et de l'équipe marketing, triage et résolution des signalements CodeRabbit, et mise en place des conventions qui gardent les contributions assistées par l'IA sûres à fusionner.",
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
      role: "Développeur full-stack senior et architecte",
      company: "Afi Expertise",
      companySuffix: "Client de Concreo",
      dates: "2026",
      bullets: [
        "Mandaté pour reconstruire afiexpertise.com de bout en bout pour une entreprise de formation corporative bilingue (FR/EN) : responsable de la revue d'architecture, du choix des services et de la livraison de la nouvelle plateforme Next.js, Sanity et Tailwind CSS, du premier commit jusqu'au lancement.",
        "Travail en mode déployé chez le client : compréhension du fonctionnement des opérations de formation et d'inscription d'AFI, puis conception de la plateforme et de ses intégrations autour de ce flux.",
        "Intégration du système de gestion de formation Administrate pour alimenter un catalogue de plus de 360 cours avec filtrage à facettes par faculté, sujet et certification, en mappant son API sur le flux d'inscription du client et en contournant les limites de la plateforme.",
        "Développement du paiement de cours intégré avec Stripe, transformant le site d'une brochure en plateforme transactionnelle.",
        "Modernisation du CMS par la migration du contenu vers Sanity, permettant à l'équipe de contenu d'être autonome dans les deux langues.",
        "Préservation et amélioration du référencement (SEO) pendant la migration, en laissant un code nettement plus maintenable.",
        "Livraison de la refonte avec mon propre flux de développement par IA basé sur Claude Code, combinant des compétences d'agent maison et existantes pour livrer plus vite.",
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
      role: "Développeur full-stack principal et gestionnaire de produit",
      company: "TakeUp",
      companySuffix: "Contrat via Toptal",
      dates: "2024 – 2026",
      bullets: [
        "Responsable de l'ensemble de l'application web d'une plateforme de tarification par IA gérant en temps réel les tarifs de chambres de plus de 150 hôtels, hôtels-boutiques et gîtes : architecture, feuille de route, spécifications et livraison, en tant que seul développeur web sur un mandat de 18 mois.",
        "Refonte complète du produit, migrant 70 établissements en service et leurs utilisateurs payants de Bubble.io vers Next.js : cœur IA et données des établissements conservés intacts, seules les métadonnées des établissements migrées, et bascule sans interruption de la migration des données hormis un bref changement de DNS.",
        "Rôle d'ingénieur déployé chez le client : collaboration quotidienne avec les fondateurs et l'équipe de science des données sur la direction du produit, en rédigeant les spécifications et en définissant la feuille de route qui ont transformé les recommandations tarifaires de l'IA en flux que les opérateurs utilisent avec confiance pour prévisualiser, modifier et approuver, en Next.js, React, shadcn/ui et Server Actions.",
        "Connexion du front-end aux services Python et FastAPI exécutant la logique de tarification et l'inférence IA, avec responsabilité de la latence et de la gestion des erreurs.",
        "Mise en place de la base d'ingénierie : analytique produit PostHog, surveillance des erreurs Sentry, suite de tests automatisés, CI conditionnant chaque déploiement à la réussite des tests, et authentification par organisation avec Clerk pour les accès multi-établissements.",
      ],
      tech: ["React", "Next.js", "TypeScript", "Highcharts", "Clerk", "PostHog", "Sentry", "Node.js", "CSS"],
    },
    {
      role: "Fondateur et gestionnaire de produit senior",
      company: "Concreo Solutions Inc.",
      dates: "2020 – Présent",
      bullets: [
        "Fondation et direction d'une firme-conseil en ingénierie de produit, livrant six mandats clients (identifiés « Client de Concreo » ci-dessous) de bout en bout en ed-tech, RH-tech, livraison alimentaire et industries créatives, du cadrage et de l'architecture jusqu'au lancement en production et au soutien post-lancement.",
        "Travail en mode déployé chez le client : intégration auprès de la direction de chaque client, cartographie du problème d'affaires, et responsabilité de la livraison du prototype jusqu'à la production.",
        "Volontairement pratique : chaque mandat est cadré, architecturé, construit et livré personnellement pour que la qualité soit garantie par la personne qui en répond. Tous les projets livrés en production avec une transition maintenable, deux clients convertis en contrats d'entretien continus, et de nouveaux mandats obtenus via Toptal et par recommandation.",
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
        "Responsable de bout en bout du site web marketing de Humanly, une plateforme d'embauche par IA, y compris de sa feuille de route; mandaté directement après l'acquisition de Teamable, un client précédent.",
        "Partenaire d'ingénierie intégré à l'équipe marketing : développement du site multipage en Next.js, Sanity, Tailwind CSS et shadcn/ui, avec une couche de composants réutilisables qui accélère chaque nouvelle page et un modèle de contenu que les collègues non techniques utilisent sans ingénierie.",
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
        "Optimisation d'actifs 3D lourds pour un rendu fluide sur tous les appareils, améliorant l'engagement mobile, et création d'une bibliothèque de composants Vue réutilisables pour les mises en page 3D.",
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
        "Création de la suite de composants réutilisables d'un tableau de bord administratif interne, adoptée par une équipe d'une dizaine de développeurs comme référence de composants.",
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
        "Quatrième membre de l'équipe de Zumrails à sa fondation, contribuant à définir le produit initial : les premières maquettes et la proposition marketing qui ont façonné sa plateforme de paiements fintech. L'équipe comptait 10 personnes à mon départ.",
        "Zumrails a ensuite levé une série A à une valorisation de plus de 100 M$ (2024).",
      ],
      tech: ["Vue 3", "Nuxt.js", "Tailwind CSS", "Figma", "i18n"],
    },
    {
      role: "Analyste d'affaires et Product Owner",
      company: "Flinks",
      dates: "2019",
      bullets: [
        "Débuts comme analyste d'affaires : cartographie, nettoyage et automatisation des processus internes, ce qui a bâti la compréhension de bout en bout de la plateforme sur laquelle je me suis ensuite appuyé comme Product Owner.",
        "Responsable du produit Wealth Data, étendant la couverture de données de Flinks des comptes bancaires aux comptes d'investissement, et lancement de l'initiative de croissance par le produit (PLG) : une plateforme sur invitation permettant aux clients de s'inscrire en libre-service sans parler à un représentant.",
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
        "Travail direct avec la haute direction de CGI pour bâtir ses rapports d'intelligence d'affaires et ses prévisions dans Tableau et Power BI, devenus la référence pour le suivi des indicateurs de direction.",
        "Intégration à l'unité d'intelligence d'affaires d'une grande banque canadienne, produisant les rapports de toute la banque, ce qui exigeait de comprendre de bout en bout des processus bancaires complexes avant d'en rendre compte.",
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
