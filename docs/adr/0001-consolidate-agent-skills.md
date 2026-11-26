# ADR 0001: Consolidate maintained agent skills in dotfiles

Status: Proposed

Date: 2026-11-26

## Context

Four standalone repositories duplicate contribution, validation, and release
maintenance. Their owner has chosen dotfiles as the maintained source for
`fun-commit-msg`, `fun-pull-requests`, `learn-this-project`, and `review-this`.
Go style remains maintained in
[go-style-agent-skill](https://github.com/madflojo/go-style-agent-skill).

This decision defines the consumer and release boundaries of that move.
It changes durable ownership and public installation locations. Acceptance
and merge of this separate decision PR precede migration implementation.
Acceptance does not authorize implementation merge, releases, repository
archival, or remote settings changes.

## Decision

### Source and compatibility

Maintain each imported skill in `skills/<existing-name>/`. Preserve its
identifier, instructions, references, and assets. A selective installation
must work without personal AGENTS guidance, other skills, or editor settings.
Keep existing `engineering-tribunal`, `m3`, scheduled prompts, and unrelated
configuration intact. Link to Go style; do not copy its maintained source.

Copy the complete skill trees from verified source revisions. Record the
repository URL and full imported commit in a provenance inventory. Include
each source LICENSE in its skill package, preserving its exact text, and
retain any notices discovered at import time. Preserve source changelogs
within their respective packages, including original comparison URLs.
Do not present old source commits as dotfiles releases.

Retain original repository history, tags, and SHAs in the source repositories.
The provenance inventory links those histories; no dotfiles history rewrite
or recreation of original commit identities is needed. Do not maintain a
mirror or synchronized duplicate skill trees after cutover.

### Independent releases

Use Release Please manifest mode with four explicit packages at
`skills/<name>`, independent versions and changelogs, and tags named
`<name>-v<version>`. Do not configure a root package or linked versions.
Keep `m3` and `engineering-tribunal` outside release automation for now:
neither has an established package version/changelog contract in dotfiles.
Their existing installation paths remain supported.

Seed versions from published source releases and verified manifests, never
from proposed release PRs. Use the supported `simple` strategy with an
package-local `version.txt` created during import. The manifest, version file,
changelog, and tag must agree after release. Preserve informational metadata
without claiming that Release Please manages it.

Import with a maintenance commit, then activate automation in a separate PR
after the import merges. Set `bootstrap-sha` to that exact merged import SHA.
This avoids embedding an unknown squash-merge SHA in its own commit.
The activation PR must not modify skill packages. Recheck intervening
changes before activation; do not discard real post-import skill changes.
No synthetic initial component tags or releases are needed.

Use pinned Release Please fixtures or safe dry runs to establish all of:

- imported history produces no release candidates;
- a fix in one skill selects only that package;
- root-only documentation or CI changes select no skill;
- changes to two skills produce their independent next versions;
- releasing one package preserves another package's pending history;
- only the intended manifest, package changelog, and version file change;
- retries do not create duplicate release PRs or colliding tags.

Do not enable release publication merely to test it. Keep publication disabled
until explicitly authorized. Review release PRs before merging; never enable
automatic merging. Until the first actual component release exists, consumer
documentation must pin a verified merged commit, not a hypothetical tag.

### Validation and dependency updates

Retain meaningful source Markdown lint and offline Lychee checks, including
local fragments. Inventory existing dotfiles failures before adding CI.
Use an explicit, narrow baseline for pre-existing failures; reject blanket
suppression and unrelated formatting. Newly added artifacts must pass.

Validate skill frontmatter, referenced files, complete package contents,
relative links, YAML/JSON, workflows, and Release Please configuration.
Use repository runners and pinned tool versions consistently in local and
hosted checks. Add behavior evaluations only where skill behavior changes.

Add one weekly grouped GitHub Actions Dependabot entry. Inspect actual
manifests again during implementation and add other ecosystems only when
present. If npm tooling is introduced, commit its lockfile and configure its
updates too. Pin action revisions with readable version annotations; verify
Dependabot can update those pins. Review dependency changes through CI and
ordinary PRs; do not enable automatic merging.

### PR-first delivery

Use short-lived branches, scoped PRs, and Conventional Commit squash titles.
CI runs on PRs before merge. Skill release selection follows changed package
paths, not an assumption that a commit scope alone selects a package.
Feature, dependency, release, and source-notice changes all use PRs.

Use the repository `GITHUB_TOKEN` with minimum required permissions. Current
GitHub documentation describes approval-required workflow runs for token-created
PRs on opened, synchronize, and reopened events. A maintainer approves those
runs and verifies checks on the latest head. Verify actual hosted behavior
before treating this as an operational guarantee. If needed, use a read-only
manual validation workflow on the exact PR head; do not add credentials or
weaken checks to bypass a missing run.

Propose protections separately after final check names exist: require PRs and
the exact validation checks, block force pushes and branch deletion, and allow
a solo maintainer to merge after checks without a mandatory second human
approval. Do not apply rulesets or claim these protections are enforced.

### Consumer cutover

Test current supported GitHub CLI and Skills CLI selective installations into
isolated temporary destinations. Verify identifiers, full references/assets,
pinning, and absence of unrelated skills/settings. Do not overwrite installed
user copies. Document exact commands only after testing them.

After the migration merges, repeat remote installation at its authoritative
merged SHA. Publish source-notice PRs only after that succeeds. Keep source
repositories available and old pinned installs valid. Notices identify the
maintained source and link to tested selective and pinned installation paths.
Retire old release automation through reviewed source-notice changes rather
than maintaining two active release streams. Do not close pending source
PRs, publish releases, or archive repositories without explicit authority.
Do not promise skills.sh redirects without verified moved-listing support.

## Alternatives and consequences

Keeping separate repositories preserves present URLs but repeats tooling and
release maintenance, contrary to the chosen ownership model. A single shared
version would couple unrelated skills and abandon independent version sequences.
Mirroring would add synchronization failure modes and duplicate maintenance.
Independent manifest packages reuse existing tooling with fewer moving parts.

Consumers must change their source for future updates. Original pinned
versions remain available. Dotfiles gains shared CI and release maintenance;
selective installation and path-based release tests protect package isolation.
Two implementation PRs are required to obtain a squash-safe bootstrap SHA.

## Operational requirements

- **Performance:** Install only one requested package; no benchmark is needed
  for unchanged prose skills. Maintainer reruns install checks when packaging
  changes.
- **Availability:** Old source installs remain usable during cutover; verify
  old pinned and new merged-SHA installs before notices. GitHub availability
  is an external dependency.
- **Resiliency:** Failed CI or publication leaves source history intact. Test
  retry behavior without duplicate tags; maintainer can revert migration PRs
  and pause automation.
- **Observability:** Named CI jobs identify lint, links, structure, and release
  validation failures. Review checks on every latest PR head; never equate a
  skipped run with success.
- **Maintainability:** One maintained skill source, provenance, independent
  versions, repository check runners, and weekly reviewed dependency updates.
- **Security:** Minimum workflow permissions, pinned dependencies, read-only
  PR validation, no personal settings in packages, and no new credentials.

Accept the consumer URL change only with staged cutover and retained original
repositories. Reject untested release bootstrap, missing checks, lost package
files, or new credential requirements as reasons to activate automation.
Rollback before cutover is a PR revert. After cutover, coordinate any reversal
with consumer notices and preserve all published version identities.

## Verified baseline and delivery gates

The following source heads were fetched on 2026-11-26. Published versions
matched their release manifests. Refresh this inventory before import.

| Source repository | Exact source main SHA | Published version |
| --- | --- | --- |
| [fun-commit-msg](https://github.com/madflojo/fun-commit-msg) | `aab2a16544b9d3d230f34ee1043b58f474756887` | `1.1.0` |
| [fun-pull-requests](https://github.com/madflojo/fun-pull-requests) | `4680cd55c751d58ff23fb873969b628f0c8f4a8a` | `1.1.0` |
| [learn-this-project](https://github.com/madflojo/learn-this-project) | `b70684e0959baed6927e481428b77eae00e035c1` | `1.0.1` |
| [review-this](https://github.com/madflojo/review-this) | `453835d518a7ceb66407d05284a8b24026edc0c8` | `1.0.1` |

Dotfiles baseline: `8aa1e6e39940624a1b57dcbdffec26e22a403361`.
All four installed `.agents/skills` trees matched the source skill trees
byte for byte; no corresponding `.codex/skills` copies existed.
All four source trees have Markdown/Lychee and Release Please workflows,
Makefiles, contribution guides, changelogs, and Apache-2.0 licenses. No
Dependabot configuration or NOTICE file exists in these fetched HEAD trees
or dotfiles. License bytes differ across sources; retain each original.

Open release PRs propose `1.1.1` for
[fun-commit-msg #4](https://github.com/madflojo/fun-commit-msg/pull/4) and
[fun-pull-requests #4](https://github.com/madflojo/fun-pull-requests/pull/4).
Both contain manifest/changelog updates for installation documentation;
neither is a published version. No other open PRs or issues were found in
the five repositories. Refresh before cutover; do not silently discard work.

Delivery order and gates:

1. Accept and merge this decision separately.
2. Import packages and provenance; add shared checks, Dependabot, contribution
   guidance, and tested installation documentation. Require preservation,
   syntax, links, lint, isolated installs, and independent diff review.
3. Activate release PR automation with the merged import SHA after safe
   release-selection fixtures pass. Require independent release/workflow
   review and verify hosted bot-PR check approval behavior. Publication stays
   disabled until separately authorized.
4. Verify remote selective installs at the merged SHA, then prepare and publish
   authorized source-notice PRs. Recheck old pins, pending work, and notices.

The migration, hosted checks, release fixtures, consumer installs, and listing
redirect support are not verified by this decision document. Revisit the
decision if supported clients cannot install packages independently or release
selection cannot preserve independent histories without custom tooling.

## References

- [Release Please manifest and bootstrap configuration](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md)
- [Release Please simple strategy and version files](https://github.com/googleapis/release-please/blob/main/src/strategies/simple.ts)
- [GitHub workflow triggers and token-created PR checks](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
- [Dependabot configuration options](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference)
- [Skills CLI commands](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
