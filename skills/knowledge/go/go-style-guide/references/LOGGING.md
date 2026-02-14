# Logging

Logging is owned by the application, not by reusable packages.

Packages should:
- return errors
- expose status/results
- provide hooks/callbacks
- avoid emitting logs directly

The goal is to keep packages reusable, deterministic, and testable.

---

## Default Rule: Packages Do Not Log

Avoid in libraries:
- `log.*`
- `fmt.Print*`
- writing to `os.Stdout` / `os.Stderr`
- creating global loggers
- `init()`-time logging setup

Instead:
- propagate errors to the caller
- allow the app/service to decide what to log and how

---

## The Exception: Async / Network / Runtime Packages

Some packages legitimately need to record events because:
- work happens asynchronously
- errors occur outside the initiating call-site
- there is a runtime loop that must continue running
- observability is part of the package’s contract (rare)

In those cases, logging may exist, but it must be:

1) **Injected**  
2) **Optional**  
3) **Standardized on `*slog.Logger`**  
4) **Never global**  
5) **Safe by default** (no panics, no uncontrolled output)

---

## Preferred Injection Pattern: `*slog.Logger` via Config
```go
type Config struct {
    Logger *slog.Logger
}

type Worker struct {
    log *slog.Logger
}

func New(cfg Config) *Worker {
    // Never force logging on users.
    // If nil, use slog's discard logger.
    log := cfg.Logger
    if log == nil {
        log = slog.New(slog.NewTextHandler(io.Discard, nil))
    }

    return &Worker{log: log}
}
```
### Why discard?

- prevents accidental output during tests
- avoids coupling libraries to process stdout/stderr
- keeps behavior stable and deterministic

---

## Prefer Error Surfacing Over Logging

If something fails, return an error.
```go
func (w *Worker) Run(ctx context.Context, input []byte) ([]byte, error) {
    output, err := w.run(ctx, input)
    if err != nil {
        return nil, fmt.Errorf("run: %w", err)
    }
    return output, nil
}
```
Only log in-package when:

- failure cannot be returned to the caller
- failure happens after the call returns (async)

---

## Async Error Handling: Prefer `OnError` over `errCh`

`errCh` works, but a callback is often cleaner for callers and agents.

### Pattern

- Provide `OnError func(error)` in `Config`
- Default to a no-op function
- Invoke it whenever async work fails
- Still allow the app to decide whether to log, count metrics, or crash
```go
type Config struct {
    Logger  *slog.Logger
    OnError func(error)
}

type Worker struct {
    log    *slog.Logger
    onErr  func(error)
}

func New(cfg Config) *Worker {
    log := cfg.Logger
    if log == nil {
        log = slog.New(slog.NewTextHandler(io.Discard, nil))
    }

    onErr := cfg.OnError
    if onErr == nil {
        onErr = func(error) {}
    }

    return &Worker{
        log:   log,
        onErr: onErr,
    }
}

func (w *Worker) runAsyncTask(ctx context.Context) {
    go func() {
        if err := w.doWork(ctx); err != nil {
            // Prefer surfacing. Logging is optional and caller-controlled.
            w.onErr(err)

            // Optional: log locally if this package's contract demands it.
            // Keep it structured.
            w.log.Error("async task failed", "err", err)
        }
    }()
}
```
### Notes

- `OnError` is the contract; logging is optional.
- If you do log, keep it structured (keys, not formatted strings).
- Avoid spamming logs for transient, expected errors.

---

## When Local Logging is Acceptable

Local logging is acceptable when:

- the package is effectively a runtime (long-running loop)
- errors occur after the initiating call returns
- there is no other mechanism to surface failure in context
- the library is already part of an app boundary layer

Even then:

- default to discard
- document the behavior
- keep log volume predictable

---

## What Not To Do

### Do not create a logger internally that writes to stdout/stderr
```go
// ❌ Avoid
log := slog.New(slog.NewTextHandler(os.Stdout, nil))
```
### Do not swallow errors just because you logged them
```go
// ❌ Avoid
if err != nil {
    c.log.Error("failed", "err", err)
    return nil
}
```
Return errors whenever possible.

---

## Summary

- Libraries do not log by default.
- The application owns logging decisions.
- If logging is necessary, inject `*slog.Logger` via `Config`.
- Prefer `OnError func(error)` for async failures; `errCh` is acceptable but less ergonomic.
- Default logging to discard to avoid hidden output and test pollution.
