# Commit Message Guidance

Use this reference when the diff is ambiguous and you need a sharper
Conventional Commit.

## Picking a Type

- `feat`: new user-facing behavior or capability
- `fix`: bug fix or behavior correction
- `docs`: documentation-only changes
- `refactor`: code restructuring without intended behavior change
- `test`: test-only changes
- `build`: packaging or dependency-management changes
- `ci`: workflow or automation changes
- `perf`: measurable performance improvement
- `chore`: maintenance that does not fit the above cleanly

## Scope Guidance

- Use a scope when it clarifies the subsystem: `docs(skill)`, `fix(release)`.
- Omit the scope when the repo is small or the scope would repeat the subject.

## Subject Guidance

- Start with an imperative verb: `add`, `fix`, `clarify`, `refine`, `publish`.
- Keep it specific enough that `git log --oneline` remains useful.
- Avoid filler like `update stuff` or `misc fixes`.

## Body Guidance

Add a body only when it helps future readers understand:

- why the change exists
- what was grouped into the commit
- whether behavior or workflow changed materially

## Examples

- `docs: add gh skill install guidance`
- `fix(skill): handle empty staged diff before commit`
- `refactor(release): align skill metadata with repo name`
- `docs(readme): clarify manual install fallback`
- `docs: add install steps without sending readers on a scavenger hunt`
- `fix(commit): preserve partial staging when the worktree gets spicy`
- `docs: add install guidance without the treasure map 🗺️`
- `test(cache): catch stale eviction before it starts free-range browsing 🧹`
