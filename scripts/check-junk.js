#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const entries = fs.readdirSync(repoRoot, { withFileTypes: true }).map(e => e.name);
const patterns = [/^tmp_/, /^tmp$/, /^tmpbin_/, /^tmp_bin_/, /^tmp_nogit_/, /^tmp_git_repo_/, /^old_deprecated_/, /^\.repo-refactor-backup$/, /^\.singularity_nested_backup$/];

const matches = [];
for (const name of entries) {
  for (const p of patterns) {
    if (p.test(name)) matches.push(name);
  }
}

if (matches.length) {
  console.error('JUNK DIRECTORIES FOUND:');
  for (const m of matches) console.error(' -', m);
  console.error('\nPlease move these into archive/legacy-artifacts or add a test fixture.');
  process.exit(2);
}
console.log('No junk directories found.');
process.exit(0);
