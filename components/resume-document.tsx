import { getResumeData } from "@/lib/resume-data"
import type {
  ResumeData,
  ResumeEngagement,
  ResumeExperience,
} from "@/lib/resume-data"
import type { Education } from "@/lib/data/education"
import type { StackGroup } from "@/lib/stack-grouped"

function formatMonth(value: string) {
  const [year, month] = value.split("-")
  if (!year || !month) return value
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleString("en-US", { month: "short", year: "numeric" })
}

function formatRange(startDate: string, endDate?: string, current?: boolean) {
  const start = formatMonth(startDate)
  const end = current ? "Present" : endDate ? formatMonth(endDate) : "Present"
  return `${start} to ${end}`
}

function formatYearRange(startYear: number, endYear?: number) {
  return endYear ? `${startYear} to ${endYear}` : `${startYear} to Present`
}

export function ResumeDocument() {
  const data = getResumeData()
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 text-sm leading-relaxed text-foreground print:max-w-none print:px-0 print:py-0 print:text-[10pt] print:text-black">
      <Header header={data.header} />
      <Bio text={data.bio} />
      <Section title="Experience">
        <div className="flex flex-col gap-5">
          {data.experience.map((entry) => (
            <ExperienceEntry key={entry.company} entry={entry} />
          ))}
        </div>
      </Section>
      <Section title="Education">
        <div className="flex flex-col gap-2">
          {data.education.map((entry) => (
            <EducationEntry key={entry.institution} entry={entry} />
          ))}
        </div>
      </Section>
      <Section title="Skills">
        <SkillsList groups={data.skills} />
      </Section>
    </article>
  )
}

function Header({ header }: { header: ResumeData["header"] }) {
  return (
    <header className="mb-6 flex flex-col gap-1 print:mb-4">
      <h1 className="text-3xl font-semibold text-foreground print:text-[18pt] print:text-black">
        {header.name}
      </h1>
      <p className="text-base text-muted-foreground print:text-[11pt] print:text-black">
        {header.role}
      </p>
      <p className="text-xs text-muted-foreground print:text-[9pt] print:text-black">
        {header.email} · {header.linkedin.display} · {header.github.display} ·{" "}
        {header.website} · {header.location}
      </p>
    </header>
  )
}

function Bio({ text }: { text: string }) {
  return (
    <section className="mb-6 print:mb-4">
      <p className="text-foreground print:text-black">{text}</p>
    </section>
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
    <section className="mb-6 print:mb-4">
      <h2 className="mb-2 border-b border-border pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground print:text-[9pt] print:text-black">
        {title}
      </h2>
      {children}
    </section>
  )
}

function ExperienceEntry({ entry }: { entry: ResumeExperience }) {
  return (
    <div className="flex flex-col gap-1.5 print:break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-base font-semibold text-foreground print:text-[11pt] print:text-black">
          {entry.role}
          <span className="font-normal text-muted-foreground print:text-black">
            {" "}at {entry.company}
            {entry.via ? (
              <span className="italic"> (via {entry.via.name})</span>
            ) : null}
          </span>
        </h3>
        <span className="text-xs text-muted-foreground print:text-[9pt] print:text-black">
          {formatRange(entry.startDate, entry.endDate, entry.current)}
        </span>
      </div>
      {entry.outcome ? (
        <p className="text-xs font-medium text-muted-foreground print:text-[9pt] print:text-black">
          {entry.outcome}
        </p>
      ) : null}
      <p className="text-foreground print:text-black">{entry.description}</p>
      {entry.highlights.length > 0 ? (
        <ul className="ml-5 list-disc text-foreground print:text-black">
          {entry.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      ) : null}
      {entry.engagements && entry.engagements.length > 0 ? (
        <div className="mt-2 flex flex-col gap-3 border-l border-border pl-4">
          {entry.engagements.map((eng) => (
            <EngagementEntry key={eng.name} engagement={eng} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function EngagementEntry({ engagement }: { engagement: ResumeEngagement }) {
  return (
    <div className="flex flex-col gap-1 print:break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h4 className="text-sm font-semibold text-foreground print:text-[10pt] print:text-black">
          {engagement.role}
          <span className="font-normal text-muted-foreground print:text-black">
            {" "}at {engagement.name}
          </span>
        </h4>
        <span className="text-xs text-muted-foreground print:text-[9pt] print:text-black">
          {formatRange(engagement.startDate, engagement.endDate, engagement.current)}
        </span>
      </div>
      {engagement.outcome ? (
        <p className="text-xs font-medium text-muted-foreground print:text-[9pt] print:text-black">
          {engagement.outcome}
        </p>
      ) : null}
      {engagement.summary ? (
        <p className="text-foreground print:text-black">{engagement.summary}</p>
      ) : null}
      {engagement.highlights && engagement.highlights.length > 0 ? (
        <ul className="ml-5 list-disc text-foreground print:text-black">
          {engagement.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      ) : null}
      {engagement.tech && engagement.tech.length > 0 ? (
        <p className="text-xs text-muted-foreground print:text-[9pt] print:text-black">
          {engagement.tech.join(", ")}
        </p>
      ) : null}
    </div>
  )
}

function EducationEntry({ entry }: { entry: Education }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 print:break-inside-avoid">
      <p className="text-foreground print:text-black">
        <span className="font-semibold">{entry.degree}</span>
        {entry.field ? `, ${entry.field}` : ""}
        <span className="text-muted-foreground print:text-black">
          {" "}at {entry.institution}
        </span>
      </p>
      <span className="text-xs text-muted-foreground print:text-[9pt] print:text-black">
        {formatYearRange(entry.startYear, entry.endYear)}
      </span>
    </div>
  )
}

function SkillsList({ groups }: { groups: StackGroup[] }) {
  return (
    <div className="flex flex-col gap-1">
      {groups.map((group) => (
        <p key={group.category} className="text-foreground print:text-black">
          <span className="font-semibold">{group.label}:</span>{" "}
          {group.items.map((item) => item.name).join(", ")}
        </p>
      ))}
    </div>
  )
}
