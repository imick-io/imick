@AGENTS.md

## Agent skills

### Issue tracker

Issues live in GitHub Issues at `imick-io/imick`, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage roles (what: `bug`, `enhancement`, `needs-scoping`, `needs-info`, `wontfix`; who: `ready-for-agent`, `ready-for-agent-debugging`, `ready-for-human`, `ready-for-review`), plus the planning labels and `backlog`. Triage runs inside the agent loop. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Team and areas

Three areas, all owned by @imick-io: `area:site`, `area:bookmarks`, `area:newsletter`. See `docs/agents/team.md`.

### Agent loop

Sandcastle agents in Docker work the `ready-for-agent` and `ready-for-agent-debugging` tickets: `pnpm agents` (`-- --once` for one pass), `pnpm agents:stop` to finish and exit. Fast mode. Previews for `verify-epic`: see `docs/agents/preview.md`.
