#!/usr/bin/env node
const { execSync } = require('child_process');
try {
  // Find any node_modules directories except the repo root ./node_modules and archive folders
  const out = execSync('find . -type d -name node_modules -prune -not -path "./node_modules" -not -path "./archive/*" -not -path "./archive/**" -print', { encoding: 'utf8' }).trim();
  if (out) {
    console.error('ERROR: Nested node_modules directories found:');
    console.error(out.split('\n').map(p => '  - ' + p).join('\n'));
    console.error('\nNested `node_modules` directories are forbidden. Run `npm install` from the repository root (or use the monorepo workspace) and remove local installs.');
    process.exit(1);
  }
  console.log('OK: No nested node_modules found');
  process.exit(0);
} catch (e) {
  if (e.status === 1 && e.stdout) {
    // `find` may exit with status 1 when no matches; treat as OK
    const out = (e.stdout || '').toString().trim();
    if (!out) {
      console.log('OK: No nested node_modules found');
      process.exit(0);
    }
  }
  console.error('ERROR: failed to run nested node_modules check', e.message);
  process.exit(2);
}
