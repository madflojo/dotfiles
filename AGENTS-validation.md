# Validation

## Table of contents

- [Required checks](#required-checks)
- [TDD flow](#tdd-flow)
- [Task-specific verification](#task-specific-verification)
- [Verification evidence](#verification-evidence)

## Required checks

- Read repository instructions and tool configuration. Prefer repository task runners and pinned tools over generic guidance.
- Validate observable behavior at boundaries, including happy, error, boundary, and regression cases. Keep checks deterministic.
- Before committing, require the repository's available tests, coverage, concurrency or race checks, lint, static analysis, and type checks to pass.
- Distinguish product defects, fragile tests, and tooling, authentication, or environment blockers. Unrun or blocked checks are not success.
- Rerun relevant checks after review fixes. Never claim success without fresh evidence.
- Inspect rendered diagrams and documents before claiming correctness. For remote writes, follow [external-write verification](AGENTS-workflow.md#external-writes).

## TDD flow

1. **Baseline:** run relevant existing checks before editing. Record pre-existing failures separately. If blocked, report why; continue only work that does not depend on the missing evidence.
2. **Red:** write a behavior test and run it before implementation. Confirm failure demonstrates the absent or incorrect behavior. Tooling, import, setup, or unrelated failures do not establish red.
3. **Green:** implement the smallest coherent change that passes. Run the new test and affected existing checks.
4. **Refactor:** simplify while preserving behavior, then rerun affected checks. Repeat per coherent increment; independent review follows the review stages.

Test acceptance criteria and relevant happy, error, boundary, and regression paths. Never weaken assertions, remove coverage, or change expected behavior merely to pass. Correct obsolete expectations only when justified by the authorized contract; explain the change.

## Task-specific verification

- **Feature:** TDD at observable boundaries, including relevant failure paths.
- **Bug:** reproduce the reported failure before fixing it; retain a regression test. If reproduction is blocked, label the diagnosis provisional and report the missing evidence.
- **Refactor:** establish existing behavior with current tests; add characterization tests where coverage is insufficient. Do not invent a failing feature test for unchanged behavior.
- **Concurrency:** test ordering, ownership, cancellation, and lifecycle where affected. Use deterministic synchronization and supported race checks.
- **Configuration/workflow:** validate syntax and affected behavior. Local validation and hosted execution establish different claims. A skipped run does not prove recovery.
- **Documentation/formatting:** check accuracy, links, formatting, and rendered output where applicable. No artificial behavior test is required.

Choose focused checks for each increment; complete repository-required checks before delivery or authorized commits. Name unavailable checks and their impact. Coverage percentages alone do not establish correctness.

## Verification evidence

For each material check, record its command or method, scope, tested revision or working state, and result: **passed**, **failed**, **blocked**, **skipped**, or **not run**. State the reason and practical impact for incomplete verification. Keep evidence concise; do not create a tracked ledger unless requested or required by repository convention.

Reassess evidence after edits, review fixes, changed dependencies, or a different revision. Rerun affected checks; reuse unchanged evidence only when its scope remains applicable. Review agreement is supporting evidence, not behavioral verification or human approval.
