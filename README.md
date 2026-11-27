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
| `skills/` | Independently installable agent skills | [Bundled agent skills](#bundled-agent-skills) |

## Agent guidance installation

Copy the shared guidance as a complete set into the user's home directory. First
inspect and back up existing destination files. If a destination is a symlink,
remove only the link before copying; plain `cp` follows destination symlinks and
does not migrate them to regular files. Apply the same precaution to separate
agent entrypoints. Preserve `AGENTS-local.md` separately. From this repository,
after preparing the destinations:

```sh
cp AGENTS.md AGENTS-working-style.md AGENTS-workflow.md AGENTS-validation.md \
  AGENTS-review.md AGENTS-architecture.md "$HOME/"
```

Review existing destination files before copying; the command replaces files
with matching names. Repeat the copy when updating the shared policy so the
entrypoint and companions stay consistent. Configure each agent to load
`$HOME/AGENTS.md`; if it requires a separate entrypoint location, copy
`AGENTS.md` there too. All companion paths still resolve from `$HOME`, without
symlink discovery.

Create `$HOME/AGENTS-local.md` separately for machine-specific additions.
Installation must preserve it. Keep any repository-local source copy untracked
and locally ignored; do not include it in the shared copy command.

## Bundled agent skills

| Skill | Purpose |
| --- | --- |
| [fun-commit-msg](skills/fun-commit-msg/SKILL.md) | Safe Conventional Commits with a little personality |
| [fun-pull-requests](skills/fun-pull-requests/SKILL.md) | Prepare and publish reviewable GitHub PRs |
| [learn-this-project](skills/learn-this-project/SKILL.md) | Evidence-backed repository discovery |
| [review-this](skills/review-this/SKILL.md) | Structured code and documentation reviews |
| [engineering-tribunal](skills/engineering-tribunal/SKILL.md) | Independent engineering reviews with risk-based personas, RACI selection, and consumer-feedback checkpoints |
| [diagram-quality](skills/diagram-quality/SKILL.md) | Clear, technically accurate diagrams across tools and formats |
| [material-design-m3](skills/material-design-m3/SKILL.md) | Design, implement, migrate, and review Material 3 web interfaces |

Copy a selected skill directory into your agent's skill directory. For Codex,
use `~/.codex/skills/`. Inspect and back up any existing destination first;
replace the complete skill directory when updating so references stay together.
For a new installation from this repository:

```sh
mkdir -p "$HOME/.codex/skills"
cp -R skills/engineering-tribunal "$HOME/.codex/skills/"
cp -R skills/material-design-m3 "$HOME/.codex/skills/"
```

## Selective installation and releases

Each skill is independent of the editor configuration and personal agent
policy. See [skill installation and releases](docs/skills.md) for selective
installation, pinning, original source revisions, and the release cutover.

[Go style](https://github.com/madflojo/go-style-agent-skill) remains maintained
in its standalone repository.

---

## 📦 Tech & Integrations (optional)

- Editor: Vim
- Terminal: tmux
- Automation: Make
- CLI utilities: GitHub CLI (`gh`), `act`
- Containerization: Docker

---

## 🤝 Contributing

Use a short-lived branch and a focused pull request. See
[CONTRIBUTING.md](CONTRIBUTING.md) for checks, squash titles, dependency
updates, and the release process.

---

## 📄 License

Apache-2.0 — see [LICENSE](LICENSE).
