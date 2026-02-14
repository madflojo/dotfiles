# dotfiles

**Personal terminal/editor configs and reusable Agent Skills to streamline dev workflows.**

---

Setting up a new machine shouldn’t mean hunting down dotfiles and rewriting the same workflows. This repo gathers my Vim and tmux setup plus a small library of Agent Skills for common tasks like generating READMEs, opening PRs, and writing concise commits.

It’s deliberately minimal: a few well‑tuned config files and focused skills that help you move fast without guessing conventions.

---

## 🧠 What is dotfiles?
A lightweight collection of editor/terminal configuration and practical Agent Skills for consistent, speedy developer workflows.

- Centralizes Vim and tmux preferences for frictionless setup
- Provides high‑quality skills for PRs, commits, reviews, and repo discovery
- Encourages concise, conventional, and verifiable practices (IDD/TDD mindset)

---

## 🚀 Getting Started

### Installation

- Clone and link configs (adjust paths as you prefer):
  ```bash
  git clone git@github.com:madflojo/dotfiles.git ~/.dotfiles

  # Link Vim and tmux configs
  ln -s ~/.dotfiles/.vimrc ~/.vimrc
  ln -s ~/.dotfiles/.tmux.conf ~/.tmux.conf
  ```

---

## 🧱 Structure

The repo includes a few focused config files and templates.

| Category | Path | Description |
| --- | --- | --- |
| Config | `.carbon-now.json` | Preset for carbon.now.sh exports |
| Config | `.tmux.conf` | Status line styling and Screen-style `Ctrl-a` prefix |
| Config | `.vimrc` | Vim defaults (2-space tabs), Markdown Copilot, rainbow parens |
| Docs | `AGENTS.md` | A README for agents: context and instructions for AI coding agents working on this project |
| Skills | `skills/` | Agent Skills library organized by action area (git, docs, go, agent, review) |
| Prompts | `.prompts/` | Deprecated; use `skills/` instead |

---

### Skills Layout

```
skills/
  actions/
    agent/
      learn-this/
    docs/
      init-readme/
    git/
      commit/
      open-pr/
    go/
      gen-godocs/
      review-godocs/
    review/
      review-this/
  knowledge/
    go/
      go-style-guide/
```

## 🧰 Developer Tooling

Common tools used alongside these dotfiles. Use this as a quick setup checklist for a new dev machine.

| Category | Tool | Purpose |
| --- | --- | --- |
| Automation | Make (`make`) | Consistent task runner via Makefiles |
| CLI Utilities | `act` | Run GitHub Actions locally |
| CLI Utilities | carbon-now-cli (node package) | Create and share beautiful code snippets |
| CLI Utilities | GitHub CLI (`gh`) | Create/view PRs, issues, releases |
| CLI Utilities | grip | GitHub-flavored Markdown preview |
| CLI Utilities | jq | Command-line JSON processor |
| Containerization | Docker | Containers for dev/test |
| Containerization | Docker Compose | Define multi-service dev stacks |
| Editor | Vim | Modal text editor |
| Terminal | Starship | Fast, customizable shell prompt |
| Terminal | tmux | Terminal multiplexer |

---

## 🤝 Contributing

PRs welcome! Please open an issue to discuss ideas or improvements first.

---

## 📄 License

Apache-2.0 — see [LICENSE](LICENSE).

---

## 🌴 Stay Tidy

If you have a neat prompt or dotfile trick, share it — small wins add up.
