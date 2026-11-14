# dotfiles 🧰

**Terminal and editor configs, shared agent guidance, and scheduled prompts.**

[![License](https://img.shields.io/github/license/madflojo/dotfiles)](LICENSE)

---

## 🧱 Structure

| Module/Path | Description | Docs |
| --- | --- | --- |
| `.vimrc` | Vim defaults, plugins, and editor preferences | [Reference](.vimrc) |
| `.tmux.conf` | tmux status line and key bindings | [Reference](.tmux.conf) |
| `.carbon-now.json` | Preset for carbon.now.sh exports | [Reference](.carbon-now.json) |
| `AGENTS.md` | Instruction entry point, TOC, and task-based loading | [Reference](AGENTS.md) |
| `AGENTS-*.md` | Working style, workflow, validation, review, and architecture guidance | [Loading rules](AGENTS.md#loading-and-routing) |
| `scheduled-prompts/` | Saved prompts for scheduled use across agent harnesses | [Session Nudge supervisor](scheduled-prompts/session-nudge.md) |

## Agent guidance installation

Copy the shared guidance as a complete set into the user's home directory. First inspect and back up existing destination files. If a destination is a symlink, remove only the link before copying; plain `cp` follows destination symlinks and does not migrate them to regular files. Apply the same precaution to separate agent entrypoints. Preserve `AGENTS-local.md` separately. From this repository, after preparing the destinations:

```sh
cp AGENTS.md AGENTS-working-style.md AGENTS-workflow.md AGENTS-validation.md AGENTS-review.md AGENTS-architecture.md "$HOME/"
```

Review existing destination files before copying; the command replaces files with matching names. Repeat the copy when updating the shared policy so the entrypoint and companions stay consistent. Configure each agent to load `$HOME/AGENTS.md`; if it requires a separate entrypoint location, copy `AGENTS.md` there too. All companion paths still resolve from `$HOME`, without symlink discovery.

Create `$HOME/AGENTS-local.md` separately for machine-specific additions. Installation must preserve it. Keep any repository-local source copy untracked and locally ignored; do not include it in the shared copy command.

## Standalone Agent Skills

Each skill repository has its own installation instructions.

| Workflow | Repository |
| --- | --- |
| Write Conventional Commit messages and commit staged changes | [fun-commit-msg](https://github.com/madflojo/fun-commit-msg) |
| Draft and open GitHub pull requests | [fun-pull-requests](https://github.com/madflojo/fun-pull-requests) |
| Get oriented in a codebase | [learn-this-project](https://github.com/madflojo/learn-this-project) |
| Review code and documentation | [review-this](https://github.com/madflojo/review-this) |
| Write and review Go code, including Godoc comments | [go-style-agent-skill](https://github.com/madflojo/go-style-agent-skill) |

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
