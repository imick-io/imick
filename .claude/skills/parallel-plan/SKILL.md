---
name: parallel-plan
description: Read the open GitHub issues, build a dependency graph between them, and output a <plan> JSON block listing the issues that can be worked in parallel right now (no blocking dependencies on other open issues). Use when user wants to identify unblocked work, find parallelizable issues, plan a multi-agent or sandcastle run, or types /parallel-plan.
---

# Parallel work planner

Inspired by `.sandcastle/plan-prompt.md`. Selects the issues that an agent (or a human) can pick up right now without waiting on another open issue to land first.

`$ARGUMENTS` is an optional label filter (e.g. `ready-for-agent`). If omitted, default to `ready-for-agent` per `docs/agents/triage-labels.md`.

## Workflow

1. **Fetch open issues** matching the label:

   ```sh
   gh issue list --state open --label "<label>" \
     --json number,title,body,labels,comments \
     --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'
   ```

   If the list is empty, output an empty plan and stop.

2. **Build a dependency graph.** For each issue, decide whether it is **blocked by** another open issue. Issue B is blocked by issue A if any of:
   - B requires code, schema, or infrastructure that A introduces.
   - B and A modify overlapping files or modules, so concurrent work would likely produce merge conflicts.
   - B's requirements depend on a decision or API shape that A will establish.
   - B explicitly references A as a blocker in its body or comments (e.g. "blocked by #42", "depends on #42").

   An issue is **unblocked** if it has zero blocking dependencies on other open issues in the fetched list.

3. **Assign a branch name** to each unblocked issue using the format `agent/issue-{number}-{slug}` where `slug` is a kebab-case version of the title, truncated to about 6 words.

4. **Output the plan** as a single JSON object wrapped in `<plan>` tags. No prose around it.

   ```
   <plan>
   {"issues": [{"id": "42", "title": "Fix auth bug", "branch": "agent/issue-42-fix-auth-bug"}]}
   </plan>
   ```

## Rules

- Include **only unblocked issues**. If every issue is blocked, include the single highest-priority candidate (the one with the fewest or weakest dependencies) so progress is still possible.
- The JSON must be valid and parseable. `id` is a string, even for numeric issue numbers.
- Do not modify any issues, do not comment, do not create branches. This skill is read-only.
- Branch names must be lowercase, alphanumeric plus hyphens, no trailing hyphen.
- Never use em-dashes anywhere in output.

## Notes

- The `<plan>` block is consumed by downstream automation (e.g. `.sandcastle/main.mts`). Keep the schema stable: `{issues: [{id, title, branch}]}`.
- If the user passes a different label (e.g. `/parallel-plan Sandcastle`), use that label instead of the default.
