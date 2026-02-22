---
name: init-readme
description: Generate a polished, accurate README.md from a repository by inspecting code, config, and structure. Use when bootstrapping a README, refreshing docs, or the user asks for project overview/getting started instructions.
license: Apache-2.0
compatibility: Requires git; may use language tooling depending on project (go, node, python, rust).
metadata:
  source: .prompts/init-readme.md
  version: "1.0"
---

# Create a Polished README.md for Any Project

## Goal
Produce a high-quality `README.md`:
- Clear **title + short tagline**
- Optional **logo**
- Relevant **badges**
- Conversational **hook**
- “What is <Project>?” section
- **Getting Started** with minimal, copy-pasteable examples
- **Structure** table of key packages/modules
- Friendly **closing**

Keep it accurate (no hallucinations), concise, and developer-friendly.

---

## Tooling You May Use
- Repo metadata & history
  - `git --no-pager log -n 20 --oneline`
  - `git --no-pager ls-files`
  - `git remote get-url origin`
- Language fingerprints (pick what applies)
  - Go: `go list -m` (module path), check for `go.mod`
  - Node: read `package.json`
  - Python: `pyproject.toml` / `setup.cfg`
  - Rust: `Cargo.toml`
- Code & examples discovery
  - Search `examples/`, `cmd/`, `docs/`, `internal/`, `pkg/`, `src/`
  - Look for a logo in `docs/img/*`, `assets/*`, `logo.*`
- Coverage/CI hints
  - Look for `codecov.yml`, GitHub Actions in `.github/workflows`, etc.

**Rule:** Prefer facts from code/config over assumptions. If unsure, add a small “(optional)” note or omit.

---

## Rules & Style
- **Tone:** friendly, crisp, “smart brevity” with tiny hints of personality.
- **Accuracy:** verify claims from code/tests; don’t invent features.
- **Examples:** minimal, runnable; show the *shortest path* to value.
- **Badges:** only include ones you can confidently compute (repo, language, docs).
- **Links:** prefer relative links for in-repo assets (e.g., `docs/img/logo.png`).
- **Emojis:** tasteful in headings (e.g., section icons) but don’t overdo it.

---

## What to Extract
- **Project name** (language artifact or repo name)
- **One-line tagline** (what it is + why it matters)
- **Logo path** if present
- **Badges** (selectively based on tech & repo):
  - GitHub default branch, Go version, Codecov, Docs site (pkg.go.dev/docs.rs/PyPI/npm), Go Report Card, CI status
- **Core features** (from code & docs)
- **Getting Started**:
  - *Library*: install/import + minimum example
  - *CLI*: install + first command + basic usage
  - *Service*: install + how to run + basic API call
- **Structure**: key packages/modules with short descriptions + doc links
- **Closing**: short call for feedback/PRs

---

## Output Format (write exactly this structure)

```markdown
# <ProjectName> <optional emoji>
<optional logo image, if found>

**<Short tagline (1 line)>**

<Badges block (only if resolvable)>

---

<1–3 paragraph hook that frames the pain/problem and why this project helps. Keep it human.>

---

## 🧠 What is <ProjectName>?
<Explain what it does, who it’s for, and the main use cases. Bullet the top 3–5 benefits.>

- <Benefit 1>
- <Benefit 2>
- <Benefit 3>

---

## 🚀 Getting Started

### Installation
<Show language-appropriate install. Examples:>

- **Go (library)**
  ```bash
  go get <module-path>
  ```
- **Node (library/CLI)**

  ```bash
  npm i <package-name>
  # or
  pnpm add <package-name>
  ```
- **Python (library/CLI)**

  ```bash
  pip install <package-name>
  ```
### Minimal Example

\<Provide the smallest runnable example. Use the project’s primary entry points.>
```<language>
<tiny, working example>
```
\<Optional: second example demonstrating a standout feature.>

---

## 🧱 Structure

\<Brief sentence: “The project is organized into focused modules so you can depend only on what you need.”>

| Module/Path   | Description      | Docs                             |
| ------------- | ---------------- | -------------------------------- |
| `<path/pkg>`  | <1-line summary> | [Reference](doc-link-or-api-ref) |
| `<path/pkg2>` | <1-line summary> | [Reference](doc-link-or-api-ref) |

(Add 2–6 rows; keep it tight.)

---

## 📦 Tech & Integrations (optional)

* Language/Runtime: \<e.g., Go 1.22, Node 20, Python 3.11>
* Key dependencies: \<e.g., net/http, cobra, sqlx>
* Builds/CI: \<e.g., GitHub Actions, Makefile targets>

---

## ✅ Status & Roadmap (optional)

* Current status: \<alpha/beta/stable>
* Near-term: <3 bullets of planned work or invite contributions>

---

## 🤝 Contributing

PRs welcome! Please see `CONTRIBUTING.md` (if present) and open an issue for discussion.

---

## 📄 License

<SPDX identifier or link to LICENSE>

---

## <Emoji + Project Vibe>!

\<Short, friendly sign-off encouraging issues/PRs. One tasteful emoji.>
```

---

## Badge Heuristics (the agent should apply automatically)

- **Repo**: parse `git remote get-url origin` → `<host>/<owner>/<repo>`
- **Go**:

  - Go version: `https://img.shields.io/github/go-mod/go-version/<owner>/<repo>`
  - Go Reference: `https://pkg.go.dev/badge/<module-path>.svg` → link to `https://pkg.go.dev/<module-path>`
  - Go Report Card: `https://goreportcard.com/badge/<module-path>` → link to report
- **Coverage (if Codecov present)**:

  - `https://codecov.io/gh/<owner>/<repo>/branch/<default-branch>/graph/badge.svg`
- **General CI (if GH Actions workflows exist)**:

  - `https://github.com/<owner>/<repo>/actions` (use named workflow badge if known)
- **Other ecosystems** (only if confident):

  - Rust: `docs.rs` badge; crates.io version
  - Python: PyPI version; Read the Docs
  - Node: npm version; bundle size (optional)

If any badge cannot be resolved confidently, **omit it**.

---

## Minimal Algorithm

1. Detect language & module/package name from project files.
2. Derive repo `<owner>/<repo>` from `git remote`.
3. Find optional logo path (`docs/img/*`, `assets/*`, `logo.*`).
4. Enumerate modules/paths (limit to top 2–6 user-facing).
5. Locate/compose a minimal “hello world” example for the main use case.
6. Assemble the README using the **Output Format**.
7. Validate links (badge URLs, docs references) exist; remove any broken ones.
8. Output final Markdown only (no extra commentary).
