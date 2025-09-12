# Prompt: Review Godoc Comments

## Goal
Review existing Go documentation and identify missing or non-idiomatic **godoc** comments so every package, type, field, function, and method is documented in an idiomatic, stdlib-style way.

- **Top-level package docs** must use **block comments** `/* ... */` in a dedicated `doc.go`.
- **All other docs** must use **line comments** `// ...` immediately preceding the declaration.
- **Document everything** (exported and **unexported**) — types, interfaces, funcs, methods, consts, vars, and **every struct field**.
  - Exception: embedded struct fields may omit comments if they’re purely structural.
- Follow **Effective Go** and **Go Code Review Comments** conventions.

Note: Tests are out of scope — see "Scope & Exclusions" below.

---

## Tasks

- Inspect all packages and declarations.
- Produce a concise **coverage report** (documented vs total) per package and overall.
- List **missing or non-idiomatic** docs with quick-fix suggestions.
- Do **not** modify files; propose a patch in a separate section.

---

## Scope & Exclusions

- **Exclude test files**: ignore any file matching `*_test.go` when reviewing coverage and style.
- **Exclude test-only symbols**: do not report or suggest docs for `Test*`, `Benchmark*`, or `Fuzz*` functions, even if they appear in non-test files.
- **Build tags**: if a file is guarded by a test-only build tag (e.g., `//go:build test`), treat it as excluded.
- You may read tests to infer intended public API behavior, but do not include test code in coverage metrics or findings.

---

## Tooling (you may run)
```bash
# Enumerate packages (excluding vendor automatically)
go list ./...

# Show package import path & directory (if needed)
go list -json ./...

# Quick doc check (human read)
go doc -all <pkg>

# Git helpers for patching
git status
git diff
```

---

## Style Rules (stdlib-like)

* **First sentence**: one-line summary, **ends with a period**, present tense, starts with the identifier’s name for exported symbols (preferably for unexported, too).

  * `// Reader reads bytes from an underlying buffer.`
* **Package comment (in `doc.go`)**:

  * File header uses block form:

    ```go
    /*
    Package foo provides ...

    Overview:
      - Short bullets are fine.
      - Keep lines ~80-100 cols.
    */
    package foo
    ```
* **Types & Interfaces**:

  * Explain what it represents and any invariants / zero-value behavior.
* **Struct fields**:

  * Precede each field with a one-line `//` comment.
  * Clarify units, accepted ranges, zero-value meaning, and concurrency expectations.
* **Functions & Methods**:

  * Describe behavior, notable side effects, **error semantics**, and constraints.
  * Note thread-safety and performance considerations where relevant.
* **Constants & Vars**:

  * Grouped blocks can share a short lead-in, but **exported** names should still be clear in context.
* **Tags & Special Conventions**:

  * Use `Deprecated:` prefix when applicable.
  * Avoid Markdown-heavy formatting; inline code with backticks is OK.
  * Keep it concise; prefer short paragraphs and bullets.

---

## What to Extract While Learning

* **Purpose** of each package (what it does; who uses it).
* **Zero values** and invariants of primary types.
* **Error model** (sentinel errors, wrapping, context).
* **Concurrency** (goroutine safety, locking, channels).
* **Performance** and critical-path notes if visible from code/tests.
* **Configuration** and environment interactions.

---

## Output: Review Report (for "review godocs")

1. **Coverage Table** (per package)

   * `pkg path | total decls | documented | coverage %`
2. **Findings**

   * Missing package comment (file/path)
   * Missing/short/anti-idiomatic docs with a one-line fix suggestion
3. **Suggested Patch (preview)**

   * Minimal diffs for the most important fixes

---

## Minimal Algorithm

1. **Enumerate packages** with `go list ./...`.
2. For each package:

   * Ignore files matching `*_test.go` and files gated by test-only build tags.
   * Check whether `doc.go` exists with a block comment; if missing, flag it.
   * Parse files and locate all declarations (types, interfaces, funcs/methods, consts, vars).
   * For **structs**, ensure **each field** has a `//` comment (skip pure embedded fields if intentional).
   * Skip functions named `Test*`, `Benchmark*`, or `Fuzz*` from review and metrics.
   * Check whether comments meet the **Style Rules**.

---

## Quality Gates

* **100% documentation coverage** for packages and top-level exported API (excluding tests).
* Unexported declarations documented unless intentionally private noise—prefer brief one-liners.
* First sentence present tense, ends with a period.
* No trailing whitespace; `gofmt` clean.
