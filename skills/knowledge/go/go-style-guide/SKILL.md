---
name: go-style-guide
description: Go engineering style guide for designing packages, services, and CLIs. Use for any Go work creating or reviewing packages/APIs, PR reviews, refactors/restructures, error/logging patterns, config/constructors, testing, and benchmarks.
license: Apache-2.0
metadata:
  author: Benjamin Cane
  version: "0.1"
---

# Go Style Guide Skill

This skill defines practical Go coding style and engineering patterns optimized for:
- **humans** reading/maintaining code
- **coding agents** generating/restructuring code reliably
- **production readiness** (correctness, testability, performance)

Use this skill anytime you are working with Go: new code, refactors, reviews, and architecture decisions.

---

## TL;DR

- Design for testability first; inject dependencies and keep logic pure.
- Prefer `Config` in → concrete struct out; validate and default in constructors.
- Errors are contracts: sentinel errors + `%w` or `errors.Join`.
- Keep packages reusable: no hidden globals, no default logging.
- Benchmark hot paths before claiming wins.
- Return concrete types; accept interfaces at boundaries.
- Keep `main.go` thin; app wiring lives in `app/`.

---

## House Style Disclaimer

This is intentionally opinionated. It favors consistency and long-term maintainability over accommodating every Go style preference.

---

## Quick Rules Table

| Topic | Rule | Reference |
| --- | --- | --- |
| Testability | Use interfaces at boundaries so users can create fakes/mocks | `references/INTERFACES.md` |
| Constructors | `Config` in → concrete struct out; validate + default in `New` | `references/CONFIG.md` |
| Errors | Prefer sentinel errors; wrap with `%w` or `errors.Join` | `references/ERRORS.md` |
| Logging | Packages do not log by default; app owns logging | `references/LOGGING.md` |
| Interfaces | Accept interfaces at boundaries; return concretes | `references/INTERFACES.md` |
| Layout | Keep packages shallow; avoid `utils/`/`common` | `references/LAYOUT.md` |
| Entry Points | `main.go` is wiring only | `references/LAYOUT.md` |
| Benchmarks | Benchmark hot paths; use `b.ReportAllocs()` | `references/BENCHMARKS.md` |
| Reviews | Use the checklist when reviewing Go changes | `references/REVIEW-CHECKLIST.md` |

---

## Common Pitfalls

- Returning interfaces by default instead of concrete types.
- Logging in reusable packages instead of returning errors.
- Passing global app config through packages rather than local `Config`.
- Hiding dependencies behind package-level globals.
- Over-structuring directory layouts in small projects.
- Shipping changes that claim performance wins without benchmarks.

---

## Core Principles

1) **Testability is first-class**
- Prefer designs that are easy to test without booting an entire application.
- Inject dependencies explicitly.
- Keep pure logic isolated.

2) **Config-driven construction**
- Prefer `Config in → struct out` constructors.
- Validate at construction.
- Default explicitly.

3) **Errors are a contract**
- Prefer **sentinel errors** where practical, especially in packages.
- Use `%w` (or `errors.Join`) so callers can use `errors.Is/As`.

4) **Benchmark what matters**
- Add benchmarks for performance-sensitive code paths.
- Avoid “it’s faster” claims without `go test -bench`.

5) **Packages are reusable by default**
- Keep packages domain-focused and individually testable.
- Avoid global state and hidden side effects.

---

## Package Types

### App package (orchestrator)
Owns:
- dependency wiring (DB, clients, loggers)
- lifecycle (start/stop)
- error policy (retry, ignore, crash)
- logging and metrics policy

### Non-app packages (reusable units)
Rules:
- No direct logging (see `references/LOGGING.md`)
- Return errors, don’t hide them
- Define a local `Config`/`Opts` contract
- Accept initialized dependencies (DB/client/etc), do not create them internally

---

## Directory Structure

### Services / apps
- `cmd/<appname>/main.go` for entrypoints
- Keep `main.go` **thin**: parse config, wire dependencies, call `app.Run(ctx, cfg)`

Example:
```
cmd/myapp/main.go
pkg/...
pkg/app/...
```
### Libraries
- Packages at top-level directories, or under `pkg/` if it improves clarity for newcomers.
- Avoid junk drawers (`utils`, `common`) unless they truly represent a domain.

---

## Constructors and Config

### Preferred constructor shape
- `New(cfg Config) (*T, error)` or `Dial(cfg Config) (*T, error)`
- Validate + default inside constructor
- Return a **concrete** type by default

### Interfaces: yes, when they pay rent
Interfaces improve testability, but don’t return interfaces *by default*.

Prefer:
- **accept interfaces** at boundaries (dependency injection)
- **return concrete types**, unless there is a clear multi-impl boundary or you must hide implementation

---

## Canonical Config Example (Generic Executor)

This is the “accepted” pattern: `Config` drives behavior, constructor returns a concrete struct, and test seams are explicit.
```go
// Runner provides a minimal contract for executing work.
type Runner interface {
    Run(ctx context.Context, input []byte) ([]byte, error)
}

// Config configures behavior and dependencies.
type Config struct {
    Timeout time.Duration
    Runner  Runner
}

// executor implements Runner-backed execution.
type executor struct {
    cfg  Config
    run  Runner
}
```
Guidance:

- Config is **owned by the package** (not passed around as global app config)
- Defaults apply in `New` (e.g., timeout, Runner)
- Validate at construction when possible

---

## Logging

Logging is owned by the application.

If a package must log (rare async/network/runtime cases), inject **`*slog.Logger`** via `Config`, default to discard, and keep structured logs.

See: `references/LOGGING.md`

---

## Errors

### Prefer sentinel errors in packages

- Export `var ErrX = errors.New("...")` for stable meaning
- Wrap with `%w` or use `errors.Join` so `errors.Is` works

Rules:

- Don’t use `%s` to wrap errors (it breaks unwrap semantics)
- Add context with wrapping: `fmt.Errorf("doing X: %w", err)`

---

## File Organization and Efficiency

### Go file layout (practical default)

Within a package:

1. package comment (if primary file)
2. imports
3. constants / vars
4. types (interfaces + structs)
5. constructors
6. methods
7. functions (helpers last)

Avoid catch-all buckets like `types.go`, `constants.go`, `util.go` unless strongly justified.

### Struct field efficiency

- Keep hot-path structs compact where it matters
- Consider field ordering to reduce padding (especially large arrays, bools, pointers)
- But do not micro-optimize without benchmarks

---

## Benchmarks

Add benchmarks for:

- serialization/deserialization
- hot-path functions
- concurrency primitives and contention paths
- adapters/wrappers in tight loops

Benchmark rules:

- Use `b.ReportAllocs()`
- Include realistic inputs
- Compare alternatives if proposing a change

---

## Top-level Interfaces + Implementations

A preferred pattern:

- define a small boundary interface in a top-level package
- provide implementations in subpackages (`drivers/`, `backends/`, etc.)
- keep contracts small and stable

Use when:

- multiple implementations exist (real + mock, or multiple backends)
- it clarifies architecture and enables testing

---

## Reference Index

Use these supporting documents when deeper detail is needed:

- [references/LOGGING.md](references/LOGGING.md)
  Logging rules: default “no logging in packages,” exceptions, slog injection.

- [references/ERRORS.md](references/ERRORS.md)
  Sentinel-first error design, wrapping rules, errors.Is/As contracts.

- [references/CONFIG.md](references/CONFIG.md)
  Canonical Config struct patterns, constructor validation + defaults.

- [references/INTERFACES.md](references/INTERFACES.md)
  Interface boundaries, driver patterns, testability-first design.

- [references/LAYOUT.md](references/LAYOUT.md)
  File organization, struct field efficiency, package naming guidance.

- [references/BENCHMARKS.md](references/BENCHMARKS.md)
  Benchmark expectations, templates, performance validation rules.

- [references/REVIEW-CHECKLIST.md](references/REVIEW-CHECKLIST.md)
  PR review rubric for humans and coding agents.
