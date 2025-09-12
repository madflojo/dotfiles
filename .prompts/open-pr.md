# Create a Pull Request for Current Branch

## Review Changes

Use the upstream base if set; otherwise fall back to `origin/main`.

- Show commits since base:

```bash
git --no-pager log --oneline --decorate --no-merges \
  "$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo origin/main)..HEAD"
```

- Show diff summary (files/lines changed):

```bash
git --no-pager diff --stat \
  "$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo origin/main)..HEAD"
```

## Create the PR

Write the body to a file (avoids shell-escaping issues), then create the PR with `gh`.

- Create a minimal body file (edit as needed):

```bash
cat > /tmp/PR_BODY.md <<'EOF'
## Summary
<Brief purpose and outcome. What problem does this solve?>

## Changes
- <Change 1>
- <Change 2>

## Rationale
<Why these changes were necessary.>

## Risk & Impact
- Breaking changes: <yes/no + details>
- Performance/Security: <notes>
EOF
```

- Create the PR:

```bash
gh pr create \
  --base "$(rev=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo origin/main); printf %s "${rev#*/}")" \
  --head "$(git rev-parse --abbrev-ref HEAD)" \
  --title "<type(scope): subject // ≤100 chars; optional 1 emoji at end>" \
  --body-file /tmp/PR_BODY.md
```

## Rules

- Title: Use Conventional Commits `type(scope): subject`; ≤100 chars; no leading emoji; optional one emoji at the end.
- Description: Summarize what changed and why; include risk/impact as bullets.
- Style: Professional, concise; at most 1 emoji in title and ≤2 in body.
