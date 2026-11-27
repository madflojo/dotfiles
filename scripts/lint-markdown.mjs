import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { markdownFiles } from './files.mjs';

const baseline = JSON.parse(readFileSync('scripts/markdown-baseline.json'));
const files = markdownFiles().filter(file => {
  const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
  return baseline.unchangedFiles[file] !== hash;
});
console.log(`Linting ${files.length} new/changed files; exact unchanged baseline: ${baseline.revision}`);
if (files.length) {
  const result = spawnSync(process.execPath, [
    'node_modules/markdownlint-cli2/markdownlint-cli2-bin.mjs', ...files,
  ], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
