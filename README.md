# dotfiles 🧰

**Terminal/editor configs and reusable Agent Skills for consistent dev workflows.**

[![License](https://img.shields.io/github/license/madflojo/dotfiles)](LICENSE)

---

Setting up a new machine shouldn't mean hunting for dotfiles or rewriting the same workflow notes. This repo keeps a small, focused set of configs plus a library of Agent Skills for common tasks like reviews, PRs, commits, and repo discovery.

It's intentionally minimal: a few trusted config files and a skills library that keeps work predictable without slowing you down.

---

## 🧠 What is dotfiles?
A lightweight collection of Vim/tmux configs and practical Agent Skills for consistent, fast developer workflows.

- Centralizes Vim and tmux preferences for frictionless setup
- Provides reusable skills for PRs, commits, reviews, and repo discovery
- Encourages concise, conventional, and verifiable practices (IDD/TDD mindset)

---

## 🧱 Structure

The project is organized into focused modules so you can depend only on what you need.

| Module/Path | Description | Docs |
| --- | --- | --- |
| `.vimrc` | Vim defaults, plugins, and editor preferences | [Reference](.vimrc) |
| `.tmux.conf` | tmux status line and key bindings | [Reference](.tmux.conf) |
| `.carbon-now.json` | Preset for carbon.now.sh exports | [Reference](.carbon-now.json) |
| `AGENTS.md` | Instruction entry point, TOC, and task-based loading | [Reference](AGENTS.md) |
| `AGENTS-*.md` | Working style, workflow, validation, review, and architecture guidance | [Loading rules](AGENTS.md#loading-and-routing) |
| `skills/actions/` | Action-oriented skills (git, docs, go, review, agent) | [Reference](skills/actions/docs/init-readme/SKILL.md) |
| `skills/knowledge/` | Reference skills and style guides | [Reference](skills/knowledge/go/go-style-guide/SKILL.md) |

## Agent guidance installation

Copy the shared guidance as a complete set into the user's home directory. First inspect and back up existing destination files. If a destination is a symlink, remove only the link before copying; plain `cp` follows destination symlinks and does not migrate them to regular files. Apply the same precaution to separate agent entrypoints. Preserve `AGENTS-local.md` separately. From this repository, after preparing the destinations:

```sh
cp AGENTS.md AGENTS-working-style.md AGENTS-workflow.md AGENTS-validation.md AGENTS-review.md AGENTS-architecture.md "$HOME/"
```

Review existing destination files before copying; the command replaces files with matching names. Repeat the copy when updating the shared policy so the entrypoint and companions stay consistent. Configure each agent to load `$HOME/AGENTS.md`; if it requires a separate entrypoint location, copy `AGENTS.md` there too. All companion paths still resolve from `$HOME`, without symlink discovery.

Create `$HOME/AGENTS-local.md` separately for machine-specific additions. Installation must preserve it. Keep any repository-local source copy untracked and locally ignored; do not include it in the shared copy command.

---

## 📦 Tech & Integrations (optional)

- Editor: Vim
- Terminal: tmux
- Automation: Make
- CLI utilities: GitHub CLI (`gh`), `act`
- Containerization: Docker

---

## 🤝 Contributing

PRs welcome! Please open an issue to discuss ideas or improvements first.

---

## 📄 License

Apache-2.0 — see [LICENSE](LICENSE).
