#!/usr/bin/env node
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const singularityRoot = path.resolve(__dirname, '..', '..');

async function main() {
  console.log('TEST: findRepoRoot');
  const git = await import('../tools/git.js');
  const root = git.findRepoRoot(__dirname);
  assert(path.basename(root) === 'singularity', 'findRepoRoot did not return singularity: ' + root);
  console.log('OK');

  console.log('TEST: runTests integration (temp project)');
  const tmp = path.join(singularityRoot, 'tmp_test_project_' + Date.now());
  fs.mkdirSync(tmp);
  fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({ scripts: { test: "node -e \"console.log(\\\"RUN_TEST_OK\\\")\"" } }));

  const env = { ...process.env, MCP_REPO_OVERRIDE: tmp };
  const cmd = process.execPath;
  const args = ['-e', `import('./mcp/tools/ops.js').then(m=>m.runTests().then(r=>console.log(JSON.stringify(r))))`];
  const r = spawnSync(cmd, args, { cwd: singularityRoot, env, encoding: 'utf8', timeout: 20000 });
  if (r.error) throw r.error;
  const m = r.stdout.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('runTests output no JSON: ' + r.stdout + ' ' + r.stderr);
  const res = JSON.parse(m[0]);
  if (!(res && (res.status === 'PASS' || res.status === 'FAIL'))) throw new Error('runTests returned unexpected: ' + JSON.stringify(res));
  console.log('OK', res.status);

  console.log('TEST: startService safety');
  const ops = await import('../tools/ops.js');
  const bad = await ops.startService({ command: 'rm -rf /; echo hi', port: 59999 });
  assert(bad && bad.error, 'startService did not reject unsafe command');
  console.log('OK (rejects unsafe)');

  const port = 59998;
  const cmdArr = ['node', '-e', 'console.log("TEST_SERVICE_OK")'];
  const ok = await ops.startService({ command: cmdArr, port });
  assert(ok && ok.msg && ok.log, 'startService array did not return log');
  const logpath = path.join(singularityRoot, '.task-context', 'logs', `svc_${port}.log`);

  let tries = 0;
  while (tries++ < 40 && !fs.existsSync(logpath)) await new Promise(r => setTimeout(r, 100));
  assert(fs.existsSync(logpath), 'log not created: ' + logpath);

    // Wait until log contains expected content or timeout
    let found = false;
    tries = 0;
    while (tries++ < 50) {
      const content = fs.existsSync(logpath) ? fs.readFileSync(logpath, 'utf8') : '';
      if (content.includes('TEST_SERVICE_OK')) { found = true; break; }
      await new Promise(r => setTimeout(r, 100));
    }
    assert(found, 'service did not write expected output to ' + logpath);
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch(e) { /* ignore */ }

  console.log('\nALL TESTS PASSED');
  process.exit(0);
}

main().catch(e => {
  console.error('TEST FAILED', e);
  process.exit(1);
});
