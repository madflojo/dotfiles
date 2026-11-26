import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Manifest } from 'release-please';

const config = JSON.parse(readFileSync('release-please-config.json'));
const versions = JSON.parse(readFileSync('.release-please-manifest.json'));
const boundary = 'a'.repeat(40);
const names = Object.keys(config.packages);
const [first, second] = names;
const commit = (sha, message, files) => ({ sha, message, files });
const importCommit = commit(boundary, 'feat: historic import', names.map(p => `${p}/SKILL.md`));
const quiet = Object.fromEntries(['info', 'warn', 'debug', 'error', 'trace'].map(key => [key, () => {}]));

async function candidates(commits, releases = [], manifestVersions = versions) {
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
    const before = readFileSync(update.path, 'utf8');
    const after = update.updater.updateContent(before);
    if (update.path === '.release-please-manifest.json') {
      assert.deepEqual(JSON.parse(after), { ...versions, [first]: '1.1.1' });
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
    ...versions, [first]: '1.1.1',
  });
  assert.equal(prs.length, 1);
  assert.equal(prs[0].version.toString(), '1.1.1');
  assert(prs[0].updates.every(update => update.path === '.release-please-manifest.json' || update.path.startsWith(`${second}/`)));
});
