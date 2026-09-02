# Catalogue audit against "building products with AI, cost effectively"

Research for issue [#55](https://github.com/imick-io/imick/issues/55). Fact-finding only. No recommendation is made here.

**Sources.** Every file read directly from the private content repo at `/Users/imickmac/Development/Projects/imick-io-content` (`posts/`, `snippets/`, `folios/`, `_drafts/`), plus the supporting private directories (`_marketing/`, `_business-ideas/`, `_other/`) for context. Mirror behaviour confirmed against `scripts/fetch-content.mts` in this repo. Audit date 2026-09-02.

## What is actually on disk

| Directory | Files | Mirrored to the site? |
| --- | --- | --- |
| `posts/` | 6 | yes |
| `snippets/` | 5 | yes |
| `folios/` | 1 | yes |
| `classes/` | 0 (documented in the content README, directory does not exist) | yes, if it existed |
| `recipes/` | 29 | yes |
| `_drafts/` | 1 | no |
| `_business-ideas/` | 5 | no |
| `_marketing/` | 3 | no |
| `_other/` | 2 | no |

`scripts/fetch-content.mts` line 33 sets `SUBDIRS = ["posts", "snippets", "folios", "classes", "recipes"]`. Everything with a leading underscore is private to the content repo by construction.

The editorial catalogue is 12 published pieces. The recipe collection alone is more than twice its size by file count.

## Per-piece verdict

Verdicts are scored against the three legs of the direction: **products** (is a product being built), **AI** (is AI the subject, not the backdrop), **cost** (is cost-effectiveness in play).

| Piece | Type | Published | Products | AI | Cost | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| `build-products-become-unstoppable` | post | 2026-06-02 | yes | premise only | yes | **On-message.** The closest thing to a manifesto for the new direction. |
| `your-personal-gitignore` | post | 2026-06-10 | no | yes | no | **Partially on-message.** The only piece where AI tooling is the actual motivation. |
| `shadcn-components-are-yours` | post | 2026-06-04 | yes | no | indirect | **Adjacent.** Ownership and maintenance cost, zero AI. |
| `shadcn-init-preset` | snippet | 2026-05-06 | no | no | no | **Off-message.** Tooling utility. |
| `usd-to-cad-norberts-gambit` | post | 2026-07-24 | no | no | yes, wrong kind | **Off-message.** Cost-effectiveness of an FX transfer, not of building. Anchored to the old contractor identity. |
| `hello-imick-io` | post | 2026-05-24 | no | as threat | no | **Off-message, and explicitly the old direction.** The interview funnel stated out loud. |
| `what-is-homebrew` | post | 2026-05-11 | no | no | no | **Off-message.** Beginner macOS tooling explainer. |
| `git-untrack-tracked-file` | snippet | 2026-05-06 | no | no | no | **Off-message.** Generic git hygiene. |
| `git-change-remote-url` | snippet | 2026-05-10 | no | no | no | **Off-message.** Generic git hygiene. |
| `git-delete-branches` | snippet | 2026-05-10 | no | no | no | **Off-message.** Generic git hygiene. |
| `git-remove-node-modules` | snippet | 2026-05-10 | no | no | no | **Off-message.** Generic git hygiene. |
| `dummy-shadcn-sanity` | folio | 2026-06-04 | no | no | no | **Not editorial content.** A pipeline test fixture that is live in production. |
| `_drafts/mail-sysadmin.md` | draft | never | no | no | no | **Off-message for both directions.** Agency sysadmin runbook. |

Score: **1 of 12 published pieces sits inside the direction. 1 more is partially inside. 1 is adjacent. 8 are off-message. 1 is a test fixture.**

### Notes on the three that matter

**`build-products-become-unstoppable`** is the only piece that hits all three legs at once, and it hits the cost leg explicitly and repeatedly: "Use open source whenever possible, especially in the early stages when simplicity, ownership, and low costs matter most" (line 50), and Coolify justified as deploying "without creating a new paid platform account every time you have an idea" (line 108). Postgres, Better Auth, Docker, Linux and Coolify are all chosen for being open source and self-hostable.

But there is a hole in it. The word "AI" appears ten times and every one is framing, never practice. Lines 24, 42, 48, 50 and 212 are all "AI changes things, you still need to steer it." There is not one paragraph on how he actually works with a model, no tool named, no workflow shown, no cost figure. The word "LLM" never appears in the file. The learning path is 15 items long and item 15 is Next.js. Nothing in the list is about agents, context, evals, or model spend. It is a stack curriculum with an AI preamble.

**`your-personal-gitignore`** is nominally about `.git/info/exclude`, but the entire motivation is AI tooling: Matt Pocock's Claude skills, `.claude/`, `CLAUDE.md`, `CONTEXT.md`, and the closing line "Now that AI tooling is a personal decision more than a team decision, that file deserves to come out of obscurity." It is the only published piece where an AI workflow is treated as a real, daily, opinionated thing. It is also framed around joining someone else's team.

**`hello-imick-io`** is the old direction in plain text and worth quoting because it is the thesis the site is moving away from: "A recruiter cannot infer competence from a resume anymore." "The bottleneck is not skill, it is exposure." "Personal brand used to be a nice-to-have for developers. Now it is one of the few things that makes you worth hiring over a model." The learning-in-public argument inside it survives a repositioning. The stated reason for it does not.

### The evidence gap on "cost effectively"

No published piece contains a cost figure for building anything. No token price, no model subscription, no VPS bill, no "this product cost me $X to run." The single dollar-denominated piece in the catalogue is a personal FX transfer (`usd-to-cad`, about $21 in fees). The cost-effectiveness leg of the new direction currently has one sentence of published support, line 50 of `build-products-become-unstoppable`.

No published piece shows a product being built either. There is no build log, no shipped thing, no screenshot, no repository linked. The only artifact of the platform itself is a folio labelled "dummy."

`grep -ril comfy` across `posts/ snippets/ folios/ _drafts/` returns nothing. The ComfyUI context is entirely absent from published work. The only employer named anywhere is Toptal, in the FX post.

## The reader the catalogue implicitly addresses

Judged from what gets explained versus what gets assumed, the catalogue is written for **a working web developer, roughly three or more years in, fluent in TypeScript, React and Next.js, comfortable in a terminal, and not a specialist in infrastructure, ops, or money.** The line is remarkably consistent: anything inside the JavaScript application layer is assumed, anything outside it is explained from zero.

**Explained from zero:**

- `what-is-homebrew` defines what a package manager is, then formulas, bottles, the prefix, the Cellar, symlinks, casks and taps. It explains that `/opt/homebrew/bin/node` is a symlink pointing to the current version.
- `git-untrack-tracked-file` and `git-remove-node-modules` both explain, separately, that adding a path to `.gitignore` does not untrack files git already knows about, and both spell out that teammates who pull will see the file disappear.
- `your-personal-gitignore` enumerates git's three ignore locations as a numbered list.
- `usd-to-cad` walks the Wealthsimple flow click by click, including "on the security page, select Journal" and "this is self-serve on the web (not in the app)."
- `build-products-become-unstoppable` explains that you need somewhere to save data, that users come after data, and that backups are "not optional."

**Assumed without a gloss:**

- `shadcn-components-are-yours` never defines shadcn. It assumes Radix, `react-day-picker`, compound components, `buttonVariants()`, variant APIs, third-party registries, and that a designer hands you Figma files. It uses "three-way diff in your head" as a casual instruction.
- `your-personal-gitignore` assumes you know Claude Code, what a "skill" is, what `CLAUDE.md` and `CONTEXT.md` are for, and who Matt Pocock is. None of the four is introduced.
- `build-products-become-unstoppable` name-drops BullMQ, Inngest, Trigger.dev, dead-letter queues, ECS, Fargate, VPC, IAM, Coolify and Better Auth without defining any of them.
- `usd-to-cad` assumes brokerage accounts, cash ETFs, dual-listed securities, bid-ask spread and share journaling.

**Second signal: the reader is assumed to have a job.** Three of six posts are framed around employment rather than around a product the reader owns. `your-personal-gitignore` opens "I just joined a new team" and the whole problem is not imposing your tooling on colleagues. `hello-imick-io` is about being hireable. `usd-to-cad` is about routing a contractor payout. Only `build-products-become-unstoppable` addresses somebody building for themselves, and it is written in the future tense, as a path he is about to walk rather than one he has walked.

**Third signal: the narrator is a peer at the reader's own moment, never an authority ahead of them.** "This time I stopped and asked a question I had never actually answered" (`what-is-homebrew`). "The version of this article I almost wrote was 'do not touch shadcn components.' That version was wrong" (`shadcn-components-are-yours`). "Then I ran a little experiment with $100" (`usd-to-cad`). This is a consistent and distinctive voice, and it is an asset. It also means nothing in the catalogue carries authority earned from doing the thing at volume, which is exactly the kind of credibility a full-time ComfyUI engagement would supply and that the catalogue currently never draws on.

**The exception that breaks the reader model.** The four git snippets and `what-is-homebrew` address a much earlier-stage reader than the opinion posts do, or no reader at all beyond a search engine. A developer who can follow the shadcn post already knows `git remote set-url`. The catalogue is serving two different readers and the volume sits with the junior one.

## What is drafted but unpublished

This is the thinnest part of the answer, and that is itself the finding.

**There is exactly one file in `_drafts/`: `mail-sysadmin.md`.** It covers SPF, DKIM and DMARC for Google Workspace, then MTA-STS hosting on Vercel, then BIMI, then domain reputation tools. It references `concreo.io`, the agency, in a live DMARC record. It is not written in the site's voice: it contains passages that read as a pasted assistant transcript, including a paragraph that opens "No, you don't need two separate Next.js projects," answering a question that does not appear in the document, and a closing "That's it!" It points at neither direction. It is agency operations material, not editorial.

**There are no pipeline drafts.** The content README defines a draft as any file with no `publishedAt` or a future-dated one. Every file in `posts/`, `snippets/` and `folios/` has a `publishedAt` in the past. Nothing is queued.

**`classes/` does not exist.** The content README documents the format in detail and `fetch-content.mts` mirrors the directory, but zero classes have been written. The marketing plan's weeks 7 to 12 are built around naming and outlining a class.

**The real unpublished writing lives in `_business-ideas/`,** five files, and it points more clearly at the new direction than anything published does:

| Idea | Shape | Direction signal |
| --- | --- | --- |
| `masterize` | AI-first bookkeeping for 2 to 20 person Canadian SMBs | AI as product, not as backdrop. Closest to the new direction of anything written. |
| `wtrmelon` | Open-source household finance tracker, self-hosted with a managed tier | Open source and ownership, the cost leg. |
| `ledger` | Free Splitwise alternative, explicitly anti-paywall | Cost as the wedge. |
| `low-beta-daily-edge` | Personal swing-trading system, own capital | Money, personal, off the product line. |
| `restaurant-map-guide` | Montreal restaurant guide | Personality project. Off-message. |

Three of the five are money products. One is explicitly AI-first. Four of five are "build it yourself, cheaply, open source where practical." None has been turned into an article. They are the strongest raw material in the repo for the new direction and none of it is public.

**`_other/job-desc_agentic-product-dev.md`** is a saved Senior Full Stack AI Engineer job description. It is an artifact of the old direction: a job posting collected as a target. It also describes almost exactly the work shape the ComfyUI engagement represents.

## Recurring subjects and one-offs

### Recurring, by volume

1. **Git.** Four of five snippets, plus `your-personal-gitignore`, plus item 1 of the learning path. Six of twelve published pieces touch git. It is the de facto pillar of the catalogue by count, and it is the pillar with the weakest connection to the new direction.
2. **shadcn and component architecture.** The post, the `shadcn-init-preset` snippet, and the only folio. Three pieces, coherent enough that the single folio was assembled from them.
3. **Ownership.** Not a topic, a through-line, and the strongest one in the repo. "Treat `components/ui/` as your owned source code. Not a fork." "The files are mine, the clone is mine, the exclude is mine." "Use open source whenever possible ... simplicity, ownership, and low costs." "The moment I install a fancy button from a third-party registry, that file is mine." It runs into the business ideas too (`wtrmelon` as open source, `ledger` as anti-paywall). It is never named as a subject anywhere.
4. **AI and agentic development.** Three touches, never as a subject. Premise in `build-products-become-unstoppable`, motivation in `your-personal-gitignore`, employability threat in `hello-imick-io`. The marketing plan calls this "the strongest pillar, biggest current audience, and you have real material." The published catalogue does not support that claim.

### Appears once and never returns

- **Personal finance and FX** (`usd-to-cad`). One post, despite three of five business ideas being money products.
- **macOS environment setup** (`what-is-homebrew`). One post at that explanatory level.
- **Meta and career** (`hello-imick-io`). One post about the site itself.
- **Infrastructure and self-hosting.** This is the largest promised body of work in the catalogue and it produced nothing. Eleven of the fifteen items in `build-products-become-unstoppable` are infrastructure: Postgres, auth, Docker, Linux, Coolify, backups, CI/CD, S3, Cloudflare, queues, observability, security, AWS. Three months on, not one follow-up piece exists. A curriculum was announced and never started.
- **Email and DNS deliverability** (`_drafts/mail-sysadmin`). One document, unpublished.
- **Recipes.** Twenty-nine files, published, larger than the whole editorial catalogue. The marketing plan already fences them off: "Recipes stay published but stay out of the marketing loop, except as an occasional personality post. They are not the business."

### Cadence

Publication dates: 2026-05-06, 05-06, 05-10, 05-10, 05-10, 05-11, 05-24, 06-02, 06-04, 06-04, 06-10, then a six-week gap, then 07-24. Nothing since. The last published piece is 40 days old as of this audit. The marketing plan, written 2026-08-25, asks for one article every Thursday starting the week of 08-24. Zero have shipped.

### The plan's pillars versus the catalogue's volume

The marketing plan names five pillars in priority order. Catalogue coverage runs close to the inverse.

| Plan pillar | Plan priority | Published pieces |
| --- | --- | --- |
| Agentic development in practice | 1, "strongest pillar" | 1 partial (`your-personal-gitignore`) |
| Building the platform | 2 | 1 post, 1 snippet, 1 dummy folio |
| Developer environment and tooling | 3 | 5 (four git snippets, Homebrew) |
| Money for builders | 4 | 1 (`usd-to-cad`) |
| Building in public | 5 | 1 (`hello-imick-io`), and it argues for hireability, not building |

The best-covered pillar is the third-priority one and the one furthest from the new direction. The stated strongest pillar has a single partial piece behind it.
