import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const names = Object.keys(JSON.parse(readFileSync('release-please-config.json')).packages)
  .map(directory => path.basename(directory));
const cli = path.join(root, 'node_modules/skills/bin/cli.mjs');
// GitHub CLI normalizes blank lines immediately after its tracking frontmatter.
const body = text => text.replace(/^---\r?\n[\s\S]*?\r?\n---\s*\n/, '');
const frontmatter = text => yaml.load(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);

function verify(source, destination) {
  assert.deepEqual(readdirSync(destination).sort(), readdirSync(source).sort());
  for (const file of readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, file.name);
    const to = path.join(destination, file.name);
    if (file.isDirectory()) verify(from, to);
    else if (file.name === 'SKILL.md') {
      const original = readFileSync(from, 'utf8');
      const installed = readFileSync(to, 'utf8');
      assert.equal(body(installed), body(original));
      const actual = frontmatter(installed);
      for (const [key, value] of Object.entries(frontmatter(original))) {
        if (key === 'metadata') {
          for (const [field, data] of Object.entries(value)) assert.deepEqual(actual.metadata[field], data);
        } else assert.deepEqual(actual[key], value);
      }
    } else assert.deepEqual(readFileSync(to), readFileSync(from));
  }
}

for (const name of names) {
  const temporary = mkdtempSync(path.join(tmpdir(), 'dotfiles-install-'));
  try {
    const target = path.join(temporary, 'github-cli');
    execFileSync('gh', ['skill', 'install', root, name, '--from-local', '--dir', target], {
      cwd: temporary, stdio: 'pipe', env: { ...process.env, CI: 'true' },
    });
    assert.deepEqual(readdirSync(target), [name]);
    verify(path.join(root, 'skills', name), path.join(target, name));
    execFileSync(process.execPath, [cli, 'add', root, '--skill', name, '--agent', 'codex', '--copy', '--yes'], {
      cwd: temporary, stdio: 'pipe', env: { ...process.env, CI: 'true', DISABLE_TELEMETRY: '1' },
    });
    const skills = path.join(temporary, '.agents/skills');
    assert.deepEqual(readdirSync(skills), [name]);
    verify(path.join(root, 'skills', name), path.join(skills, name));
    console.log(`${name}: isolated selective installs passed (gh and Skills CLI)`);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}
