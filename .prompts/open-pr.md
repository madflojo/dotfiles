# Create a High-Quality Pull Request

## Goal
Create a clear, professional pull request using the **`gh` CLI**, with a **Conventional Commits–style title** and a **concise, useful description** generated from recent commits and diffs. Handle shell-escaping safely (avoid problematic characters like `!`) and prefer writing the body to a **temp file**. Add the same tasteful spice as commit messages: subtle humor and at most a couple of emojis — and allow a single emoji at the end of the title.

---

## Tooling

- Discover upstream base branch (prefer tracking upstream; otherwise assume `origin`’s default):

```bash
  # 1) Try the current branch's upstream (e.g., origin/main)
  UPSTREAM_REF="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"

  # 2) If no upstream is set, fall back to origin's default branch (e.g., origin/HEAD -> origin/main)
  if [ -z "$UPSTREAM_REF" ]; then
    UPSTREAM_REF="$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD | sed 's#^refs/remotes/##' || true)"
  fi

  # 3) If still empty, default to origin/main
  if [ -z "$UPSTREAM_REF" ]; then
    UPSTREAM_REF="origin/main"
  fi

  echo "Using base: $UPSTREAM_REF"
```

* Inspect commits since base (no pager for clean output):

  ```bash
  git --no-pager log --oneline --decorate --no-merges "${UPSTREAM_REF}..HEAD"
  ```

* Inspect diff summary/details:

  ```bash
  # File & hunk overview
  git --no-pager diff --stat "${UPSTREAM_REF}..HEAD"

  # Full patch if needed
  git --no-pager diff "${UPSTREAM_REF}..HEAD"
  ```

* Create PR with `gh`:

  ```bash
  # Use a temp file for the PR body to avoid shell interpretation issues
  BODY_FILE="$(mktemp -t pr-body-XXXXXX.md)"

  # Later:
  gh pr create \
    --base "$(echo "$UPSTREAM_REF" | sed 's#^origin/##')" \
    --head "$(git rev-parse --abbrev-ref HEAD)" \
    --title "$PR_TITLE" \
    --body-file "$BODY_FILE"
  ```

---

## Rules

* **Title**

  * Follow **Conventional Commits** (`type(scope): subject`).
  * Keep the subject **≤ 100 chars**.
  * **Never** start with an emoji; optionally append a single emoji at the end.
  * Be specific and truthful (summarize the net effect of the PR, not the process).
* **Description**

  * Summarize **what changed** and **why** (from `git log` and diff).
  * Include **impact**, **risk**, and **test coverage** in brief bullets.
  * Use code fences for commands/paths where helpful.
  * Avoid shell-problematic characters in inline text; put the full description in a **temp file**.
  * Keep it professional with a touch of contextual humor; add subtle flair.
* **Style (Spice, but tasteful)**

  * Title: allow at most one emoji at the end (optional); Body: keep to **1–2**.
  * Add a light, relevant one-liner (just enough for a chuckle).
  * Avoid shouty punctuation or shell-problem characters (especially `!`).
* **Content Sources**

  * Prefer **actual commits and diffs** over assumptions.
  * If commit messages are noisy, **synthesize** a clean high-level summary.
* **Safety**

  * Use `--body-file` with `gh pr create` to avoid escaping issues.
  * Avoid `!` and other characters that shells might interpret in inline args.
  * Never include secrets or tokens.

---

## What to Extract (from `git log` + `git diff`)

* **Scope & Type**: Infer `type(scope)` from changed packages/modules/paths.
* **Subject**: One-line net effect (≤ 100 chars). Prefer a single, primary change (e.g., “add PR creation prompt”). If several unrelated files changed, append “and refine other files”.
* **Key Changes**: Bulleted list (e.g., “added X,” “refactored Y,” “fixed Z”).
* **Rationale**: Why the change was needed (bug, feature, cleanup, perf, security).
* **Risk/Impact**: Breaking changes, migrations, perf/latency, security implications.
* **Testing**: Unit/integ tests added/updated; manual verification steps.
* **Links**: Related issues/tickets (e.g., `Closes #123`).

---

## Output (the agent should produce)

1. **Computed Title (Conventional Commits)** — e.g.,
   `feat(api): add idempotent POST /payments with store-and-forward`
2. **PR Body (Markdown)** — sections:

   * **Summary**
   * **Changes**
   * **Rationale**
   * **Risk & Impact**
   * **Testing**
   * **Checklist**
   * **Links**
3. **The exact `gh pr create` command** that will be executed, using `--body-file`.

---

## Suggested Body Template (Markdown)

```md
## Summary
<Brief, high-level purpose and outcome. What problem does this solve?> Keeping it simple and testable. ✅

## Changes
- <Change 1>
- <Change 2>
- <Change 3>

## Rationale
<Why these changes were necessary; context from commits/issues>

## Risk & Impact
- Breaking changes: <yes/no + details>
- Performance/latency: <notes if any>
- Security: <notes if any>
- Migration steps: <if applicable>

## Testing
- Unit: <added/updated + paths>
- Integration/E2E: <added/updated + how to run>
- Manual: <quick steps to verify>

## Checklist
- [ ] Tests updated/added
- [ ] Docs updated (README/ADR/changelog)
- [ ] Backward compatible (or migration steps provided)

## Links
- Closes #<id>
- Related: #<id>, ADR: <link>
```

---

## Algorithm the Agent Should Follow

1. **Determine Base Branch**

   * Try `@{u}`; if missing, resolve `origin` default; else fallback to `origin/main`.

2. **Collect Evidence**

   * `git --no-pager log --oneline --decorate --no-merges "${UPSTREAM_REF}..HEAD"`
   * `git --no-pager diff --stat "${UPSTREAM_REF}..HEAD"`
   * Optionally, `git --no-pager diff "${UPSTREAM_REF}..HEAD"` to refine details.

3. **Synthesize Title**

   * Infer `type(scope)` from changed top-level dirs (e.g., `api`, `pkg/foo`, `docs`).
   * Write a ≤ 100-char subject describing the net effect.
   * Prefer a single primary phrase (e.g., “add PR creation prompt”) and, only if multiple areas changed, append “and refine other files”.
   * No leading emoji. If you add one, place a single emoji at the end.

4. **Draft Body (to temp file)**

   * Populate the **Suggested Body Template** with bullets distilled from commits/diff.
   * Use `printf '%s\n' ... > "$BODY_FILE"` to avoid shell interpretation.
   * Do **not** include `!` unless absolutely necessary (and only in the file, not the CLI args).
   * Add one tasteful, relevant one-liner with at most one emoji.

5. **Create PR**

   * Run:

     ```bash
     gh pr create \
       --base "$(echo "$UPSTREAM_REF" | sed 's#^origin/##')" \
       --head "$(git rev-parse --abbrev-ref HEAD)" \
       --title "$PR_TITLE" \
       --body-file "$BODY_FILE"
     ```

6. **Show the User**

   * Echo the computed title and the path to the body file for review.
   * Optionally, `gh pr view --web` after creation.

---

## Example Shell Snippet (Agent to Execute)

```bash
set -euo pipefail

# Resolve base
UPSTREAM_REF="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"
if [ -z "$UPSTREAM_REF" ]; then
  UPSTREAM_REF="$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD | sed 's#^refs/remotes/##' || true)"
fi
if [ -z "$UPSTREAM_REF" ]; then
  UPSTREAM_REF="origin/main"
fi

# Gather signals
COMMITS="$(git --no-pager log --oneline --decorate --no-merges "${UPSTREAM_REF}..HEAD")"
DIFFSTAT="$(git --no-pager diff --stat "${UPSTREAM_REF}..HEAD")"
DIFFNAMES="$(git --no-pager diff --name-only "${UPSTREAM_REF}..HEAD")"

# Derive scope (simple heuristic: first-level dir(s) changed)
SCOPE="$(git --no-pager diff --name-only "${UPSTREAM_REF}..HEAD" | awk -F/ 'NF{print $1}' | sort -u | tr '\n' ',' | sed 's/,$//' )"
[ -z "$SCOPE" ] && SCOPE="repo"

# Infer type (very basic heuristic; adjust as needed)
if echo "$COMMITS" | grep -qiE '\bfix|bug|hotfix\b'; then TYPE="fix"
elif echo "$COMMITS" | grep -qiE '\bfeat|feature\b'; then TYPE="feat"
elif echo "$COMMITS" | grep -qiE '\bperf\b'; then TYPE="perf"
elif echo "$COMMITS" | grep -qiE '\brefactor\b'; then TYPE="refactor"
elif echo "$COMMITS" | grep -qiE '\bdocs?\b'; then TYPE="docs"
elif echo "$COMMITS" | grep -qiE '\btest(s)?\b'; then TYPE="test"
else TYPE="chore"; fi

# Synthesize a concise subject with a primary focus.
LATEST_SUBJECT_RAW="$(echo "$COMMITS" | head -n1 | sed 's/^[a-f0-9]\{7,\} //')"
LATEST_SUBJECT_STRIPPED="$(echo "$LATEST_SUBJECT_RAW" | sed -E 's/^[a-z]+(\([^)]*\))?:\s*//i')"

# Determine the primary change and matching pattern
PRIMARY_SUBJECT="$LATEST_SUBJECT_STRIPPED"
PRIMARY_MATCH='a^' # matches nothing by default
if echo "$DIFFNAMES" | grep -q '^\.prompts/open-pr\.md$'; then
  PRIMARY_SUBJECT="add PR creation prompt"
  PRIMARY_MATCH='^\.prompts/open-pr\.md$'
elif echo "$DIFFNAMES" | grep -q '^\.prompts/'; then
  PRIMARY_SUBJECT="refine prompts"
  PRIMARY_MATCH='^\.prompts/'
elif echo "$DIFFNAMES" | grep -q '^README\.md$'; then
  PRIMARY_SUBJECT="update documentation"
  PRIMARY_MATCH='^README\.md$'
elif echo "$DIFFNAMES" | grep -q '^\.vimrc$'; then
  PRIMARY_SUBJECT="update Vim config"
  PRIMARY_MATCH='^\.vimrc$'
elif echo "$DIFFNAMES" | grep -q '^\.tmux\.conf$'; then
  PRIMARY_SUBJECT="tweak tmux config"
  PRIMARY_MATCH='^\.tmux\.conf$'
fi

TOTAL_CHANGED="$(printf '%s\n' "$DIFFNAMES" | sed '/^$/d' | wc -l | tr -d ' ')"
PRIMARY_COUNT="$(printf '%s\n' "$DIFFNAMES" | sed '/^$/d' | grep -E -c "$PRIMARY_MATCH" || true)"

if [ "${TOTAL_CHANGED:-0}" -gt "${PRIMARY_COUNT:-0}" ]; then
  SUBJECT_CORE="${PRIMARY_SUBJECT} and refine other files"
else
  SUBJECT_CORE="${PRIMARY_SUBJECT}"
fi

SUBJECT_TRUNC="$(printf '%s' "$SUBJECT_CORE" | cut -c1-100)"
PR_TITLE="${TYPE}(${SCOPE}): ${SUBJECT_TRUNC}"

# Optionally append one emoji at the end of the title (never at the start)
# Default: none. Uncomment to enable subtle flair.
# OPTIONAL_EMOJI="✨"
# [ -n "$OPTIONAL_EMOJI" ] && PR_TITLE="${PR_TITLE} ${OPTIONAL_EMOJI}"

BODY_FILE="$(mktemp -t pr-body-XXXXXX.md)"
{
  printf '## Summary\n%s\n\n' "Summarize the net effect of these changes. Keeping it simple and testable. ✅"
  printf '## Changes\n'
  echo "$COMMITS" | sed 's/^/- /'
  printf '\n## Rationale\n%s\n\n' "Why this change is needed (bug/feature/perf/security)."
  printf '## Risk & Impact\n- Breaking changes: <yes/no>\n- Performance/latency: <notes>\n- Security: <notes>\n- Migration steps: <if any>\n\n'
  printf '## Testing\n- Unit: <added/updated>\n- Integration/E2E: <added/updated>\n- Manual: <how to verify>\n\n'
  printf '## Checklist\n- [ ] Tests updated/added\n- [ ] Docs updated\n- [ ] Backward compatible (or migration steps provided)\n\n'
  printf '## Links\n- Closes #<id>\n- Related: #<id>\n'
} > "$BODY_FILE"

# Create PR
gh pr create \
  --base "$(echo "$UPSTREAM_REF" | sed 's#^origin/##')" \
  --head "$(git rev-parse --abbrev-ref HEAD)" \
  --title "$PR_TITLE" \
  --body-file "$BODY_FILE"
```
