# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Wayfinding operations

The `wayfinder` skill's map, tickets, blocking, and frontier map onto GitHub as follows.

**The map** is an issue labelled `wayfinder:map`. Find open maps with:

```
gh issue list --label "wayfinder:map" --state open
```

**Tickets** are native **sub-issues** of the map, each carrying one `wayfinder:<type>` label (`research`, `prototype`, `grilling`, `task`). The sub-issue API takes the issue's `id`, not its number, and `gh api` must send it with `-F` (integer) rather than `-f` (string):

```
id=$(gh api repos/imick-io/imick/issues/<ticket> --jq .id)
gh api -X POST repos/imick-io/imick/issues/<map>/sub_issues -F sub_issue_id=$id
gh api repos/imick-io/imick/issues/<map>/sub_issues --jq '.[] | "\(.number) \(.title)"'
```

**Blocking** uses native issue dependencies, so GitHub renders the frontier in its own UI:

```
bid=$(gh api repos/imick-io/imick/issues/<blocker> --jq .id)
gh api -X POST repos/imick-io/imick/issues/<blocked>/dependencies/blocked_by -F issue_id=$bid
gh api repos/imick-io/imick/issues/<n>/dependencies/blocked_by --jq '[.[].number] | join(", ")'
```

**The frontier** is the open sub-issues that are unassigned and have no open blockers. There is no single query for it; list the map's sub-issues, then filter on `state`, `assignees`, and each one's `blocked_by`.

**Claiming** a ticket is `gh issue edit <n> --add-assignee @me`, done before any work.

**Resolving** a ticket is `gh issue close <n> --comment "<the answer>"`, then appending a one-line gist plus link to the map's Decisions-so-far.
