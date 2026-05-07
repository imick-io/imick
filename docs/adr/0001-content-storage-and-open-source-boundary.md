# Content storage and open-source boundary

The repository is open-sourced as a credibility signal for recruiters (per `_briefs/imick-io-brief.md`). Phase 1 content is free, but **Classes** are expected to include paid material in a later phase. Paid MDX in a public repo defeats any application-level paywall, since visitors can read the source on GitHub.

We are separating **platform code** (open source, public) from **content** (private). The public repo will keep `app/`, `components/`, `lib/`, schemas, and infrastructure. All MDX content (`content/posts/`, `content/snippets/`, and the new `content/classes/`) moves to a private location before any Class MDX lands. This keeps the OSS credibility signal intact (the platform is the engineering artefact) while making future paid Classes truly gateable.

## Considered options

- **Public MDX, app-level paywall.** Rejected: paywall is theatre when the source is public.
- **Public free, private/DB paid (split content model).** Rejected: maintaining two content pipelines forever for a single shared concept (a Class) outweighs the small wins.
- **All content in Neon (DB).** Rejected: loses MDX authoring DX (`content-collections`, frontmatter, draft preview in `next dev`). Bookmarks belong in a DB because they are catalog-shaped; long-form content is not.
- **Third-party course platform (Teachable, Maven) for paid Classes.** Reasonable fallback if the private-content pipeline turns out heavier than expected. Trades brand cohesion for less infrastructure.

## Storage mechanism

Private content lives in a separate private GitHub repo (working name: `imick-io-content`). The public repo gitignores `content/` and populates it at build time via a prebuild script that clones the private repo using a deploy key. Local dev uses the same script (or a one-time clone) to hydrate `content/`.

Submodules were rejected because their UX rough edges (detached HEAD, out-of-sync states, separate commits) bite solo authors and confuse AI agents working in the repo. A runtime fetch (S3, Vercel Blob, KV) was rejected because it would lose `content-collections`'s build-time benefits and the static-generation model the rest of the site relies on.

## Consequences

- The public repo stops being a clone-and-run portfolio: a contributor cloning it gets the platform but no posts. README must explain this clearly.
- Build pipeline (Vercel) needs a deploy key or GitHub App with read access to `imick-io-content`.
- Local dev workflow gains a step (run the fetch script or clone the content repo manually).
- The `content/` migration touches existing articles and snippets, not just the new Classes work.
- Free Classes still benefit from this split: paid/free becomes a frontmatter flag rather than a cross-cutting structural decision.
- `content-collections.ts` keeps reading from `content/`, unchanged. The privacy boundary is invisible to the runtime.
