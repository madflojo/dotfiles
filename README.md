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
| `AGENTS.md` | Context/instructions for AI coding agents | [Reference](AGENTS.md) |
| `skills/actions/` | Action-oriented skills (git, docs, go, review, agent) | [Reference](skills/actions/docs/init-readme/SKILL.md) |
| `skills/knowledge/` | Reference skills and style guides | [Reference](skills/knowledge/go/go-style-guide/SKILL.md) |

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
