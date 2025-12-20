#!/usr/bin/env node
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const singularityRoot = path.resolve(__dirname, '..', '..');

async function main() {
  console.log('TEST: writeFile behavior');
  const tmp = path.join(singularityRoot, 'tmp_test_write_' + Date.now());
  fs.mkdirSync(tmp);
  const env = { ...process.env, MCP_REPO_OVERRIDE: tmp };
  const node = process.execPath;
  const args = ['-e', `import('./mcp/tools/files.js').then(m=>m.writeFile({path:'note.txt', content:'hello world'}).then(r=>console.log(JSON.stringify(r))))`];
  const r = spawnSync(node, args, { cwd: singularityRoot, env, encoding: 'utf8', timeout: 20000 });
  if (r.error) throw r.error;
  const m = r.stdout.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('writeFile output no JSON: ' + r.stdout + ' ' + r.stderr);
  const res = JSON.parse(m[0]);
  if (!res || !res.success) throw new Error('writeFile did not succeed: ' + JSON.stringify(res));
  const content = fs.readFileSync(path.join(tmp, 'note.txt'), 'utf8');
  if (content.trim() !== 'hello world') throw new Error('writeFile content mismatch');

  // cleanup
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}

  console.log('\nALL TESTS PASSED');
  process.exit(0);
}

main().catch(e => { console.error('TEST FAILED', e); process.exit(1); });