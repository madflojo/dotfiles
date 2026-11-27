# dotfiles 🧰

Terminal and editor settings, shared agent instructions, and reusable skills.
Install individual skills or use the shared agent guidance below.

[![License](https://img.shields.io/github/license/madflojo/dotfiles)](LICENSE)

## Bundled agent skills

| Skill | What it does |
| --- | --- |
| [fun-commit-msg](skills/fun-commit-msg/SKILL.md) | Write Conventional Commits and commit reviewed changes, with a little personality |
| [fun-pull-requests](skills/fun-pull-requests/SKILL.md) | Prepare and open pull requests with clear descriptions and verified results |
| [learn-this-project](skills/learn-this-project/SKILL.md) | Explore a repository and explain how it works, with evidence |
| [review-this](skills/review-this/SKILL.md) | Review code and documentation for concrete issues |
| [engineering-tribunal](skills/engineering-tribunal/SKILL.md) | Bring independent reviewers to consequential engineering decisions |
| [diagram-quality](skills/diagram-quality/SKILL.md) | Make diagrams easier to follow while keeping them technically accurate |
| [material-design-m3](skills/material-design-m3/SKILL.md) | Build and review web interfaces using Material 3 |

Install `diagram-quality` for your user account with Skills CLI:

```sh
npx skills@1.9.0 install https://github.com/madflojo/dotfiles \
  --skill diagram-quality --global
```

Replace `diagram-quality` with any skill in the table, or omit the
`--skill diagram-quality` option to browse the available skills.
Leave off `--global` to install in the current project instead.

See [skill installation and releases](docs/skills.md) for local installs,
version pinning, and release details.
[Go style](https://github.com/madflojo/go-style-agent-skill) lives in its own
repository.

## Agent guidance installation

The shared guidance covers context loading, planning, validation, and review.
Install it separately from the skills.

1. Inspect and back up existing destination files. If a destination is a
   symlink, remove only the link before copying; `cp` follows destination
   symlinks and would overwrite the linked file. Apply this precaution to any
   separate agent entrypoint too. Preserve your existing `AGENTS-local.md`.
2. From this repository, copy the complete shared set into your home directory:

   ```sh
   cp AGENTS.md AGENTS-working-style.md AGENTS-workflow.md \
     AGENTS-validation.md AGENTS-review.md AGENTS-architecture.md "$HOME/"
   ```

   This replaces files with matching names. Repeat the complete copy when
   updating shared guidance so the entrypoint and companion files stay in sync.
3. Configure your agent to load `$HOME/AGENTS.md`. If it requires an entrypoint
   in another location, copy `AGENTS.md` there too. Companion files still load
   from `$HOME`, regardless of where the entrypoint lives.
4. Use `$HOME/AGENTS-local.md` for machine-specific additions. Keep it separate
   from shared updates. If you keep a local copy in this repository, leave it
   untracked and locally ignored.

## What's here

| File or directory | Purpose |
| --- | --- |
| [.vimrc](.vimrc) | Vim settings, plugins, and editor preferences |
| [.tmux.conf](.tmux.conf) | tmux status line and key bindings |
| [.carbon-now.json](.carbon-now.json) | Preset for carbon.now.sh exports |
| [AGENTS.md](AGENTS.md) | Agent instruction entrypoint and loading rules |
| `AGENTS-*.md` | Working style, delivery, checks, reviews, and architecture |
| [scheduled-prompts/](scheduled-prompts/session-nudge.md) | Saved prompts for scheduled agent work |
| [skills/](#bundled-agent-skills) | Independently installable agent skills |

## Contributing

Use a short-lived branch and keep each pull request focused. See
[CONTRIBUTING.md](CONTRIBUTING.md) for checks, squash titles, dependency updates,
and the release process.

## License

Apache-2.0. See [LICENSE](LICENSE).
