# Folio membership boundary

A **Folio** is a curated, ordered grouping of existing content. This ADR records which content types a Folio may contain and why.

## Decision

A Folio's `items` array accepts only `type: "article"` and `type: "snippet"`. Classes and Bookmarks are excluded.

## Rationale

**Classes excluded.** A Class is a structured, multi-part course with its own internal sequencing (Modules, Lessons, progress tracking). Wrapping a Class inside a Folio conflates two ordering systems: the Folio's item order and the Class's internal Module/Lesson order. When an Article naturally leads into a Class, the Class **Overview** already serves as the entry point and can link back to the primer Article. Folios solve the "these standalone pieces belong together" problem; Classes already solve the "these pieces are a structured course" problem.

**Bookmarks excluded.** Bookmarks are catalog entries (tool/library/resource links with metadata), not authored prose. A Folio's editorial framing ("read these in this order, here is why") does not apply to a tool recommendation. Mixing Bookmarks into a Folio would muddy the content type: is this a reading list or a tool list? Bookmarks have their own category and tag taxonomy for discovery.

## Consequences

- Folio frontmatter schema enforces `type: z.enum(["article", "snippet"])` on each item. Adding a new type requires a schema migration and a revisit of this ADR.
- The `type: "article"` value in frontmatter maps to the internally-named `posts` collection. This translation lives in the validation layer.
- If a future need arises for "curated tool lists," it should be a separate content type, not a Folio variant.
