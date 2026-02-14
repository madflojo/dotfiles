# Error Handling (Sentinel-First)

Errors are part of the public API contract.

In this style guide, **packages should prefer sentinel errors whenever possible** so callers can reliably detect and handle failure modes.

This applies especially to reusable libraries, SDKs, drivers, and infrastructure code.

---

## Core Principles

### 1. Prefer Sentinel Errors for Meaningful Cases

If an error represents a stable condition a caller may want to handle, define it:
```go
var ErrNotFound = errors.New("not found")
var ErrInvalidConfig = errors.New("invalid config")
var ErrTimeout = errors.New("timeout")
```
Sentinel errors create a shared vocabulary between package and caller.

---

### 2. Callers Should Use `errors.Is`

Sentinel errors are only useful if callers can test them:
```go
if errors.Is(err, ErrNotFound) {
    // handle missing case
}
```
Never require string matching.

---

### 3. Wrap Errors with `%w` (Not `%s`)

Always preserve unwrap semantics:
```go
return fmt.Errorf("%w: %v", ErrInvalidConfig, field)
```
Or:
```go
return fmt.Errorf("dial failed: %w", err)
```
Avoid:
```go
return fmt.Errorf("dial failed: %s", err) // breaks errors.Is
```
---

### 4. Combine Errors with `errors.Join`

When multiple failures matter:
```go
return errors.Join(ErrRunFailed, err)
```
This keeps both:

- the sentinel meaning (`ErrRunFailed`)
- the underlying cause (`err`)

Callers can still do:
```go
errors.Is(err, ErrRunFailed)
```
---

## Package Error Discipline

### Packages Must Return Errors, Not Log Them

Libraries should not decide how errors are surfaced.

Good:
```go
func (e *Executor) Run(ctx context.Context, input []byte) error {
    if err := e.call(ctx, input); err != nil {
        return fmt.Errorf("%w: %w", ErrRunFailed, err)
    }
    return nil
}
```
Bad:
```go
log.Printf("request failed: %v", err)
return nil
```
---

### Do Not Swallow Errors Silently

If an operation is best-effort, document it clearly:
```go
// Flush attempts to send metrics but does not fail the caller.
// Errors are intentionally ignored.
func (m *Metrics) Flush() {
    _, _ = m.do(...)
}
```
Default behavior should always be explicit error returns.

---

## Typed Errors (Use Sparingly)

Typed errors are useful only when the caller needs structured detail:
```go
type StatusError struct {
    Code int
}

func (e *StatusError) Error() string {
    return fmt.Sprintf("unexpected status: %d", e.Code)
}
```
Callers can do:
```go
var se *StatusError
if errors.As(err, &se) {
    // inspect se.Code
}
```
Sentinel-first is still preferred for most cases.

---

## Constructor Error Rules

Constructors must validate inputs and fail fast:
```go
func New(cfg Config) (*Executor, error) {
    if cfg.Runner == nil {
        return nil, ErrInvalidConfig
    }
    return &Executor{cfg: cfg}, nil
}
```
Do not defer invalid configuration errors until runtime.

---

## Error Naming Conventions

- Package-level: `Err*`
- Stable meaning: short, durable wording
- No exported error strings that include dynamic data

Good:
```go
var ErrRouteNotFound = errors.New("route not found")
```
Bad:
```go
errors.New("route foo not found") // too specific
```
Context belongs in wrapping, not in the sentinel.

---

## Error Contract Checklist

When adding or reviewing an error path:

- Is this a condition callers may want to branch on?
  → define a sentinel

- Does wrapping preserve `errors.Is`?
  → must use `%w` or `errors.Join`

- Is the error returned, not logged?
  → packages return, apps log

- Is the error message stable and meaningful?
  → short, domain-focused

---

## Recommended Pattern Summary

Preferred package error shape:
```go
var ErrInvalidConfig = errors.New("invalid config")
var ErrRunFailed = errors.New("run failed")

func New(cfg Config) (*Executor, error) {
    if cfg.Runner == nil {
        return nil, ErrInvalidConfig
    }
    return &Executor{cfg: cfg}, nil
}

func (e *Executor) Run(ctx context.Context, input []byte) error {
    _, err := e.cfg.Runner.Run(ctx, input)
    if err != nil {
        return errors.Join(ErrRunFailed, err)
    }
    return nil
}
```
This gives callers:

- stable branching (`errors.Is`)
- underlying context
- predictable contracts

---

## Guiding Rule

**If the caller might care, make it sentinel.**
**If it’s unexpected, wrap it.**
**If it’s a package, return it.**
