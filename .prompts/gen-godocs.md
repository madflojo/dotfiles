# Prompt: Generate Godoc Comments

## Goal
Review existing Go documentation and generate missing **godoc** comments so every package, type, field, function, and method is documented in an idiomatic, stdlib-style way.

- **Top-level package docs** must use **block comments** `/* ... */` in a dedicated `doc.go`.
- **All other docs** must use **line comments** `// ...` immediately preceding the declaration.
- **Document everything** (exported and **unexported**) — types, interfaces, funcs, methods, consts, vars, and **every struct field**.
  - Exception: embedded struct fields may omit comments if they’re purely structural.
- Follow **Effective Go** and **Go Code Review Comments** conventions.

Note: Tests are out of scope — see "Scope & Exclusions" below.

---

## Tasks

- Create or update `doc.go` with a proper **package comment** (block style).
- Add or fix `//` doc comments for all missing/incorrect declarations.
- Generate a **unified diff** (patch) that applies cleanly with `git apply`.

---

## Scope & Exclusions

- **Exclude test files**: do not add or modify comments in any file matching `*_test.go`.
- **Exclude test-only symbols**: do not generate comments for `Test*`, `Benchmark*`, or `Fuzz*` functions, even if they appear in non-test files.
- **Build tags**: if a file is guarded by a test-only build tag (e.g., `//go:build test`), treat it as excluded.
- You may read tests to infer behavior for public APIs, but do not document test code itself.

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

## Output: Patch (for "generate godocs")

* A **unified diff** that:

  * Adds/updates `doc.go` per package (block comment).
  * Adds/fixes `//` comments for all missing docs.
  * Keeps imports and formatting intact (`gofmt` implied).
* A short **commit-style summary** of what was documented.

---

## Comment Templates (fill then refine)

**Package (doc.go)**

```go
/*
Package <pkg> <one-sentence summary>.

<Optional short overview (1–3 short paragraphs or bullet list)>
- <Key capability or concept>
- <Behavioral guarantees / zero-values / concurrency notes>
*/
package <pkg>
```

**Type**

```go
// <TypeName> <one-sentence summary>.
// <Optional: invariants, zero-value behavior, concurrency/perf notes>.
type <TypeName> struct {
    // <FieldName> <what it represents, units/range, zero-value meaning>.
    <FieldName> <Type>

    // <EmbeddedType> provides <short reason for embedding>. (Optional)
    <EmbeddedType>
}
```

**Interface**

```go
// <InterfaceName> describes <role/behavior/purpose>.
type <InterfaceName> interface {
    // <MethodName> <summary of contract and error semantics>.
    <MethodName>(...) (..)
}
```

**Func / Method**

```go
// <FuncName> <what it does, key side effects, error semantics>.
func <FuncName>(...) (..) { ... }
```

**Const / Var Block**

```go
// <Group purpose (optional): enumeration of states, defaults, etc>.
const (
    // <Name> <meaning/units>.
    <Name> = <value>
)
```

---

## Minimal Algorithm

1. **Enumerate packages** with `go list ./...`.
2. For each package:

   * Ensure `doc.go` exists with a block comment; if missing, create it.
   * Parse files and locate all declarations (types, interfaces, funcs/methods, consts, vars).
   * For **structs**, ensure **each field** has a `//` comment (skip pure embedded fields if intentional).
   * Add or fix comments to meet the **Style Rules**.
3. **Generate a patch** (`git diff`) and a coverage report.
4. If running in **review mode**, output the report + suggested fixes only.
5. If running in **generate mode**, output the patch (unified diff).

---

## Quality Gates

* **100% documentation coverage** for packages and top-level exported API.
* Unexported declarations documented unless intentionally private noise—prefer brief one-liners.
* First sentence present tense, ends with a period.
* No trailing whitespace; `gofmt` clean.
