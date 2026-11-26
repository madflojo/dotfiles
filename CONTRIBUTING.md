# Contributing

Use a short-lived branch and a scoped pull request for skill, configuration,
dependency, and documentation changes. Small corrections can go straight to
a PR; discuss changes to skill identity or public behavior first.

## Checks

Use Node 22 or later, GitHub CLI with `gh skill install` support, and Lychee
0.24.2. The npm lockfile pins the JavaScript tools.

```sh
npm ci
make lint tests
```

`make tests` checks package structure, YAML/JSON and release schemas, exercises
the actual Release Please package against offline fixtures, and installs each
imported skill with GitHub CLI and Skills CLI into temporary destinations.
It does not update installed user skills or publish anything.

Markdown lint checks all new and changed files. The exact original Markdown
files listed in `scripts/markdown-baseline.json` are exempt only while their
SHA-256 hashes match the baseline. Changing one requires fixing its full lint
result; adding files cannot inherit an exemption. Do not refresh the baseline
to hide new failures. Historical changelogs retain their original formatting
and are excluded from Markdown/link checks, matching the source repositories.
All other Markdown receives offline link and fragment checks, including the
baseline files. No network link availability is asserted by this check.

## Review and merge

Use a Conventional Commit squash title: `fix(fun-commit-msg): clarify staging`
or `feat(review-this): expand boundary review`. Changed package paths select
releases; a title's scope does not select packages by itself. Keep unrelated
skill changes in separate PRs. `feat` requests a minor release and `fix` a
patch; `!` or a `BREAKING CHANGE:` footer requests a major release. Internal
`chore`, `ci`, and `test` changes normally do not request a release.

Review the latest head and the **Skill validation** check before merging.
Review Dependabot PR diffs and CI just like other changes. Weekly grouped
updates cover GitHub Actions and the locked npm validation tools. Action
references use immutable commit pins with version annotations; Dependabot
updates those references. No automatic merging is configured.

PR-first delivery is the contribution policy. Repository protections have not
been changed by this migration. A separately approved ruleset could require
PRs and **Skill validation**, block force pushes and branch deletion, and
allow the solo maintainer to merge after checks without requiring a second
human approval. Reconfirm exact hosted check names before enabling a ruleset.

## Releases

See [skill releases and cutover](docs/skills.md#independent-releases).
Release PRs require review and passing checks before merge. GitHub may require
a maintainer to approve workflow runs on token-created PRs. Approve the run
for the latest head and verify its results; a missing or skipped check does
not count as a pass. The read-only validation workflow also supports manual
dispatch at an exact PR head when necessary.

Keep architecture decision records local in Git-ignored `docs/adr/`.
Owner acceptance can occur in chat; these records are not PR deliverables.
