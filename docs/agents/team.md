# Team and areas

Who owns which part of this repo. Skills read this to label issues with an area and to assign owners.

## Areas

An **area** is a part of the product with one owner. Its label is `area:<app>` or, when an app has several owners, `area:<app>:<part>`. Every epic has exactly one area; everything under the epic inherits it.

| Area | Label | Code | Owner |
| --- | --- | --- | --- |
| Site (public pages, design system, /about, /learn, /resume, /cooking, /skills) | `area:site` | `app/` (except the areas below), `components/`, `content/` | Michael |
| Bookmarks (public archive, /admin, AI enrichment) | `area:bookmarks` | `app/bookmarks/`, `app/admin/`, `components/bookmarks/`, `lib/bookmark*`, `lib/enrichment-queue.ts`, `lib/ai-bookmark.ts` | Michael |
| Newsletter (subscribe, Beehiiv, emails) | `area:newsletter` | `app/newsletter/`, `components/subscribe-form.tsx`, `lib/subscribe-schema.ts` | Michael |

**Code** is where the area lives (a folder, or "not built yet"), so an agent can tell an issue's area from the files it touches.

Post and recipe content lives in the private `imick-io-content` repo (ADR `0001`). An issue about content goes in the area that renders it, usually `area:site`, and is `ready-for-human` when it needs Michael's writing.

## Teams

Each member: GitHub handle, then what they do. The description settles what the table can't: the default person for a team, and what they don't take.

### Michael

- **@imick-io** (Michael Boutin, owner): everything on imick.io, and the only writer of its copy and content. Default for everything.

## Assignment

The assignee means *claimed*. Initiatives and epics are assigned to the area owner's default person; `ready-for-human` work to whoever will do it; map tickets and `ready-for-agent` tickets stay unassigned until claimed.
