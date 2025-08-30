# Personal AGENTS.md

## Dev environment tips
- **Indentation**: default to **2 spaces**, except:
  - **Go** → always use official tooling (`gofmt`, `goimports`) over personal preference.
  - **Makefiles** → must use tabs.
  - Other languages → follow strong ecosystem conventions (e.g., Python = 4 spaces).
- Prefer `Makefile` targets:
  - `make build`, `make tests`, `make benchmarks`, `make format`, `make lint`, `make clean`
  - Per-package: `make -C <pkg> tests`
- Check for a `dev-compose.yml` for local testing with dependencies (e.g., databases).
- Use the GitHub CLI for PRs, reviews, and issues: `gh pr create`, `gh pr review`, `gh issue create`.
- `act` is available for local GitHub Actions testing.
- Check the runtime platform (OS, arch) for compatibility when building/running locally.
- Use Docker for consistent environments when needed, especially if host OS differs from CI.

## Working style
- **Interface-Driven Design (IDD) + Test-Driven Development (TDD)**:
  1. **Define the interface** (no implementation) — shape the public API and contracts first.
  2. **Write tests** against the interface (table-driven where possible).
  3. **Implement** just enough functionality to satisfy the tests.
  4. **Repeat steps 2 and 3** (expand tests → expand implementation) until complete.
- Keep changes small, cohesive, and testable.
- Keep your interactions lighthearted but clear and contextual.
- Ask clarifying questions, don’t assume — it’s better to ask than to guess wrong.
- Use of emojis is fun 😎, but keep it relevant and not excessive. (Encouraged in **reviews, docs, and PRs**, not in code comments).

## Coding style

### General
- Prefer **table-driven tests**.
- Clear, lighthearted tone in comments/docs, but keep guidance **concise and contextual**.
- Use descriptive names for packages/files; use **short names** only in tiny scopes (loops, small helpers).
- Apply smart brevity concepts in documentation — concise, clear, contextual — but don’t oversimplify.

### Go
- **Docs & comments**:
  - `/* ... */` for **top-level package documentation** at file start.
  - `//` for **function/method Go docs**, inline comments, and general commentary.
- **Idiomatic Go first** (community best practices beat personal quirks).
- **Formatting**: always `gofmt`/`goimports` (tooling rules).
- **Linting**: use `golangci-lint` with project config. Check the Makefile for lint/format targets.
- **Errors**:
  - Use exported `Err*` vars.
  - Wrap with `%w`; check with `errors.Is`.
- **Benchmarks**: write them using `BenchmarkXxx(b *testing.B)` for performance-sensitive paths.

## Testing instructions
- Run tests via `make tests`; per-module example: `make -C http tests`.
- **Functional testing with unit test frameworks** (e.g., Go `testing`) is preferred:
  - Black-box tests at module boundaries using mocks/fakes.
  - Avoid BDD frameworks and Gherkin — **no BDD**.
- Cover both **happy** and **error** paths.
- Ensure coverage and race checks pass before committing.

## Clarifications
- If something’s ambiguous, ask **concise clarifying questions** before proceeding.
- Don’t assume — it’s better to ask than to guess wrong.
