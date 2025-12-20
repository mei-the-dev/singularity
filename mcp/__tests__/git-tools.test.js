#!/usr/bin/env node
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const singularityRoot = path.resolve(__dirname, '..', '..');

function cleanup(p) {
  try { fs.rmSync(p, { recursive: true, force: true }); } catch (e) { /* ignore */ }
}

async function main() {
  console.log('TEST: startTask behavior');
  const os = await import('os');
  const tmpGit = fs.mkdtempSync(path.join(os.tmpdir(), 'singularity-git-'));
  spawnSync('git', ['init'], { cwd: tmpGit });
  spawnSync('git', ['config', 'user.email', 'tester@example.com'], { cwd: tmpGit });
  spawnSync('git', ['config', 'user.name', 'Tester'], { cwd: tmpGit });
  fs.writeFileSync(path.join(tmpGit, 'README.md'), 'hi');
  spawnSync('git', ['add', '.'], { cwd: tmpGit });
  spawnSync('git', ['commit', '-m', 'init'], { cwd: tmpGit });

  const env = { ...process.env, MCP_REPO_OVERRIDE: tmpGit };
  const node = process.execPath;
  const args = ['-e', `import('./mcp/tools/git.js').then(m=>m.startTask({issue_id:9999}).then(r=>console.log(JSON.stringify(r))))`];
  const res = spawnSync(node, args, { cwd: singularityRoot, env, encoding: 'utf8', timeout: 20000 });
  if (res.error) throw res.error;
  const m = res.stdout.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('startTask output no JSON: ' + res.stdout + ' ' + res.stderr);
  const out = JSON.parse(m[0]);
  if (!out || !out.msg) throw new Error('startTask returned unexpected: ' + JSON.stringify(out));

  // Branch exists
  const branches = spawnSync('git', ['branch', '--list', 'task/issue-9999'], { cwd: tmpGit, encoding: 'utf8' }).stdout.trim();
  assert(branches, 'task branch not created');

  // Context file
  const ctxPath = path.join(tmpGit, '.task-context', 'active.json');
  const ctx = JSON.parse(fs.readFileSync(ctxPath, 'utf8'));
  assert(ctx.currentTask === 9999, 'Context not written');

  // startTask should error on non-git repo
  const tmpNoGit = fs.mkdtempSync(path.join(os.tmpdir(), 'singularity-nogit-'));
  const env2 = { ...process.env, MCP_REPO_OVERRIDE: tmpNoGit };
  const r2 = spawnSync(node, args, { cwd: singularityRoot, env: env2, encoding: 'utf8', timeout: 20000 });
  if (r2.error) throw r2.error;
  const m2 = r2.stdout.match(/\{[\s\S]*\}/);
  const out2 = JSON.parse(m2[0]);
  assert(out2.error, 'startTask did not error on non-git repo');

  // TEST: updateIssue behavior (fake gh)
  console.log('TEST: updateIssue behavior');
  const tmpBin = fs.mkdtempSync(path.join(os.tmpdir(), 'singularity-bin-'));
  const ghScript = `#!/usr/bin/env node\nconst a = process.argv.slice(2);\nif (a[0] === 'issue' && a[1] === 'close') { console.log('Closed'); process.exit(0); }\nif (a[0] === 'issue' && a[1] === 'reopen') { console.log('Reopened'); process.exit(0); }\nconsole.error('unknown'); process.exit(2);`;
  fs.writeFileSync(path.join(tmpBin, 'gh'), ghScript, { mode: 0o755 });

  const env3 = { ...process.env, PATH: `${tmpBin}:${process.env.PATH}` };
  const argsClose = ['-e', `import('./mcp/tools/git.js').then(m=>m.updateIssue({issue_number:123, state:'closed'}).then(r=>console.log(JSON.stringify(r))))`];
  const r3 = spawnSync(node, argsClose, { cwd: singularityRoot, env: env3, encoding: 'utf8', timeout: 20000 });
  if (r3.error) throw r3.error;
  const m3 = r3.stdout.match(/\{[\s\S]*\}/);
  const out3 = JSON.parse(m3[0]);
  assert(out3 && out3.success, 'updateIssue close failed: ' + JSON.stringify(out3));

  // Unsupported state
  const argsBad = ['-e', `import('./mcp/tools/git.js').then(m=>m.updateIssue({issue_number:123, state:'weird'}).then(r=>console.log(JSON.stringify(r))))`];
  const r4 = spawnSync(node, argsBad, { cwd: singularityRoot, env: env3, encoding: 'utf8', timeout: 20000 });
  if (r4.error) throw r4.error;
  const m4 = r4.stdout.match(/\{[\s\S]*\}/);
  const out4 = JSON.parse(m4[0]);
  assert(out4 && out4.error, 'updateIssue did not error on bad state');

  // cleanup
  cleanup(tmpGit);
  cleanup(tmpNoGit);
  cleanup(tmpBin);

  console.log('\nALL TESTS PASSED');
  process.exit(0);
}

main().catch(e => {
  console.error('TEST FAILED', e);
  process.exit(1);
});
