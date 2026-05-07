# imick.io

Personal site, blog, and curated bookmark stack. This file captures the domain language so AI agents and future-you don't conflate concepts that look similar but mean different things.

## Language

### Classes

**Class**:
A structured course on a single topic, authored by the site owner. A Class is composed of an **Overview** plus an ordered list of **Modules**. Distinct from an **Article** (single-shot post) and a **Snippet** (copy-pastable code) by being long-form, multi-part, and progress-tracked. A Class may be free or paid.
Lifecycle is gated by `publishedAt` (same field as Articles and Snippets), but the **listing render rule differs**: future-dated Classes appear on the listing as "Coming soon" cards, whereas future-dated Articles and Snippets are hidden. This is intentional. Classes are deliberately announced before launch; Articles and Snippets are not.
_Avoid_: Course (we may say "course" in marketing copy, but the canonical term in code, schema, and URLs is **Class**), Tutorial.

**Overview**:
The Class-level prose: pitch, prerequisites, who it's for, what you'll build, how it's structured. Read _before_ starting the Class. Exactly one per **Class**.
_Avoid_: Read me, Description, Intro, Syllabus.

**Module**:
An ordered grouping of **Lessons** inside a **Class**. The hierarchy is Class > Module > Lesson. Each Module is followed by a **Kanban** of hands-on **Tasks**.
_Avoid_: Section (already on the Bookmarks avoid-list and overloaded with HTML semantics), Chapter, Unit, Group, Part.

**Lesson**:
A single learning unit inside a **Module**. Has a Video, **Notes**, a Transcript, and a per-learner Completed flag.
_Avoid_: Episode.

**Notes**:
The Lesson-level prose: companion text to the Video, including setup steps, code references, key takeaways, and exercises. Read _alongside_ watching. Exactly one per **Lesson**.
_Avoid_: Read me, Description, Body.

**Transcript**:
The text-form record of a Lesson's Video.

**Completed**:
A per-learner, per-Lesson completion flag. Persistence model not yet decided (see Flagged ambiguities).

**Kanban**:
A board of hands-on **Tasks** that follows each **Module**, simulating a real-world workflow. Interactivity model not yet decided (see Flagged ambiguities).

**Task** (Class context):
A work item on a Module's **Kanban**, framed as the kind of ticket a developer would pick up in a real sprint applied to the Module's subject. Distinct from any unrelated future use of "Task."

### Folios

**Folio**:
A curated, ordered grouping of existing **Articles** and/or **Snippets**, authored as MDX. A Folio surfaces a throughline across standalone pieces that were published independently. Items are listed in an explicit order in frontmatter; the MDX body is the **Preface**. An item may belong to many Folios. Membership is restricted to Articles and Snippets only (no Classes, no Bookmarks) per ADR `0003-folio-membership-boundary`.
Lifecycle follows the Article model: future-dated Folios are hidden in production and visible in `next dev`. Renders at `/learn/folios` (listing) and `/learn/folios/[slug]` (detail).
_Avoid_: Playlist, Series, Collection, Reading list, Group, Bundle.

**Preface**:
The Folio-level prose: editorial framing that explains why these items, in this order, and what the throughline is. Read _before_ working through the Folio's items. Exactly one per **Folio**, stored as the MDX body.
_Avoid_: Read me, Overview (reserved for Classes), Intro, Foreword, Notes (reserved for Lessons).

### Bookmarks

**Bookmark**:
A saved tool, library, site, or resource that the site owner finds useful, with optional human opinion.
_Avoid_: Link, entry, item.

**Category**:
The single closed-list bucket a **Bookmark** belongs to (one of `dev-tools`, `libraries-frameworks`, `design`, `learning`, `ai-productivity`, `infrastructure`, `inspiration`, `community`).
_Avoid_: Section, group.

**Tag**:
A free-form keyword on a **Bookmark**. A bookmark may have many; tags are not the same as **Category**.

**Pros / Cons**:
Neutral, factual bullets describing a tool's strengths and weaknesses, derived from the tool itself (its docs, marketing, public reputation). Stored as `text[]` arrays (one bullet per element), not free prose. Not a personal verdict.

**Rating**:
The site owner's personal 1–5 score of a **Bookmark**. Always human-authored — never AI-generated.

**Review** (a.k.a. `reviewText`):
The site owner's personal prose opinion of a **Bookmark**, in his own voice, based on actual use. Always human-authored — never AI-generated.
_Avoid_: Description, summary, blurb.

**AI Summary**:
A neutral, model-generated description of what a tool *is* and *does*, sourced from the tool's own page. Stored in a separate field from **Review** and visibly labeled as machine-generated when displayed publicly.
_Avoid_: Review, opinion, take.

## Relationships

### Folios

- A **Folio** contains two or more ordered **items**, each referencing an **Article** or **Snippet** by `(type, slug)`.
- A **Folio** has exactly one **Preface** (the MDX body).
- An **Article** or **Snippet** may belong to zero or more **Folios**.
- A **Folio** does not contain **Classes** or **Bookmarks** (see ADR `0003`).

### Bookmarks

- A **Bookmark** has exactly one **Category** and zero-or-more **Tags**.
- A **Bookmark** has zero-or-one **Rating** and zero-or-one **Review** — both human-authored.
- A **Bookmark** has zero-or-one **AI Summary** — machine-authored, distinct from **Review**.
- **Pros** and **Cons** describe the tool neutrally; **Review** + **Rating** carry the human verdict.

### Classes

- A **Class** has exactly one **Overview** and zero-or-more ordered **Modules**.
- A **Module** has zero-or-more ordered **Lessons** and zero-or-one **Kanban**.
- A **Lesson** has zero-or-one Video, exactly one **Notes** body, zero-or-one **Transcript**, and a per-learner **Completed** flag.
- A **Kanban** has zero-or-more **Tasks**.

## Flagged ambiguities

- "Review" was used informally to mean any descriptive text about a bookmark — resolved: **Review** is strictly the human prose opinion (`reviewText`); machine-generated text lives in **AI Summary**.
- "Read me" was used at both Class and Lesson levels — resolved: Class-level prose is **Overview** (pre-enrolment orientation), Lesson-level prose is **Notes** (companion to the Video). The two are not interchangeable.
- "Section" was a tempting name for grouping Lessons — rejected: already on the Bookmarks avoid-list and triple-overloaded with HTML, routing ("the Learn section"), and Bookmarks taxonomy. Resolved to **Module**.
- **Completed** persistence model is unresolved: browser-local (no auth) vs. authenticated user account. Decision deferred — needed before any progress-tracking UI ships.
- **Kanban** interactivity model is unresolved: read-only display of suggested tasks vs. interactive board with drag/drop and saved learner state. Decision deferred — depends on the **Completed** persistence decision.
- Free vs. paid Class expression in frontmatter is unresolved (boolean flag vs. richer pricing model). Not blocking ship-1 (all current Classes are coming-soon and free is the default). See ADR `0001` for the storage boundary that makes paid Classes possible.
