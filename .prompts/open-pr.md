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

## Quick Recipe (Human-Friendly)

Keep it simple — no kitchen-sink script required. Use these steps:

1) Resolve base

```bash
# Prefer your branch's upstream; otherwise fall back to origin/main
UPSTREAM_REF="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo origin/main)"
echo "Using base: $UPSTREAM_REF"
```

2) Review changes since base

```bash
git --no-pager log --oneline --decorate --no-merges "${UPSTREAM_REF}..HEAD"
git --no-pager diff --stat "${UPSTREAM_REF}..HEAD"
```

3) Craft a concise title (Conventional Commits)

- Format: `type(scope): subject`
- Scope: first-level dirs touched (e.g., `prompts,docs`)
- Subject: prefer one primary change; if multiple, append “and refine other files”.

Example:

```text
feat(prompts,dotfiles,docs): add PR creation prompt and refine other files
```

4) Write body to a temp file

```bash
BODY_FILE="$(mktemp -t pr-body-XXXXXX.md)"
$EDITOR "$BODY_FILE"  # paste the template below and fill it in
```

5) Create the PR (avoid shell-unfriendly chars in inline args)

```bash
gh pr create \
  --base "$(echo "$UPSTREAM_REF" | sed 's#^origin/##')" \
  --head "$(git rev-parse --abbrev-ref HEAD)" \
  --title "$PR_TITLE" \
  --body-file "$BODY_FILE"
```
