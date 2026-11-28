import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { load } from 'js-yaml';
import { Manifest } from 'release-please';

const config = JSON.parse(readFileSync('release-please-config.json'));
// Keep simulation baselines stable when the live packages are released.
const fixtureVersions = {
  'skills/fun-commit-msg': '1.1.0',
  'skills/fun-pull-requests': '1.1.0',
  'skills/learn-this-project': '1.0.1',
  'skills/review-this': '1.0.1',
  'skills/engineering-tribunal': '0.1.0',
  'skills/material-design-m3': '0.1.0',
  'skills/diagram-quality': '0.1.0',
};
const boundary = 'a'.repeat(40);
const names = Object.keys(config.packages);
const [first, second] = names;
const commit = (sha, message, files) => ({ sha, message, files });
const importCommit = commit(boundary, 'feat: historic import', names.map(p => `${p}/SKILL.md`));
const quiet = Object.fromEntries(['info', 'warn', 'debug', 'error', 'trace'].map(key => [key, () => {}]));

test('release workflow opens PRs on main pushes without publishing releases', () => {
  const workflow = load(readFileSync('.github/workflows/release-please.yml', 'utf8'));
  assert.deepEqual(workflow.on.push?.branches, ['main']);
  assert('workflow_dispatch' in workflow.on);
  assert.equal(workflow.jobs.release.needs, 'boundary');
  const release = workflow.jobs.release.steps.find(step => step.uses?.startsWith('googleapis/release-please-action@'));
  assert.equal(release.with['skip-github-release'], true);
  assert.equal(release.with['skip-github-pull-request'] ?? false, false);
  assert.equal(config['bootstrap-sha'], '303626387d238095d18317844469300d77609d5d');
});

test('release boundary accepts PR-only mode and rejects invalid ancestry', () => {
  const workflow = load(readFileSync('.github/workflows/release-please.yml', 'utf8'));
  const guard = workflow.jobs.boundary.steps.find(step => step.run).run;
  const directory = mkdtempSync(path.join(tmpdir(), 'release-boundary-'));
  try {
    execFileSync('git', ['init', '--quiet', directory]);
    execFileSync('git', ['-c', 'commit.gpgsign=false', '-c', 'user.name=Release Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--allow-empty', '--quiet', '-m', 'fixture import'], { cwd: directory });
    const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim();
    const run = bootstrap => {
      writeFileSync(path.join(directory, 'release-please-config.json'), JSON.stringify({ ...config, 'bootstrap-sha': bootstrap, 'skip-github-release': true }));
      return spawnSync('bash', ['-c', guard], { cwd: directory, encoding: 'utf8' });
    };
    const valid = run(sha);
    assert.equal(valid.status, 0, valid.stderr);
    assert.notEqual(run('0'.repeat(40)).status, 0);
    assert.notEqual(run('f'.repeat(40)).status, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

async function candidates(commits, releases = [], manifestVersions = fixtureVersions) {
  const fixtureConfig = { ...config, 'bootstrap-sha': boundary };
  const client = new Proxy({
    repository: { owner: 'madflojo', repo: 'dotfiles', defaultBranch: 'main' },
    async getFileJson(file) {
      if (file === 'release-please-config.json') return fixtureConfig;
      if (file === '.release-please-manifest.json') return manifestVersions;
      throw new Error(`Unexpected fixture read: ${file}`);
    },
    async *releaseIterator() { yield* releases; },
    async *tagIterator() {},
    async *mergeCommitIterator() { yield* [...commits, importCommit, commit('0'.repeat(40), 'feat: old history', names.map(p => `${p}/SKILL.md`))]; },
  }, {
    get(target, key) {
      if (!(key in target)) throw new Error(`Unexpected SCM API: ${String(key)}`);
      return target[key];
    },
  });
  const manifest = await Manifest.fromManifest(client, 'main', undefined, undefined, { logger: quiet });
  return manifest.buildPullRequests();
}

test('import boundary and root-only changes create no releases', async () => {
  assert.deepEqual(await candidates([]), []);
  assert.deepEqual(await candidates([commit('1'.repeat(40), 'feat: improve editor', ['.vimrc'])]), []);
});

test('one package fix selects one independent patch and only its release files', async () => {
  const prs = await candidates([commit('1'.repeat(40), 'fix: clarify staged commits', [`${first}/SKILL.md`])]);
  assert.equal(prs.length, 1);
  assert.equal(prs[0].version.toString(), '1.1.1');
  assert.deepEqual(prs[0].updates.map(update => update.path).sort(), [
    '.release-please-manifest.json', `${first}/CHANGELOG.md`, `${first}/version.txt`,
  ].sort());
  for (const update of prs[0].updates) {
    const before = update.path === '.release-please-manifest.json'
      ? JSON.stringify(fixtureVersions)
      : readFileSync(update.path, 'utf8');
    const after = update.updater.updateContent(before);
    if (update.path === '.release-please-manifest.json') {
      assert.deepEqual(JSON.parse(after), { ...fixtureVersions, [first]: '1.1.1' });
    } else if (update.path.endsWith('version.txt')) {
      assert.equal(update.createIfMissing, false);
      assert.equal(after.trim(), '1.1.1');
    } else {
      assert(after.includes(`${first.split('/')[1]}-v1.1.1`));
      assert(after.includes('https://github.com/madflojo/fun-commit-msg/'));
    }
  }
  assert.deepEqual(await candidates([commit('1'.repeat(40), 'fix: clarify staged commits', [`${first}/SKILL.md`])]), prs);
});

test('two packages create separate PRs with independent versions', async () => {
  const prs = await candidates([
    commit('2'.repeat(40), 'feat: extend review guidance', [`${names[3]}/SKILL.md`]),
    commit('1'.repeat(40), 'fix: clarify staged commits', [`${first}/SKILL.md`]),
  ]);
  assert.equal(prs.length, 2);
  assert.deepEqual(prs.map(pr => pr.version.toString()).sort(), ['1.1.0', '1.1.1']);
  assert.notEqual(prs[0].headRefName, prs[1].headRefName);
});

test('a released package does not erase pending changes in unreleased packages', async () => {
  const releaseSha = '3'.repeat(40);
  const prs = await candidates([
    commit(releaseSha, 'chore(main): release fun-commit-msg 1.1.1', [`${first}/version.txt`]),
    commit('2'.repeat(40), 'fix: pending PR guidance', [`${second}/SKILL.md`]),
    commit('1'.repeat(40), 'fix: already released', [`${first}/SKILL.md`]),
  ], [{ tagName: 'fun-commit-msg-v1.1.1', name: 'fun-commit-msg-v1.1.1', sha: releaseSha, notes: '' }], {
    ...fixtureVersions, [first]: '1.1.1',
  });
  assert.equal(prs.length, 1);
  assert.equal(prs[0].version.toString(), '1.1.1');
  assert(prs[0].updates.every(update => update.path === '.release-please-manifest.json' || update.path.startsWith(`${second}/`)));
});

for (const name of ['engineering-tribunal', 'material-design-m3', 'diagram-quality']) {
  test(`${name} releases independently and remains pre-major while being refined`, async () => {
    const directory = `skills/${name}`;
    for (const [message, expectedVersion] of [
      ['fix: clarify guidance', '0.1.1'],
      ['feat: expand guidance', '0.2.0'],
      ['feat!: revise the skill contract', '0.2.0'],
    ]) {
      const prs = await candidates([
        commit('4'.repeat(40), message, [`${directory}/SKILL.md`]),
      ]);
      assert.equal(prs.length, 1);
      assert.equal(prs[0].version.toString(), expectedVersion);
      assert.deepEqual(prs[0].updates.map(update => update.path).sort(), [
        '.release-please-manifest.json', `${directory}/CHANGELOG.md`, `${directory}/version.txt`,
      ].sort());
      const update = prs[0].updates.find(update => update.path.endsWith('CHANGELOG.md'));
      const rendered = update.updater.updateContent(readFileSync(update.path, 'utf8'));
      assert(rendered.includes(`${name}-v${expectedVersion}`));
    }
  });

  test(`${name} keeps pending history when an imported package releases`, async () => {
    const directory = `skills/${name}`;
    const releaseSha = '3'.repeat(40);
    const prs = await candidates([
      commit(releaseSha, 'chore(main): release fun-commit-msg 1.1.1', [`${first}/version.txt`]),
      commit('2'.repeat(40), 'fix: pending development guidance', [`${directory}/SKILL.md`]),
      commit('1'.repeat(40), 'fix: already released', [`${first}/SKILL.md`]),
    ], [{ tagName: 'fun-commit-msg-v1.1.1', name: 'fun-commit-msg-v1.1.1', sha: releaseSha, notes: '' }], {
      ...fixtureVersions, [first]: '1.1.1',
    });
    assert.equal(prs.length, 1);
    assert.equal(prs[0].version.toString(), '0.1.1');
    assert(prs[0].updates.every(update => update.path === '.release-please-manifest.json' || update.path.startsWith(`${directory}/`)));
  });
}
