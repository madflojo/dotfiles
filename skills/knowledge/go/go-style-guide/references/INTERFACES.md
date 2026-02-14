# Interfaces + Implementations (Boundary-Driven Design)

Interfaces are one of Go’s most powerful tools.

In this style guide, interfaces are treated as:

- **testability primitives**
- **package boundaries**
- **driver/plugin contracts**
- **coordination surfaces**

Not as default return types everywhere.

---

## Core Philosophy

### Interfaces Improve Testability

Interfaces make code easier to test by allowing injection of:

- fakes
- mocks
- alternate implementations
- runtime drivers

Example:
```go
type Database interface {
    Get(ctx context.Context, key string) ([]byte, error)
    Set(ctx context.Context, key string, value []byte) error
    Close() error
}
```
Your application becomes testable without spinning up real dependencies.

---

## Rule: Interfaces Belong at Boundaries

Interfaces should exist where the system crosses a boundary:

- database driver
- runtime capability
- external service boundary
- logging sink
- queue or scheduler backend

Good:
```go
type Runner interface {
    Run(ctx context.Context, input []byte) ([]byte, error)
}
```
Good:
```go
type KVStore interface {
    Get(key string) ([]byte, error)
}
```
Bad:
```go
type UserService interface {
    DoThing()
}
```
If there is only one implementation and no boundary, the interface is usually unnecessary.

---

## Rule: Prefer Small Interfaces

Interfaces should be:

- narrow
- capability-focused
- stable

Good:
```go
type Reader interface {
    Read(p []byte) (int, error)
}
```
Good:
```go
type Logger interface {
    Error(msg string, args ...any)
}
```
Bad:
```go
type Everything interface {
    Start()
    Stop()
    Reload()
    Debug()
    Export()
    Metrics()
}
```
Large interfaces reduce flexibility and are harder to mock correctly.

---

## Preferred Pattern: Interface at Top-Level, Implementations in Subpackages

This is the “drivers” model used in many Go libraries.

Example structure:
```
store/
├── database.go          # Interface + shared errors
├── drivers/
│   ├── file/
│   ├── memory/
│   ├── noop/
│   └── mock/
```
### Root Interface
```go
package store

type Database interface {
    Get(ctx context.Context, key string) ([]byte, error)
    Set(ctx context.Context, key string, value []byte) error
    Close() error
}
```
### Driver Implementation
```go
package memory

type Database struct {
    items map[string][]byte
}

func Dial(cfg Config) (*Database, error) {
    ...
}
```
This keeps:

- contract stable
- implementations modular
- testing straightforward

---

## Rule: Constructors Usually Return Concrete Types

Preferred:
```go
func Dial(cfg Config) (*Database, error)
```
Not:
```go
func Dial(cfg Config) (store.Database, error)
```
Concrete returns provide:

- clearer API surface
- discoverability
- easier extension

---

## When Returning Interfaces Is Correct

Returning an interface is appropriate when:

### Multiple Implementations Are Expected
```go
func Open(cfg Config) (Database, error)
```
### The Implementation Must Remain Hidden
```go
func New(cfg Config) (Executor, error)
```
### Plugin/Driver Selection Happens at Runtime
```go
switch cfg.Driver {
case "memory":
    return memory.Dial(...)
case "mock":
    return mock.Dial(...)
}
```
---

## Rule: Do Not Define Interfaces “For Mocking”

Interfaces should reflect **real boundaries**, not just unit-test convenience.

Bad:
```go
type Foo interface {
    DoFoo()
}
```
if Foo exists only so tests can mock it.

Instead:

- test against concrete structs
- inject real boundaries (DB, runners, queues)

---

## Injection Pattern: Config + Interface Boundary

Interfaces are often injected through Config.

Example:
```go
type Config struct {
    Database store.Database
    Logger   *slog.Logger
}
```
Constructor:
```go
func New(cfg Config) (*Service, error) {
    if cfg.Database == nil {
        return nil, ErrDatabaseRequired
    }
    return &Service{db: cfg.Database}, nil
}
```
---

## Function Interfaces (SDK-Like Pattern)

In SDK-style packages, a function type is often the best interface.

Example:
```go
type Config struct {
    Run func(ctx context.Context, input []byte) ([]byte, error)
}
```
This avoids large mock surfaces while still enabling test injection.

---

## Interfaces and Error Contracts

Interfaces should pair with:

- sentinel errors
- `errors.Is` compatibility
- predictable failure modes

Example:
```go
var ErrNotFound = errors.New("not found")

func (d *Database) Get(...) error {
    return fmt.Errorf("%w: %s", ErrNotFound, key)
}
```
---

## Summary Rules

- Interfaces exist for boundaries and testability
- Keep interfaces small and capability-driven
- Prefer top-level interface + subpackage implementations
- Constructors return concrete structs by default
- Return interfaces only when required by design
- Inject dependencies via Config
- Pair interfaces with sentinel errors and errors.Is contracts

---

## Guiding Rule

**Interfaces should clarify architecture, not obscure it.**
