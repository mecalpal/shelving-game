# Issue Tracker

Issues for this repo live as local markdown files under `.scratch/`.

## Layout

```
.scratch/
├── <feature-or-issue-slug>/
│   ├── issue.md        ← the issue itself
│   └── notes.md        ← optional scratchpad
└── ...
```

## Creating an issue

Write a new file at `.scratch/<slug>/issue.md` with this frontmatter:

```markdown
---
title: <short title>
status: needs-triage
created: <ISO date>
---

<description>
```

## Updating status

Edit the `status:` frontmatter field. Valid values are defined in `docs/agents/triage-labels.md`.

## Listing issues

Read all `issue.md` files under `.scratch/`. Filter by `status:` frontmatter.
