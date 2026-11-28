import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { load } from 'js-yaml';
import { repositoryFiles } from './files.mjs';

const require = createRequire(import.meta.url);
const json = file => JSON.parse(readFileSync(file, 'utf8'));
const config = json('release-please-config.json');
const versions = json('.release-please-manifest.json');
const provenance = json('skills/provenance.json');
const skills = readdirSync('skills', { withFileTypes: true })
  .filter(directory => directory.isDirectory()).map(directory => directory.name);
const ajv = new Ajv({ strict: false });
addFormats(ajv);
for (const [file, schema] of [
  ['release-please-config.json', 'config.json'],
  ['.release-please-manifest.json', 'manifest.json'],
]) {
  const validate = ajv.compile(require(`release-please/schemas/${schema}`));
  assert(validate(json(file)), `${file}: ${JSON.stringify(validate.errors)}`);
}
assert.deepEqual(Object.keys(config.packages).sort(), Object.keys(versions).sort());
assert.deepEqual(Object.keys(config.packages).sort(),
  skills.map(name => `skills/${name}`).sort());
assert.equal(config['separate-pull-requests'], true);
readFileSync('LICENSE');
for (const [directory, settings] of Object.entries(config.packages)) {
  const name = path.basename(directory);
  assert.equal(settings.component, name);
  assert.equal(settings['release-type'], 'simple');
  assert.equal(settings['include-component-in-tag'], true);
  assert.equal(settings['include-v-in-tag'], true);
  assert.equal(settings['changelog-path'], 'CHANGELOG.md');
  assert.equal(settings['version-file'], 'version.txt');
  assert.equal(readFileSync(`${directory}/version.txt`, 'utf8').trim(), versions[directory]);
  assert(!existsSync(`${directory}/LICENSE`), `${name}: use the shared root LICENSE`);
  for (const file of ['CHANGELOG.md', ...Object.keys(provenance[name]?.files ?? {})]) {
    readFileSync(`${directory}/${file}`);
  }
}
for (const name of skills) {
  const source = readFileSync(`skills/${name}/SKILL.md`, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert(match, `${name}: missing frontmatter`);
  const metadata = load(match[1]);
  assert.equal(metadata.name, name);
  assert.equal(typeof metadata.description, 'string');
  assert(metadata.description.trim());
}
for (const file of repositoryFiles().filter(f => /\.(json|ya?ml)$/.test(f))) {
  if (file.endsWith('.json')) json(file);
  else load(readFileSync(file, 'utf8'));
}
const dependabot = load(readFileSync('.github/dependabot.yml', 'utf8'));
assert.equal(dependabot.version, 2);
assert.deepEqual(dependabot.updates.map(update => update['package-ecosystem']).sort(), ['github-actions', 'npm']);
assert.equal(new Set(dependabot.updates.map(update => `${update['package-ecosystem']}:${update.directory}`)).size, dependabot.updates.length);
console.log('Skill packaging, frontmatter, release schemas, JSON/YAML and dependency ecosystems passed.');
