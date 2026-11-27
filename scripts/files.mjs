import { execFileSync } from 'node:child_process';

export function repositoryFiles() {
  return [...new Set(execFileSync('git', [
    'ls-files', '--cached', '--others', '--exclude-standard', '-z',
  ], { encoding: 'utf8' }).split('\0').filter(Boolean))];
}

export function markdownFiles() {
  return repositoryFiles().filter(file => file.endsWith('.md') &&
    !file.endsWith('/CHANGELOG.md'));
}
