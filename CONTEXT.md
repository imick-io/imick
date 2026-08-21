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
Lifecycle is gated by `publishedAt` (same field as Articles, Snippets, Classes, and Folios). Future-dated Bookmarks are hidden in production and visible in `next dev`, matching the Article/Snippet rule rather than the "Coming soon" rule used for Classes. The admin list exposes three states: Draft (`publishedAt IS NULL`), Scheduled (`publishedAt > now()`), Published (`publishedAt <= now()`).
_Avoid_: Link, entry, item.

**Category**:
The single bucket a **Bookmark** belongs to. Categories live in their own DB table (`categories(slug, label)`); a bookmark's `category` column is a foreign key to `categories.slug` with `ON DELETE SET NULL`. The seed list (`dev-tools`, `libraries-frameworks`, `design`, `learning`, `ai-productivity`, `infrastructure`, `inspiration`, `community`) is a starting vocabulary, not a closed list. New categories enter the vocabulary two ways: an admin adds one inline from the bookmark editor, or **Enrichment** auto-creates one when the AI picks a category name that does not yet exist. Both the single "Generate with AI" flow and background batch Enrichment auto-create; the taxonomy is curated after the fact (the admin periodically merges near-duplicate buckets) rather than gated before creation.
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

**Enrichment**:
The automated pass that populates a **Bookmark**'s machine-derived fields: fetching link metadata (title, description, logo, image, color) and running the AI generation that fills **Category**, **Tags**, **Pros / Cons**, and **AI Summary**. Enrichment never touches **Rating** or **Review** (always human-authored). It runs from two triggers: the single "Generate with AI" button on the editor (synchronous), and background batch Enrichment after a bulk paste (a cron drainer, see ADR `0005`).
Enrichment carries its own **status** — `pending`, `running`, `done`, `failed` — tracked per Bookmark alongside an attempt counter. This status is **orthogonal to the publish lifecycle** (Draft / Scheduled / Published): a Bookmark can be a Draft that is still `pending` Enrichment, a Draft whose Enrichment is `done`, or a Draft whose Enrichment `failed`. A Bookmark is never auto-published by Enrichment; a human finishes the Draft (Rating, Review, final Category) and sets `publishedAt`.
_Avoid_: Import (that's the input step), Scrape, Processing, Sync.

**Enrichment status**:
The per-Bookmark state of its last **Enrichment** attempt: `pending` (queued, not yet started), `running` (a drainer tick is working it), `done` (completed), `failed` (errored). After a capped number of failed attempts the Bookmark is left terminally `failed` and the drainer skips it until a human hits Retry (which resets the counter). Surfaced as a badge in the admin list. Not the same as the publish lifecycle.
_Avoid_: State (overloaded), Phase.

### Recipes

**Recipe**:
A single cookable unit authored by the site owner: name, Course, Primary, Recipe Tags, time, servings, gram-based ingredients, and ordered steps. Every Recipe is browsable and filterable in one grid, whether it is served on its own or used inside another Recipe.
_Avoid_: Dish, meal.

**Component Recipe**:
A **Recipe** whose role is to be used inside other Recipes (sauces, marinades, doughs, staples: Pesto, Tzatziki, Pie Crust, Pot Pie Filling, Spaghetti Sauce). This is a role, not a separate type: a Component Recipe is still a Recipe with its own page, and can be made and served alone. Most live under the **Basics** Course.
_Avoid_: Sub-recipe, base recipe, building block.

**Complete Recipe**:
A **Recipe** you would serve as-is (Chicken Pot Pie, Fish Tacos, Greek Smash Burger). May use zero or more **Component Recipes** via its components list.
_Avoid_: Full recipe, main recipe.

**Course**:
The single browse bucket a **Recipe** belongs to: Breakfast, Mains, Sides, Dessert, Snacks, or Basics. Drives the primary filter row.
_Avoid_: Category (reserved for Bookmarks), meal type, section.

**Basics**:
The **Course** for Recipes that exist mainly to build other meals: sauces, marinades, condiments, doughs, and staples.
_Avoid_: Pantry, staples, components (that names the relationship, not the Course).

**Primary**:
The headline ingredient of a **Recipe** (Chicken, Salmon, Chickpeas), used for filtering and related-recipe scoring. When filtering, a Complete Recipe also matches on the Primary of any Component Recipe it uses.
_Avoid_: Main ingredient, protein.

**Recipe Tag** (Recipes context):
A value from the fixed recipe tag vocabulary (Meal Prep, Freezer-Friendly, Quick, ...). Distinct from the free-form **Tag** on Bookmarks.

## Relationships

### Recipes

- A **Complete Recipe** uses zero or more **Component Recipes**, referenced by slug in its components list.
- A **Component Recipe** is used in zero or more Recipes; its "Used in" view is a computed reverse lookup, not stored state.
- Filtering matches transitively: a Recipe matches an ingredient or Primary filter if the Recipe itself or any of its **Component Recipes** matches.
- A **Recipe** has exactly one **Course** and one **Primary**, and zero or more **Recipe Tags**.

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
- A **Bookmark** has exactly one **Enrichment status**, orthogonal to its Draft / Scheduled / Published lifecycle. **Enrichment** populates the machine-derived fields (metadata, **Category**, **Tags**, **Pros / Cons**, **AI Summary**) but never **Rating** or **Review**.

### Classes

- A **Class** has exactly one **Overview** and zero-or-more ordered **Modules**.
- A **Module** has zero-or-more ordered **Lessons** and zero-or-one **Kanban**.
- A **Lesson** has zero-or-one Video, exactly one **Notes** body, zero-or-one **Transcript**, and a per-learner **Completed** flag.
- A **Kanban** has zero-or-more **Tasks**.

## Flagged ambiguities

- "Review" was used informally to mean any descriptive text about a bookmark — resolved: **Review** is strictly the human prose opinion (`reviewText`); machine-generated text lives in **AI Summary**.
- Category creation was framed as human-only ("admins add inline") — resolved: **Enrichment** may auto-create a **Category** the AI picks when it doesn't exist, in both the single and batch flows. The vocabulary is curated *after* the fact (merge near-duplicates), not gated before creation.
- Enrichment "status" vs the publish lifecycle were both loosely called a bookmark's "state" — resolved: **Enrichment status** (`pending`/`running`/`done`/`failed`) is orthogonal to Draft / Scheduled / Published. A Draft can be in any Enrichment status; Enrichment never sets `publishedAt`.
- "Read me" was used at both Class and Lesson levels — resolved: Class-level prose is **Overview** (pre-enrolment orientation), Lesson-level prose is **Notes** (companion to the Video). The two are not interchangeable.
- "Section" was a tempting name for grouping Lessons — rejected: already on the Bookmarks avoid-list and triple-overloaded with HTML, routing ("the Learn section"), and Bookmarks taxonomy. Resolved to **Module**.
- **Completed** persistence model is unresolved: browser-local (no auth) vs. authenticated user account. Decision deferred — needed before any progress-tracking UI ships.
- **Kanban** interactivity model is unresolved: read-only display of suggested tasks vs. interactive board with drag/drop and saved learner state. Decision deferred — depends on the **Completed** persistence decision.
- Free vs. paid Class expression in frontmatter is unresolved (boolean flag vs. richer pricing model). Not blocking ship-1 (all current Classes are coming-soon and free is the default). See ADR `0001` for the storage boundary that makes paid Classes possible.
