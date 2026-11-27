import { spawnSync } from 'node:child_process';
import { markdownFiles } from './files.mjs';

const result = spawnSync(process.env.LYCHEE || 'lychee', [
  '--offline', '--no-progress', '--include-fragments', ...markdownFiles(),
], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
