# Configuration + Constructors (Config Struct Pattern)

In this style guide, **configuration is explicit**.

Packages should be constructed with a clear `Config` struct, apply defaults predictably, validate inputs early, and return a concrete runtime object.

This is one of the most consistent patterns across Ben Cane–style Go codebases.

---

## Core Principles

### 1. Prefer `Config` Structs Over Functional Options

Functional options have a place, especially in legacy or ecosystem-driven APIs.

But new code should default to:

- `Config` in
- defaults applied explicitly
- validation at construction
- struct returned back
```go
cfg := Config{
    Namespace: "tarmac",
}

c, err := New(cfg)
```
This is clearer for:

- humans
- coding agents
- test scenarios
- long-lived maintenance

---

### 2. Constructors Must Be Explicit

Preferred constructor forms:

- `New(cfg Config) (*T, error)`
- `Dial(cfg Config) (*T, error)`

Constructors should:

- validate required fields
- apply defaults
- return sentinel errors

---

## Canonical Pattern

### Example: Generic Executor

This is the preferred shape:
```go
// Executor defines the public contract.
type Executor interface {
    Run(ctx context.Context, input []byte) ([]byte, error)
}

// Runner is a minimal dependency for executing work.
type Runner interface {
    Run(ctx context.Context, input []byte) ([]byte, error)
}

// Config configures executor behavior and dependencies.
type Config struct {
    Timeout time.Duration

    // Runner allows injection for tests.
    Runner Runner
}

// executor is the concrete implementation.
type executor struct {
    cfg  Config
    run  Runner
}
```
Key takeaways:

- Interface is boundary-driven (`Executor`)
- Config is explicit and documented
- Concrete struct holds runtime behavior

---

## Constructor Rules

### Apply Defaults Explicitly

Do not rely on implicit zero-value magic when defaults matter.
```go
func New(cfg Config) (*executor, error) {
    if cfg.Timeout == 0 {
        cfg.Timeout = DefaultTimeout
    }

    if cfg.Runner == nil {
        cfg.Runner = DefaultRunner
    }

    return &executor{
        cfg:  cfg,
        run: cfg.Runner,
    }, nil
}
```
Defaults must be:

- visible
- documented
- stable

---

### Validate Early (Fail Fast)

Invalid config should fail in `New`, not later.
```go
var ErrInvalidConfig = errors.New("invalid config")

func New(cfg Config) (*executor, error) {
    if cfg.Runner == nil {
        return nil, ErrInvalidConfig
    }

    return &executor{cfg: cfg}, nil
}
```
---

### Return Concrete Types Unless Interface Return Is Required

Preferred:
```go
func New(cfg Config) (*ExecutorImpl, error)
```
Interface returns are useful when:

- multiple implementations exist
- drivers are swapped dynamically
- mocking is part of the API contract

Avoid returning interfaces “just because.”

---

## Config Ownership Rules

### Packages Own Their Own Config

Do not pass global application config everywhere.

Bad:
```go
func New(v *viper.Viper) *Server
```
Good:
```go
type Config struct {
    Addr string
    Timeout time.Duration
}

func New(cfg Config) (*Server, error)
```
Config should be:

- local
- typed
- testable

---

### Avoid Config Coupling Between Packages

Do not inject another package’s Config struct directly unless unavoidable.

Bad:
```go
func Dial(log *logger.Logger, cfg *config.Config)
```
Better:
```go
type Config struct {
    Addr string
    Password string
}
```
Push only what you need.

---

## Config Struct Layout

Config fields should be:

- grouped logically
- documented
- ordered for readability

Example:
```go
type Config struct {
    // Identity / namespace
    Namespace string

    // Core behavior knobs
    Timeout time.Duration
    MaxSize int

    // Boundary injections (tests, drivers)
    Logger *slog.Logger
    Dialer DialFunc
}
```
---

## Logging Injection Exception

Packages should not log by default.

If logging is truly required (async TCP, grpc internals), then:

- inject via Config
- use `*slog.Logger`
- document it as an exception
```go
type Config struct {
    Logger *slog.Logger
}
```
---

## Testability Benefits

Config structs make testing easy:
```go
type failingRunner struct{}

func (f failingRunner) Run(ctx context.Context, input []byte) ([]byte, error) {
    return nil, errors.New("boom")
}

func TestExecutorTimeout(t *testing.T) {
    e, err := New(Config{
        Timeout: 10 * time.Millisecond,
        Runner: failingRunner{},
    })
    require.NoError(t, err)

    _, err = e.Run(context.Background(), nil)
    require.Error(t, err)
}
```
This is one of the main reasons Config-first design is preferred.

---

## Summary Rules

- Config struct is the default contract
- Defaults must be explicit
- Validate early, fail fast
- Return concrete structs unless interface return is required
- Config belongs to the package, not the app
- Inject boundaries through Config for testability
- `*slog.Logger` is the standard logging injection type

---

## Guiding Rule

**Configuration should make behavior obvious at construction time.**
