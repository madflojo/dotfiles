# Agent skill installation and releases

## Contents

- [Install one skill](#install-one-skill)
- [Independent releases](#independent-releases)
- [Migration and original sources](#migration-and-original-sources)
- [Cutover checklist](#cutover-checklist)

## Install one skill

Each directory under `skills/` is a separate skill. Select one explicitly;
installation does not require the personal AGENTS policy or editor settings.
Inspect and back up an existing destination before replacing a whole package.

From a checkout containing these packages, GitHub CLI can install one locally:

```sh
gh skill install . fun-commit-msg --from-local --dir /tmp/my-agent-skills
```

Use a fresh destination of your choice instead of reusing `/tmp` indefinitely.
For Skills CLI, install one at project scope from this checkout:

```sh
npx skills@1.9.0 add . --skill fun-commit-msg --agent codex --copy --yes
```

Run it in the intended target project with an absolute checkout path in place
of `.` when the target project differs from this repository. Repeat with
`fun-pull-requests`, `learn-this-project`, `review-this`,
`engineering-tribunal`, or `material-design-m3` as needed.

The former `m3` skill is now named `material-design-m3`. Before updating an
existing installation, inspect and back up the old `m3` directory, then remove
that selected directory and install `material-design-m3`. Avoid leaving both
installed, which would expose the same instructions under two names. Pins to
older repository revisions still provide the original `m3` name and path.

All skills use this repository's single [Apache-2.0 license](../LICENSE).
Selective skill installers copy the chosen skill directory; they do not copy
the root license into it. Refer to the repository license when using or
redistributing the skills.

After the migration merges, install a remote skill pinned to the verified
merged commit. Replace `MERGED_SHA` with that full commit SHA:

```sh
gh skill install madflojo/dotfiles fun-commit-msg \
  --pin MERGED_SHA --agent codex --scope user
npx skills@1.9.0 add https://github.com/madflojo/dotfiles/tree/MERGED_SHA \
  --skill fun-commit-msg --agent codex --copy --yes
```

These remote commands are cutover instructions, pending verification against
the authoritative merged SHA. Until that gate passes, the original source
repositories remain the published installation locations. Prefer commit pins
during migration. GitHub CLI otherwise selects the repository's latest release,
which may belong to a different skill. After a real component release exists,
pin its tag, such as `fun-commit-msg-v1.1.1`; that example is not a promise that
the tag has been published. Do not use root `v` tags for new dotfiles releases.

Go style remains maintained in
[its standalone repository](https://github.com/madflojo/go-style-agent-skill).

## Independent releases

All six bundled skills participate in the Release Please manifest.
Each has its own version, `CHANGELOG.md`, `version.txt`, release PR, and tag
`<skill>-v<version>`. There is no root release package or shared version.
Editor/configuration changes cannot select all skills for release.

Initial versions are `1.1.0` for both fun skills and `1.0.1` for the discovery
and review skills. These are verified original repository releases, not new
dotfiles tags. Historical changelog links still point to their original repos.
Skill frontmatter versions, where present, are informational and unchanged;
the manifest, package version file, and component release tag are authoritative.

`engineering-tribunal` and `material-design-m3` start from an unreleased
development baseline of `0.1.0`, not an invented published release. Their
changelogs identify this as unreleased. While they are being refined, fixes
bump the patch version and features or breaking changes bump the minor
version within `0.x`. Promoting either skill to `1.0.0` requires a deliberate
release-policy change. Their versions do not follow the four imported skills.

Release automation is staged and disabled in this import. Its manual workflow
rejects the unresolved bootstrap SHA and disabled publication flag before any
write job can run. Do not merge generated release PRs while publication is
disabled: a merged but untagged release can block subsequent release creation.

After import merges, prepare a separate activation PR:

1. Set `bootstrap-sha` to the exact merged import commit. Recheck any skill
   changes made since import; they must remain eligible for release.
2. Run release fixtures and safe dry runs. Require zero import-only releases,
   independent package selection, and preservation of pending package history.
3. Once publication is explicitly authorized, set `skip-github-release` to
   `false` and add a `push` trigger restricted to `main`. Review the PR before
   merge. Do not publish a real release as a test.
4. Verify hosted bot-created PR checks. Current GitHub behavior can require
   maintainer approval to start these runs; no new credentials are required
   by this setup. Workflow permissions/settings may still need owner action
   if GitHub rejects PR creation. Do not weaken checks to bypass this.

Retain the bootstrap boundary until all six skills have actual dotfiles
release boundaries. Removing it after only one package releases can cause
other packages to scan imported history. Fixture tests cover the partial
release case. Release Please retries use deterministic release PR branches;
do not manually duplicate a release after an ambiguous failure. Inspect PRs,
tags, and releases first. Review a release PR's version, package paths, notes,
and latest checks before merging it.

## Migration and original sources

[The provenance inventory](../skills/provenance.json) records each imported
repository, exact commit, published version, original file SHA-256 hashes, and
the original repository license hash.
The hashes describe the import, not a restriction on future skill maintenance.
Imported instructions are unchanged. Each imported package includes its source
changelog and complete references/assets. Licensing is shared at the root;
original license text remains accessible at the recorded source revision.

Original repositories and historical tags/SHAs remain available. No history
rewrite, mirrored maintenance, archive, or deletion is part of this migration.
The import was compared with installed `.agents/skills` copies; no skill-file
drift was found. Existing installed copies were not overwritten.

The original fun skill repositories each have an open `1.1.1` release PR for
installation documentation. Those proposed versions were not imported as
published releases. Recheck them before cutover; do not close or merge source
work without authorization.

## Cutover checklist

After the import and activation PRs are reviewed, the maintainer owns cutover:

1. Verify new remote selective installs at the merged import SHA with supported
   clients. Check the identifier, complete files, pin, and absence of unrelated
   settings/skills. Also verify the original pinned installs still work.
2. Prepare one source-notice PR in each original repository. Link to tested
   new install commands and record that future changes belong in dotfiles.
   Disable the old release workflow in those reviewed changes. Do not publish
   notices until the merged-source install check passes.
3. Recheck pending source PRs and coordinate their disposition explicitly.
   Keep old tags and SHAs. Do not archive repositories or delete source skills.
4. Do not advertise a skills.sh redirect or submit external listing notices
   unless moved-listing support is verified and the notice is requested.

Before cutover, rollback is a PR revert of the import or activation. After
consumers move, coordinate any reversal through notices and retain all
published tags. If checks or release creation fail, pause activation and
inspect the failing package; existing original installs remain available.
