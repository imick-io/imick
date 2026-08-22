// Generate public/resume.pdf from lib/resume-content.ts.
//
// Requires WeasyPrint installed on the host (`brew install weasyprint` on macOS,
// `apt-get install weasyprint` on Linux). The script writes a self-contained
// HTML file (plain CSS, no Tailwind) and pipes it through weasyprint.
//
// Run with: pnpm generate-resume-pdf

import { writeFileSync, mkdirSync } from "node:fs"
import { execSync } from "node:child_process"
import { join } from "node:path"
import { resumeContent } from "../lib/resume-content.ts"

const projectRoot = process.cwd()
const tmpDir = join(projectRoot, ".tmp-resume-pdf")
const htmlPath = join(tmpDir, "resume.html")
const pdfPath = join(projectRoot, "public", "resume.pdf")

mkdirSync(tmpDir, { recursive: true })

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

const c = resumeContent

const sidebarChipGroups = c.chipGroups
  .map(
    (g) => `
  <section class="sb-section">
    <h2 class="sb-title">${escape(g.label)}</h2>
    <ul class="chips">
      ${g.items.map((i) => `<li class="chip">${escape(i)}</li>`).join("")}
    </ul>
  </section>`
  )
  .join("")

const sidebarEducation = c.education
  .map(
    (e) => `
    <li class="edu">
      <p class="edu-degree">${escape(e.degree)}</p>
      <p class="edu-school">${escape(e.institution)}, ${escape(e.location)}</p>
      <p class="edu-dates">${escape(e.dates)}</p>
    </li>`
  )
  .join("")

const contactLine = `
  <span class="contact-item">
    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
    ${escape(c.location)}
  </span>
  ${c.contactLinks
    .map((cl) => {
      const icon =
        cl.kind === "linkedin"
          ? `<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.34 17H5.67V9.83h2.67V17zM7 8.61a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1zM18.33 17H15.67v-3.78c0-1-.36-1.68-1.25-1.68a1.35 1.35 0 0 0-1.27.9 1.68 1.68 0 0 0-.08.6V17H10.4s.04-7.17 0-7.17h2.67v1.02a2.65 2.65 0 0 1 2.4-1.32c1.75 0 3 1.13 3 3.55V17z"/></svg>`
          : `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>`
      return `
  <a class="contact-item" href="${escape(cl.href)}">
    ${icon}
    ${escape(cl.label)}
  </a>`
    })
    .join("")}
`

const workEntries = c.workExperience
  .map(
    (w) => `
    <li class="work">
      <div class="work-head">
        <h3 class="work-role">${escape(w.role)}</h3>
        <span class="work-dates">${escape(w.dates)}</span>
      </div>
      <p class="work-company">
        <span class="company-name">${escape(w.company)}</span>${
          w.companySuffix
            ? ` <span class="company-suffix">${escape(w.companySuffix)}</span>`
            : ""
        }
      </p>
      <ul class="bullets">
        ${w.bullets.map((b) => `<li>${escape(b)}</li>`).join("")}
      </ul>
      <p class="tech"><span class="tech-label">Tech:</span> ${w.tech.map(escape).join(", ")}</p>
    </li>`
  )
  .join("")

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escape(c.name)} resume</title>
<style>
@page { size: letter; margin: 0.4in 0; }
* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 10pt; color: #1d1d1d; line-height: 1.45;
}
:root {
  --primary: #00813a;
  --foreground: #1d1d1d;
  --muted-foreground: #6b6b65;
  --sidebar-bg: #f4f4f0;
  --border: #e8e8e3;
  --card-bg: #ffffff;
  --monogram-bg: #0c0c09;
  --monogram-fg: #ffffff;
}
.doc { width: 100%; border-collapse: collapse; }
.sb-cell {
  width: 2.4in;
  background: var(--sidebar-bg);
  padding: 0.3in 0.28in 0;
  vertical-align: top;
}
.main-cell { padding: 0.3in 0.4in 0; vertical-align: top; background: #fff; }
.monogram {
  display: inline-block;
  width: 0.42in; height: 0.42in;
  background: var(--monogram-bg);
  color: var(--monogram-fg);
  text-align: center; line-height: 0.42in;
  font-weight: 600; font-size: 11pt; letter-spacing: 0.5pt;
  border-radius: 3pt; margin-bottom: 12pt;
}
.name {
  margin: 0 0 4pt 0; font-size: 16pt; font-weight: 600;
  color: var(--foreground); letter-spacing: -0.2pt;
}
.title { margin: 0 0 8pt 0; font-size: 10pt; color: var(--foreground); }
.contact {
  margin: 0 0 18pt 0; font-size: 8pt;
  color: var(--muted-foreground); line-height: 1.7;
}
.contact-item {
  display: inline-block; margin-right: 6pt;
  color: var(--muted-foreground); text-decoration: none; white-space: nowrap;
}
.contact-item .ic {
  display: inline-block; width: 8pt; height: 8pt; vertical-align: -1pt;
  color: var(--primary); margin-right: 2pt;
}
a { color: inherit; text-decoration: none; }
.sb-section { margin-bottom: 14pt; }
.sb-title, .main-title {
  margin: 0 0 6pt 0; font-size: 8pt; font-weight: 600;
  letter-spacing: 1.6pt; text-transform: uppercase; color: var(--primary);
}
.expertise { margin: 0; padding: 0; list-style: none; }
.expertise li { margin: 0 0 2pt 0; font-size: 9pt; color: var(--foreground); }
.chips { margin: 0; padding: 0; list-style: none; }
.chip {
  display: inline-block; background: var(--card-bg);
  border: 1px solid var(--border); border-radius: 2pt;
  padding: 1.5pt 4pt; margin: 0 2pt 2pt 0;
  font-size: 7.5pt; color: var(--foreground);
}
.edu-list { margin: 0; padding: 0; list-style: none; }
.edu { margin-bottom: 8pt; }
.edu-degree { margin: 0; font-size: 9pt; font-weight: 600; color: var(--foreground); }
.edu-school { margin: 1pt 0 0 0; font-size: 7.5pt; color: var(--muted-foreground); }
.edu-dates { margin: 1pt 0 0 0; font-size: 7.5pt; color: var(--primary); }
.links-list { margin: 0; padding: 0; list-style: none; }
.link { margin-bottom: 5pt; }
.link a { display: block; font-size: 8pt; color: var(--primary); }
.link-label { display: block; font-size: 7.5pt; color: var(--muted-foreground); margin-top: 1pt; }
.main-section { margin-bottom: 16pt; }
.summary { margin: 0; font-size: 9.5pt; line-height: 1.55; color: var(--foreground); }
.work-list { margin: 0; padding: 0; list-style: none; }
.work { margin-bottom: 12pt; page-break-inside: avoid; }
.work-head {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 12pt; margin-bottom: 2pt;
}
.work-role { margin: 0; font-size: 10.5pt; font-weight: 600; color: var(--foreground); }
.work-dates {
  font-size: 9pt; font-weight: 500; color: var(--primary); white-space: nowrap;
}
.work-company { margin: 0 0 4pt 0; font-size: 9pt; color: var(--muted-foreground); }
.company-suffix {
  font-style: italic; font-weight: 500;
  color: var(--primary); margin-left: 3pt;
}
.bullets {
  margin: 0 0 4pt 0; padding: 0 0 0 14pt; list-style: disc;
  color: var(--foreground); font-size: 9pt; line-height: 1.5;
}
.bullets li::marker { color: var(--primary); }
.bullets li { margin-bottom: 1.5pt; }
.tech { margin: 0; font-size: 8.5pt; color: var(--muted-foreground); }
.tech-label { font-weight: 600; color: var(--foreground); }
</style>
</head>
<body>
<table class="doc"><tr>
  <td class="sb-cell">
    <div class="monogram">${escape(c.monogram)}</div>
    <h1 class="name">${escape(c.name)}</h1>
    <p class="title">${escape(c.title)}</p>
    <p class="contact">${contactLine}</p>

    ${sidebarChipGroups}

    <section class="sb-section">
      <h2 class="sb-title">Education</h2>
      <ul class="edu-list">${sidebarEducation}</ul>
    </section>
  </td>

  <td class="main-cell">
    <section class="main-section">
      <h2 class="main-title">Summary</h2>
      <p class="summary">${escape(c.summary)}</p>
    </section>

    <section class="main-section">
      <h2 class="main-title">Work Experience</h2>
      <ul class="work-list">${workEntries}</ul>
    </section>
  </td>
</tr></table>
</body>
</html>`

writeFileSync(htmlPath, html)
console.log(`wrote ${htmlPath}`)

execSync(`weasyprint "${htmlPath}" "${pdfPath}"`, { stdio: "inherit" })
console.log(`wrote ${pdfPath}`)
