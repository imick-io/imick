# imick.io is a person-led audience site, not a niche

imick.io shipped as the top of a contracts-primary funnel: a portfolio whose job was getting its owner into interview rooms, with a locked headline, a locked capability ordering, and an explicit constraint that AI was not the headline. That framing is superseded. This ADR records what the site is now, because the result looks like an unfocused personal blog to anyone who does not know the reasoning, and that appearance is deliberate.

Charted and decided across [Map: imick.io content direction](https://github.com/imick-io/imick/issues/54).

## Decision

**The site's job is audience building, and the through-line is the person, not a topic.**

1. **Five subjects, no niche.** The site covers AI, career, product development, cooking, and bookmarks, because those are the things its owner actually does. Cooking and bookmarks are first-class, not a personal corner fenced off from the real content.
2. **Nothing is refused on subject.** There are no anti-topics. Opinion pieces with no repo, no number, and no artifact behind them are explicitly allowed. A window into who someone is includes what they think.
3. **Evidence is a standard, not a gate.** When a piece is about something built, it carries the real thing: the repo, the bill, the number, the outcome. This is what keeps the technical writing out of the unfalsifiable-advice category the field is full of. It is not a condition of publishing.
4. **The Reader is a working developer**, roughly three or more years in, employed, building something of their own; secondarily the technical founder they become. The register is peer, never guide, with authority carried by the artifact rather than by the narrator. See `CONTEXT.md` for **Reader** and **Buyer**.
5. **Articles are the load-bearing format**, published weekly. Every other format (snippets, folios, recipes, bookmarks, classes, video) ships in addition, never instead. Classes stay dormant with their machinery intact. Video is intent with no start date.
6. **"Build products with AI, cost effectively" is demoted** from the site's positioning to one subject inside product development.

## Rationale

**Why not a niche.** The niche was charted first and rejected by the site's owner mid-map: "I don't want to be super niche. I do this for myself as well. If someone follows me, it's because they want to know more about me and the person I am." Breadth is not a failure to focus here; it is the product.

**Why the bar is a standard rather than a gate.** An earlier round of the same map locked the opposite (every piece carries evidence, no exceptions) and it was reversed once the owner described wanting to publish opinion with nothing behind it. Both positions were held deliberately, and the reversal is recorded rather than smoothed over: a gate would have made the site a portfolio of proofs, which is a different site than the one wanted.

**Why evidence survives at all.** The catalogue audit found zero cost evidence and no published piece showing a product being built, against a peer narrative voice in all twelve published pieces. Peer voice with no artifact reads as amateur. The standard is what keeps the register working.

**What this costs.** A newsletter that promises a person is slower to build than one that promises a topic, and discovery is weaker without a single search surface. Both were stated and accepted.

## Consequences

- Supersedes the contracts-primary positioning and the "do not re-position around AI as the headline" constraint that preceded it.
- The home hero leads with the person and a subject list rather than a role and a pitch; the newsletter is the primary action. See ADR `0008` for the funnel half.
- The roadmap's reason to refuse work is never "wrong subject". Scope is the only lever left.
- The published back catalogue is left alone. Nothing is retired for being off-message, because nothing can be.
- ADR `0006` opens on the superseded funnel premise; see the amendment recorded there.
