# LAYOUT.md

This reference defines how to organize Go code for **readability**, **maintainability**, and **runtime efficiency**.

It applies to both:

- standalone libraries
- backend services
- hybrid runtimes and SDK-style projects

The goal is to guide both **humans** and **coding agents** toward consistent, idiomatic Go structure.

---

## Goals

1. **Scanability**  
   A reader should understand the shape of a package in seconds.

2. **Testability-first design**  
   Packages should be independently testable with clear seams.

3. **Efficiency where it matters**  
   Hot-path types and struct layouts should be intentional.

4. **Predictability**  
   Consistent conventions reduce cognitive load and agent drift.

---

## Directory layout guidance

### Standalone libraries

For a library repository:

- keep packages shallow
- avoid unnecessary nesting
- avoid `internal/` unless you truly need enforcement

Example:
```
.
├── go.mod
├── README.md
├── worker.go
├── config.go
├── drivers/
│   ├── file/
│   └── memory/
└── docs/
```
Library repos already define a boundary.  
Over-structuring usually adds friction.

---

### Services / applications

For backend services and apps:

- entrypoints live in `cmd/`
- all real packages live under `pkg/`
- runtime orchestration lives in `pkg/app`

This provides one consistent rule:

> If it’s not `main`, it belongs in `pkg/`.

Example:
```
.
├── cmd/
│   └── myapp/
│       └── main.go
├── pkg/
│   ├── app/          # runtime orchestration + lifecycle
│   ├── config/       # config parsing + validation
│   ├── database/     # external system boundaries
│   ├── worker/       # capability-focused package
│   └── telemetry/    # metrics/tracing/logging wiring
└── README.md
```
Rule of thumb:

- `cmd/` = startup + user-facing wiring only
- `pkg/app` = dependency coordination + lifecycle
- `pkg/*` = domain-focused packages

---

## Package boundaries

### Prefer domain packages over buckets

Good:

- `pkg/worker`
- `pkg/tlsconfig`
- `pkg/cache/lookaside`

Avoid:

- `pkg/utils`
- `pkg/common`
- `pkg/helpers`

Generic buckets become junk drawers and reduce clarity.

---

## File naming

### Prefer domain file names over catch-alls

Good:

- `request.go`
- `response.go`
- `retry.go`

Avoid:

- `types.go`
- `constants.go`
- `util.go`

If a file becomes “mixed,” it’s often a signal the package boundary is wrong.

---

### Primary file convention

A package’s main exported surface often lives in a file matching the package name:

- `config/config.go`
- `database/database.go`

This improves navigation.

---

## In-file ordering

Files should follow idiomatic Go structure and be predictable.

Recommended ordering:

1. Package docs + `package x`
2. Imports
3. Constants and vars
4. Sentinel errors
5. Exported types
6. Interfaces
7. Config structs
8. Constructors
9. Exported functions/methods
10. Unexported helpers

Avoid `init()` unless absolutely required.

---

### Example skeleton
```go
// Package worker provides task execution via an injected Runner.
package worker

import (
	"errors"
	"context"
	"time"
)

// Exported constants.
const DefaultTimeout = 3 * time.Second

// Sentinel errors.
var (
	ErrInvalidConfig = errors.New("worker: invalid config")
	ErrRunFailed     = errors.New("worker: run failed")
)

// Boundary interface.
type Runner interface {
	Run(ctx context.Context, input []byte) ([]byte, error)
}

// Config defines construction-time behavior.
type Config struct {
	Timeout time.Duration
	Runner Runner
}

// New validates config, applies defaults, and returns a concrete worker.
func New(cfg Config) (*worker, error) {
	if cfg.Timeout == 0 {
		cfg.Timeout = DefaultTimeout
	}
	if cfg.Runner == nil {
		return nil, ErrInvalidConfig
	}

	return &worker{cfg: cfg}, nil
}

// Unexported implementation.
type worker struct {
	cfg Config
}
```
---

## Interfaces and testability

Interfaces are a tool for **testability and boundary isolation**.

### Interfaces belong at boundaries

Good uses:

- database drivers
- transport injection
- network transports
- external service clients

Avoid interfaces purely for abstraction layering.

---

### Constructors should usually return concrete types

Prefer:
```go
func New(cfg Config) (*Worker, error)
```
Not:
```go
func New(cfg Config) (Worker, error)
```
Returning interfaces can hide behavior and complicate extension.

Exception:

- when the package’s primary purpose is a driver interface
- when multiple implementations are expected immediately

Testability is still achieved through injected dependencies and boundary interfaces.

---

## Struct field layout and efficiency

### Field ordering matters in hot paths

Struct layout affects:

- padding
- cache locality
- allocation behavior

Guidelines:

1. Group by alignment size (largest → smallest)
2. Keep hot fields close together
3. Optimize hot-path structs more than config structs

Example:

Bad:
```go
type Stats struct {
	ok    bool
	count uint64
	name  string
	err   error
}
```
Better:
```go
type Stats struct {
	count uint64
	err   error
	name  string
	ok    bool
}
```
Do not over-optimize config structs.
Optimize where benchmarks justify it.

---

## Receiver naming

Receivers should be short and consistent:

- `e *Executor`
- `w *Worker`
- `s *Server`
- `db *Database`
- `r *Router`

Avoid verbose receiver names.

---

## Export discipline

- Export only what users need.
- Prefer unexported fields/methods.
- Exported struct fields are acceptable for JSON/YAML boundaries.

---

## Tests and benchmarks

### Tests

- Prefer table-driven tests for behavior matrices
- Use subtests with clear names
- Apply `t.Parallel()` when safe

Example:
```go
func TestWorker_Run(t *testing.T) {
	tests := []struct {
		name string
		input  []byte
		wantErr error
	}{...}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			...
		})
	}
}
```
---

### Benchmarks

Hot paths should have benchmarks.

- report allocations
- use realistic inputs
- track trends over time

Naming:

- `BenchmarkNew`
- `BenchmarkDo_SmallPayload`
- `BenchmarkDo_LargePayload`

---

## Main package layout

Main should do only:

- argument/env parsing
- config load
- dependency wiring
- app start + shutdown

Main should not contain core business logic.

Example flow:
```
cmd/myapp/main.go
  -> load config
  -> app.New(cfg)
  -> app.Run(ctx)
```
Where:
```go
import "myapp/pkg/app"
```
---

## When to split files or packages

Split a file when:

- it exceeds ~300–400 lines
- it becomes hard to scan

Split a package when:

- it becomes a god package
- tests require booting unrelated systems
- multiple domains are mixed

---

## Summary checklist

- [ ] Packages are domain-focused, not buckets
- [ ] No `utils/` or `common/`
- [ ] File ordering is predictable
- [ ] Interfaces improve testability at boundaries
- [ ] Struct layout is efficient in hot paths
- [ ] Tests are table-driven where useful
- [ ] Benchmarks exist for performance-sensitive code
- [ ] `cmd/` is thin, `pkg/app` orchestrates runtime
