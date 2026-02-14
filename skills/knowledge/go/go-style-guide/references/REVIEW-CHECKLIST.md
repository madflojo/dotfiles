# Go Style Guide — Review Checklist (Humans + Agents)

This checklist is the practical enforcement layer of the style guide.

Use it when:
- reviewing PRs
- restructuring packages
- introducing new APIs
- evaluating consistency across a repo
- guiding coding agents toward preferred patterns

The goal is not perfection.
The goal is consistency, clarity, and long-term maintainability.

---

## Package + Directory Structure

### Package boundaries
- [ ] Packages are domain-focused, not generic buckets.
- [ ] No `utils/`, `common/`, or “junk drawer” packages.
- [ ] No catch-all `types.go` or `errors.go` files unless the package is truly tiny.
- [ ] Responsibilities are clear from directory names alone.

### Structure discipline
- [ ] Small/medium projects avoid excessive nesting.
- [ ] Large projects group packages intentionally (ex: `pkg/` is acceptable for clarity).
- [ ] Package imports remain readable (not deeply layered).

---

## Entry Points (`main.go`)

- [ ] `main.go` is thin: wiring + startup only.
- [ ] Core logic lives in `app/` or domain packages, not `cmd/`.
- [ ] Argument parsing and user-facing concerns stay in `main`.
- [ ] Shutdown and signals are handled cleanly.

---

## Config + Constructors

### Config-first API design
- [ ] Constructors follow: **Config in → struct out**.

Example:
```go
func New(cfg Config) (*Worker, error)
```
- [ ] Packages define their own `Config` structs.
- [ ] No global config objects passed everywhere (`*viper.Viper` anti-pattern).
- [ ] Defaults are applied explicitly in constructors.
- [ ] Validation happens at construction time.

### Functional options

- [ ] Functional options are not the default pattern.
- [ ] If used, there is a clear justification (large surface, evolving API, legacy).

---

## Interfaces + Testability

### Interfaces are for boundaries

- [ ] Interfaces exist to isolate external systems (DB, network, transports).
- [ ] Interfaces are small and capability-driven.
- [ ] Packages do not return interfaces unnecessarily.

Prefer:
```go
func New(cfg Config) (*Worker, error)
```
Not:
```go
func New(cfg Config) (Worker, error)
```
### Testability is first-class

- [ ] Dependencies are injected through Config or constructors.
- [ ] Packages can be tested independently without booting the full app.
- [ ] Interfaces improve test seams when used intentionally.

---

## Error Handling

### Sentinel-first design

- [ ] Packages define sentinel errors when meaningful.
```go
var ErrNotFound = errors.New("not found")
```
- [ ] Callers can reliably use `errors.Is`.

### Wrapping discipline

- [ ] Errors are wrapped with `%w`, not `%s`.
```go
return fmt.Errorf("load config: %w", err)
```
- [ ] `errors.Join` is used when multiple failures matter.
- [ ] Error chains are preserved for inspection.

### No swallowed failures

- [ ] Errors are returned, not ignored.
- [ ] “Fire-and-forget” is only used when explicitly acceptable.

---

## Logging Rules

- [ ] Non-app packages do not log directly.
- [ ] Logging belongs in `app` orchestration.
- [ ] If logging is required, it is injected via Config.
- [ ] Prefer `*slog.Logger` (stdlib).

No:

- `fmt.Println`
- `log.Printf`
- writing to `os.Stdout` / `os.Stderr`

Except in CLI entrypoints.

---

## File + Code Layout

### Go file organization

- [ ] Files follow idiomatic ordering:

1. types
2. consts/vars
3. sentinel errors
4. constructors
5. methods/functions

### Struct layout efficiency

- [ ] Struct fields are ordered to reduce padding.
- [ ] Hot-path structs avoid unnecessary pointer churn.
- [ ] Config structs remain readable even if not perfectly packed.

### Naming

- [ ] Small scopes use short names (`i`, `k`, `v`, `r`, `ctx`).
- [ ] Exported names are clear and domain-specific.
- [ ] Avoid stutter (`worker.Worker`).

---

## Concurrency + Lifecycle Safety

- [ ] Goroutines have clear cancellation paths.
- [ ] `context.Context` is used for lifecycle control.
- [ ] Background workers have Stop/Close methods if needed.
- [ ] No goroutine leaks (fire-and-forget is rare and justified).
- [ ] Mutex vs atomic choices are deliberate and documented.

---

## Type Discipline

- [ ] Avoid stringly-typed APIs where domain types help.
- [ ] Replace enum-like strings with typed constants when possible.
- [ ] Avoid boolean parameters that reduce clarity.

Prefer:
```go
type TLSMode int
```
Over:
```go
Run(..., insecure bool)
```
---

## Testing Expectations

- [ ] Table-driven tests are preferred.
- [ ] Subtests are used for variants.
- [ ] `t.Parallel()` is applied when safe.
- [ ] Packages are independently testable.
- [ ] CI includes `-race` and coverage.

---

## Benchmarks (Required for Hot Paths)

- [ ] Performance-sensitive packages include benchmarks.
- [ ] Benchmarks report allocations.
- [ ] Changes to hot paths include before/after numbers.
- [ ] Concurrency benchmarks exist when contention is possible.

---

## Final PR Questions

Before approving:

- Does this make the code easier to understand?
- Does this preserve long-term maintainability?
- Can the next engineer extend this safely?
- Does this align with Config-first + sentinel-first discipline?
- If performance matters: is there a benchmark?

---

## Summary

This checklist is the enforcement tool for the Go style guide.

Agents and humans should use it to ensure:

- clarity
- testability
- correctness
- performance awareness
- consistent Go engineering discipline
