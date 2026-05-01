# PRD: EPIC 1 — Foundation & Portfolio

**Status:** Draft  
**Date:** 2026-05-01  
**Brief:** `_briefs/imick-io-brief.md`

---

## Problem Statement

There is no imick.io today. Recruiters, hiring managers, and developers who encounter Michael's work on X, LinkedIn, YouTube, or GitHub have no canonical destination to evaluate his expertise, download his resume, or get in touch. Every impression is ephemeral and leaves no SEO or brand equity behind. Without a live, polished portfolio, job search outreach lacks a credible anchor, and inbound opportunities are missed entirely.

---

## Solution

Build and ship the first version of imick.io: a premium personal portfolio site that serves as the permanent home base for Michael's developer brand. Phase 1 includes a homepage, a full resume/about page, a contact page, a GitHub Sponsors link, and all foundational infrastructure (theme, SEO, OG images, sitemap). The resume is downloadable but gated behind a lead capture form, turning every download into a qualified job lead delivered to Michael's inbox via Resend. The site respects the visitor's system color preference (dark/light) by default.

---

## User Stories

### Visitor / Recruiter

1. As a recruiter, I want to land on a homepage with a clear hero section showing the developer's name, role, and tagline, so that I can immediately understand who this person is and what they do.
2. As a recruiter, I want to read a short professional bio on the homepage, so that I can get a human sense of Michael's background and personality.
3. As a recruiter, I want to see a tech stack grid on the homepage, so that I can quickly assess technical fit against my open roles.
4. As a recruiter, I want clear navigation to the About/Resume page, so that I can dive into the full work history without hunting around.
5. As a recruiter, I want to see a detailed work experience timeline on the About page, so that I can evaluate career progression and tenure.
6. As a recruiter, I want to see education credentials on the About page, so that I can verify academic background.
7. As a recruiter, I want to see open-source highlights on the About page, so that I can assess code quality and community involvement.
8. As a recruiter, I want to download a PDF resume, so that I can share it internally with hiring managers.
9. As a recruiter, I want the PDF download to be gated behind a short form asking for my name, email, company, LinkedIn profile, and hiring intention, so that the download process feels professional rather than just a raw file link.
10. As a recruiter, I want the form to be quick and non-intrusive (modal or inline), so that I don't abandon the download due to friction.
11. As a recruiter, I want to see a professional OG image when I share the imick.io URL in Slack or email, so that the link preview looks polished.
12. As a recruiter, I want the site to load fast on both mobile and desktop, so that I can review it on any device.

### Developer / General Visitor

13. As a developer, I want the site to respect my system dark/light mode preference, so that it feels native to my setup without having to toggle anything.
14. As a developer, I want to navigate easily between the homepage, About, and Contact pages, so that I can explore the site without getting lost.
15. As a developer, I want to see links to upcoming sections (Learn, Bookmarks) only when they are live, so that I don't click dead links.
16. As a developer, I want to find a contact form easily, so that I can reach out about collaboration or opportunities.
17. As a developer, I want the contact form to confirm my submission, so that I know my message was received.

### Site Owner (Michael)

18. As the site owner, I want to receive an email via Resend every time someone fills out the resume gate form, including their name, email, company, LinkedIn URL, and intention, so that I can follow up on every download as a warm lead.
19. As the site owner, I want to receive contact form submissions via Resend email, so that I don't miss inbound messages.
20. As the site owner, I want my resume content (experience, education, tech stack, open-source projects) stored in structured TypeScript data files, so that I can update my content without modifying JSX components.
21. As the site owner, I want a static PDF resume in `/public/` that I can replace by swapping the file, so that updating the resume requires no code changes.
22. As the site owner, I want the site to be indexed by search engines with proper metadata, so that my name and skills are discoverable via Google.
23. As the site owner, I want a sitemap and robots.txt generated automatically, so that search crawlers can index all pages efficiently.
24. As the site owner, I want OG images generated per page using Next.js conventions, so that every shared link has a branded preview.
25. As the site owner, I want a link to my GitHub Sponsors profile accessible from the site (footer or nav), so that collaborators and fans can support my work.
26. As the site owner, I want the navigation to only show links to pages that are currently live, so that visitors never hit a dead page.

---

## Implementation Decisions

### Theme
- Use `next-themes` with `defaultTheme="system"` and no forced override. The existing `.dark` class in `globals.css` is already wired up; `next-themes` will apply it based on `prefers-color-scheme`.
- No manual toggle in Phase 1 — system preference only.

### Content Data Layer
- All resume content is stored as typed TypeScript files in `/content/data/`:
  - `experience.ts` — work history (company, role, dates, bullet points)
  - `education.ts` — degrees and institutions
  - `stack.ts` — tech stack items (name, icon/logo, category)
  - `projects.ts` — open-source highlights (name, description, GitHub URL, stars)
- Components consume these files directly as imports — no API calls, no database.

### Homepage
- Sections in order: Hero (name + role + tagline + CTA buttons), Short Bio, Tech Stack Grid, Section Links (About, Contact — no Learn/Bookmarks links until those EPICs ship).
- CTAs: "View Resume" → `/about` and "Get in Touch" → `/contact`.

### About / Resume Page (`/about`)
- Sections in order: Hero (name + role), Bio paragraph, Tech Stack Grid, Work Experience Timeline, Education, Open-Source Highlights, Resume Download CTA.
- The Resume Download CTA opens the lead capture gate (modal).

### Resume Gate (PDF Download)
- Triggered by a "Download Resume" button on `/about`.
- Implemented as a modal dialog using shadcn's Dialog component.
- Form fields: Full Name (text), Email (email), Company (text), LinkedIn Profile URL (url, optional), Intention (select: "Hiring", "Freelance / Contract", "Collaboration", "Just curious").
- On valid submit: fire a Resend API call server-side to notify Michael with all field values, then trigger the PDF download from `/public/resume.pdf`.
- On error: show an inline error message; do not block the download permanently.
- Form submission is a Next.js Server Action.
- No lead data is persisted to a database in this phase — email notification only.

### Contact Page (`/contact`)
- Simple form: Name, Email, Subject, Message.
- On submit: Server Action calls Resend to deliver the message to Michael's inbox.
- Shows a success confirmation message inline after submission.
- No CAPTCHA in Phase 1.

### Email (Resend)
- Resend is set up in this EPIC (not deferred to EPIC 4).
- Two email templates:
  1. Resume lead notification (to Michael): structured summary of all gate form fields.
  2. Contact form notification (to Michael): sender name, email, subject, message body.
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` stored in `.env.local`.

### Navigation
- Phase 1 active links: **Home**, **About**, **Contact**.
- Sponsor link: rendered as an icon button (GitHub icon) in the header or footer — not a nav text link.
- Learn and Bookmarks links are added to the nav when those EPICs ship.

### Sponsor Page (`/sponsor`)
- A simple redirect or a minimal page with a single CTA button linking to the GitHub Sponsors profile URL.
- Linked from the nav/footer icon rather than a top-level nav item.

### SEO & Metadata
- Root `layout.tsx` metadata: title template (`{page} | Michael Boutin`), description, canonical URL, Open Graph defaults.
- Per-page `metadata` exports for `/`, `/about`, `/contact`.
- `opengraph-image.tsx` using Next.js Image Response API for dynamic OG images.
- `sitemap.ts` as a Next.js route handler returning all Phase 1 pages.
- `robots.ts` as a Next.js route handler allowing all crawlers.

### PDF Resume
- Static file: `/public/resume.pdf`.
- Swapped by replacing the file — no code changes needed to update.

---

## Out of Scope

- Learn section (blog posts, code snippets) — EPIC 2.
- Bookmarks, admin interface, database setup — EPIC 3.
- Newsletter subscribe page and Beehiiv integration — EPIC 4.
- Classes section — EPIC 5.
- Dark/light mode toggle — system preference only in Phase 1.
- Lead storage in a database — manual import from email later.
- CAPTCHA or spam protection on forms.
- Analytics integration (can be added post-launch).
- i18n / localization.

---

## Further Notes

- The project already has Tailwind v4, shadcn/ui (base-maia style), HugeIcons, and Figtree font configured. EPIC 1 should build entirely within this existing design system — no new UI libraries.
- `next-themes` needs to be added to `package.json`.
- `resend` SDK needs to be added to `package.json`.
- The resume PDF (`/public/resume.pdf`) must be provided by Michael before Phase 1 can ship — it is a hard dependency for the download gate feature.
- The Resend account and verified sender domain must be set up before the contact form and resume gate can be tested end-to-end.
- The GitHub Sponsors profile URL must be provided to wire up the sponsor link.
