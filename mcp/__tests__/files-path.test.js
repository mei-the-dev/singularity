#!/usr/bin/env node
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const singularityRoot = path.resolve(__dirname, '..', '..');

async function main() {
  console.log('TEST: isSafePath prevents traversal and .git access');
  const node = process.execPath;

  // Create a tmp repo and set MCP_REPO_OVERRIDE to it
  const tmp = path.join(singularityRoot, 'tmp_test_repo_' + Date.now());
  fs.mkdirSync(tmp);
  fs.writeFileSync(path.join(tmp, 'hello.txt'), 'hi');
  const env = { ...process.env, MCP_REPO_OVERRIDE: tmp };

  // Try to read a safe file
  let args = ['-e', `import('./mcp/tools/files.js').then(m=>m.readFile({path: 'hello.txt'}).then(r=>console.log(JSON.stringify(r))))`];
  let r = spawnSync(node, args, { cwd: singularityRoot, env, encoding: 'utf8' });
  if (r.error) throw r.error;
  let m = r.stdout.match(/\{[\s\S]*\}/);
  let res = JSON.parse(m[0]);
  assert(res && res.content === 'hi', 'readFile failed on safe path');

  // Try traversal
  args = ['-e', `import('./mcp/tools/files.js').then(m=>m.readFile({path: '../package.json'}).then(r=>console.log(JSON.stringify(r))))`];
  r = spawnSync(node, args, { cwd: singularityRoot, env, encoding: 'utf8' });
  if (r.error) throw r.error;
  m = r.stdout.match(/\{[\s\S]*\}/);
  res = JSON.parse(m[0]);
  assert(res && res.error, 'Traversal not prevented');

  // Try .git access
  args = ['-e', `import('./mcp/tools/files.js').then(m=>m.readFile({path: '.git/config'}).then(r=>console.log(JSON.stringify(r))))`];
  r = spawnSync(node, args, { cwd: singularityRoot, env, encoding: 'utf8' });
  if (r.error) throw r.error;
  m = r.stdout.match(/\{[\s\S]*\}/);
  res = JSON.parse(m[0]);
  assert(res && res.error, '.git access not blocked');

  // cleanup
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch(e) {}

  console.log('\nALL TESTS PASSED');
  process.exit(0);
}

main().catch(e => { console.error('TEST FAILED', e); process.exit(1); });
