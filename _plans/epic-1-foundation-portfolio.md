# Plan: EPIC 1 — Foundation & Portfolio

> Source PRD: `_prds/epic-1-foundation-portfolio.md`

## Architectural decisions

- **Routes:** `/` (home), `/about`, `/contact`, `/sponsor`
- **Content model:** Typed TypeScript data files in `/content/data/` — no database, no CMS
- **Email:** Resend via Next.js Server Actions — API key never exposed to client
- **Theme:** `next-themes` with `defaultTheme="system"`, no manual toggle
- **PDF resume:** Static file at `/public/resume.pdf`, download gated behind a Server Action form
- **Form submissions:** Next.js Server Actions for all forms (resume gate, contact)
- **Auth:** None in this EPIC

---

## Phase 1: Site Shell & Theme

**User stories:** 13, 14, 15, 26

### What to build

Install and configure `next-themes`. Update the root layout with a header containing the navigation (Home, About, Contact) and a GitHub Sponsors icon button. Create empty page shells for `/`, `/about`, `/contact`, and `/sponsor`. Set the global metadata title template (`{page} | Michael Boutin`) and a default description. The site should render correctly in both dark and light system themes with no flash of incorrect theme.

### Acceptance criteria

- [ ] Visiting `/`, `/about`, `/contact`, and `/sponsor` returns a 200 with the shared header/nav
- [ ] Navigation only shows Home, About, Contact (no Learn or Bookmarks links)
- [ ] GitHub Sponsors icon is visible and links to the correct URL
- [ ] System dark mode is applied automatically with no theme flash on load
- [ ] Page `<title>` follows the template format on every route

---

## Phase 2: Homepage

**User stories:** 1, 2, 3, 4, 15

### What to build

Build the homepage with four sections in order: (1) Hero — name, role/title, tagline, and two CTA buttons ("View Resume" → `/about`, "Get in Touch" → `/contact`); (2) Short bio paragraph; (3) Tech stack grid sourced from `/content/data/stack.ts`; (4) Section links pointing to active pages only. Create `/content/data/stack.ts` with typed entries (name, icon, category).

### Acceptance criteria

- [ ] Hero section displays name, role, tagline, and both CTA buttons
- [ ] "View Resume" navigates to `/about`
- [ ] "Get in Touch" navigates to `/contact`
- [ ] Tech stack grid renders all entries from `stack.ts`
- [ ] Section links are visible and point only to live routes
- [ ] Homepage is responsive on mobile and desktop

---

## Phase 3: About / Resume Page

**User stories:** 4, 5, 6, 7, 20

### What to build

Build the `/about` page with five sections sourced entirely from data files: (1) Hero (name + role); (2) Bio paragraph; (3) Work experience timeline from `/content/data/experience.ts` (company, role, date range, bullet points); (4) Education from `/content/data/education.ts` (institution, degree, year); (5) Open-source highlights from `/content/data/projects.ts` (name, description, GitHub URL). Include a "Download Resume" CTA button at the bottom — the button is visible but the gate is wired in Phase 4.

### Acceptance criteria

- [ ] All five sections render with data from their respective data files
- [ ] Experience entries appear in reverse-chronological order
- [ ] Open-source highlight links open the GitHub URL
- [ ] "Download Resume" button is present and visible
- [ ] Page is responsive on mobile and desktop
- [ ] Updating a data file is reflected on the page without any component changes

---

## Phase 4: Email Infrastructure + Resume Gate

**User stories:** 8, 9, 10, 18, 21

### What to build

Add the `resend` SDK. Configure `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env.local`. Wire the "Download Resume" button on `/about` to open a modal dialog (shadcn Dialog). The modal contains a form with five fields: Full Name, Email, Company, LinkedIn Profile URL (optional), and Intention (select: Hiring / Freelance or Contract / Collaboration / Just curious). On valid submission, a Server Action sends a structured lead notification email to Michael via Resend, then triggers the PDF download from `/public/resume.pdf`. On error, an inline error message is shown and the download is not blocked permanently.

### Acceptance criteria

- [ ] Clicking "Download Resume" opens the modal
- [ ] All five form fields render with correct input types
- [ ] LinkedIn and Intention fields are properly labeled (LinkedIn optional)
- [ ] Submitting the form with valid data triggers a Resend email to Michael containing all field values
- [ ] PDF download begins immediately after successful submission
- [ ] A validation error is shown for missing required fields before submission
- [ ] An inline error message appears if the Resend call fails
- [ ] The Resend API key is never exposed in client-side code

---

## Phase 5: Contact Page

**User stories:** 16, 17, 19

### What to build

Build the `/contact` page with a form containing four fields: Name, Email, Subject, Message. On submission, a Server Action sends the message to Michael's inbox via the already-configured Resend integration. After a successful send, replace the form with an inline success confirmation message. No page reload or redirect.

### Acceptance criteria

- [ ] Contact form renders all four fields
- [ ] Submitting with valid data delivers an email to Michael containing all field values
- [ ] An inline success message replaces the form after successful submission
- [ ] Required field validation prevents submission with empty fields
- [ ] An inline error message appears if the Resend call fails
- [ ] Form is usable on mobile

---

## Phase 6: SEO & Discoverability

**User stories:** 11, 12, 22, 23, 24, 25

### What to build

Add per-page `metadata` exports to `/`, `/about`, and `/contact` with accurate titles, descriptions, and canonical URLs. Implement `opengraph-image.tsx` files using the Next.js Image Response API to generate branded OG images for each page. Add a `sitemap.ts` route handler that returns all Phase 1 routes. Add a `robots.ts` route handler that allows all crawlers and references the sitemap URL.

### Acceptance criteria

- [ ] Each page has a unique `<title>` and `<meta name="description">`
- [ ] Sharing any page URL in a Slack/iMessage preview renders a branded OG image
- [ ] `GET /sitemap.xml` returns a valid XML sitemap listing all four routes
- [ ] `GET /robots.txt` returns a valid robots file pointing to the sitemap
- [ ] No canonical URL conflicts between pages
