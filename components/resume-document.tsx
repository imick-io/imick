import { HugeiconsIcon } from "@hugeicons/react"
import { Linkedin01Icon, Location01Icon, GlobeIcon } from "@hugeicons/core-free-icons"
import { resumeContent } from "@/lib/resume-content"
import type {
  ResumeContent,
  ResumeEducation,
  ResumeWorkEntry,
} from "@/lib/resume-content"

const PAPER_TINT_CLASS = "[print-color-adjust:exact] [-webkit-print-color-adjust:exact]"

export function ResumeDocument() {
  return (
    <article
      className={`mx-auto grid w-full max-w-5xl grid-cols-[280px_1fr] overflow-hidden rounded-lg bg-card text-foreground shadow-sm ring-1 ring-border print:max-w-none print:rounded-none print:shadow-none print:ring-0 ${PAPER_TINT_CLASS}`}
    >
      <Sidebar content={resumeContent} />
      <Main content={resumeContent} />
    </article>
  )
}

function Sidebar({ content }: { content: ResumeContent }) {
  return (
    <aside
      className={`flex flex-col gap-6 bg-muted px-7 py-8 print:bg-muted ${PAPER_TINT_CLASS}`}
    >
      <Monogram letters={content.monogram} />
      <HeaderBlock
        name={content.name}
        title={content.title}
        location={content.location}
        contactLinks={content.contactLinks}
      />
      {content.chipGroups.map((group) => (
        <SidebarSection key={group.label} title={group.label}>
          <ChipList items={group.items} />
        </SidebarSection>
      ))}
      <SidebarSection title="Education">
        <ul className="flex flex-col gap-3">
          {content.education.map((edu) => (
            <EducationEntry key={edu.degree} entry={edu} />
          ))}
        </ul>
      </SidebarSection>
    </aside>
  )
}

function Monogram({ letters }: { letters: string }) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-background print:bg-foreground ${PAPER_TINT_CLASS}`}
      aria-hidden
    >
      <span className="text-base font-semibold tracking-tight">{letters}</span>
    </div>
  )
}

function HeaderBlock({
  name,
  title,
  location,
  contactLinks,
}: {
  name: string
  title: string
  location: string
  contactLinks: ResumeContent["contactLinks"]
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold leading-tight text-foreground">{name}</h1>
      <p className="text-[11.5px] text-foreground">{title}</p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <HugeiconsIcon icon={Location01Icon} size={11} className="text-primary" />
          {location}
        </span>
        {contactLinks.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          >
            <HugeiconsIcon
              icon={c.kind === "linkedin" ? Linkedin01Icon : GlobeIcon}
              size={11}
              className="text-primary"
            />
            {c.label}
          </a>
        ))}
      </div>
    </div>
  )
}

function SidebarSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  )
}

function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {items.map((item) => (
        <li
          key={item}
          className={`inline-flex items-center rounded-sm bg-card px-1.5 py-0.5 text-[10.5px] text-foreground ring-1 ring-border print:bg-card ${PAPER_TINT_CLASS}`}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function EducationEntry({ entry }: { entry: ResumeEducation }) {
  return (
    <li className="flex flex-col gap-0.5">
      <p className="text-[11.5px] font-semibold text-foreground">{entry.degree}</p>
      <p className="text-[10.5px] text-muted-foreground">
        {entry.institution}, {entry.location}
      </p>
      <p className="text-[10.5px] text-primary">{entry.dates}</p>
    </li>
  )
}

function Main({ content }: { content: ResumeContent }) {
  return (
    <main className="flex flex-col gap-6 bg-card px-8 py-8 print:gap-5 print:bg-card print:px-6 print:py-6">
      <Section title="Summary">
        <p className="text-[11.5px] leading-relaxed text-foreground">{content.summary}</p>
      </Section>
      <Section title="Work Experience">
        <ol className="flex flex-col gap-4">
          {content.workExperience.map((entry, i) => (
            <WorkEntry key={`${entry.company}-${i}`} entry={entry} />
          ))}
        </ol>
      </Section>
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary">
      {children}
    </h2>
  )
}

function WorkEntry({ entry }: { entry: ResumeWorkEntry }) {
  return (
    <li className="flex flex-col gap-1 print:break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h3 className="text-[12.5px] font-semibold text-foreground">{entry.role}</h3>
        <span className="text-[11px] font-medium text-primary">{entry.dates}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {entry.company}
        {entry.companySuffix ? (
          <span className="ml-2 text-[11px] font-medium italic text-primary">
            {entry.companySuffix}
          </span>
        ) : null}
      </p>
      <ul className="ml-3.5 mt-1 flex list-disc flex-col gap-0.5 text-[11px] leading-relaxed text-foreground marker:text-primary">
        {entry.bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>
      <p className="mt-1 text-[10.5px] text-muted-foreground">
        <span className="font-semibold text-foreground">Tech: </span>
        {entry.tech.join(", ")}
      </p>
    </li>
  )
}
