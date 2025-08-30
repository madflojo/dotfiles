# Perform a Git Commit for Staged Changes

## Tooling:

### Viewing Staged Changes:

Use:

```bash
git --no-pager diff --staged
```

### Committing Changes:

Use:

```bash
git commit -m "commit message"
```

## Rules

- If change is trivial (e.g., <100 lines changed, small edits), generate a single-line commit.

- If change is non-trivial, allow a concise multi-line commit.

- Always follow Conventional Commits format including adding issues, user stories, tasks, or defects references if available.

- Limit subject line to 100 characters max.

## Style

- Never start with an emoji; one emoji at the end of the subject is OK.

- Add a touch of contextual humor (just enough for a chuckle, but still relevant and professional).

- Title/subject: optionally append a single emoji at the end; Body: keep total emojis subtle (generally ≤2).

- Avoid shell-problematic characters (especially `!`).
