#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { spawnSync } from 'child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const manifestPath = path.join(root, '.github', 'agents', 'singularity.agent.md');

function parseManifestTools(src) {
  // Restrict parsing to the `tools:` section to avoid matching top-level `name:` fields
  const startMarker = '\ntools:';
  const startIdx = src.indexOf(startMarker);
  const section = (startIdx === -1) ? src : (() => {
    let endIdx = src.indexOf('\n---', startIdx);
    if (endIdx === -1) endIdx = src.length;
    return src.slice(startIdx, endIdx);
  })();

  const matches = [...section.matchAll(/-\s*name:\s*"?'?([^"'\n]+)"?'?/g)];
  return matches.map(m => m[1]).filter(Boolean);
}

function parseListToolsOutput(out) {
  // find the JSON array printed by list-tools.js
  const start = out.indexOf('[');
  const end = out.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('Could not find JSON array in list-tools output');
  const json = out.slice(start, end + 1);
  return JSON.parse(json).map(t => t.name);
}

async function main() {
  console.log('TEST: agent manifest tool list matches runtime tools');

  if (!fs.existsSync(manifestPath)) throw new Error('Manifest not found: ' + manifestPath);
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  const declared = parseManifestTools(manifest).sort();

  // Run the list-tools script
  const node = process.execPath;
  const r = spawnSync(node, [path.join(root, 'mcp', 'list-tools.js')], { cwd: root, encoding: 'utf8' });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error('list-tools.js failed: ' + (r.stderr || r.stdout));

  const runtime = parseListToolsOutput(r.stdout).sort();

  // Compare set equality
  const a = new Set(declared);
  const b = new Set(runtime);

  const onlyInManifest = declared.filter(x => !b.has(x));
  const onlyInRuntime = runtime.filter(x => !a.has(x));

  assert(onlyInManifest.length === 0 && onlyInRuntime.length === 0, 'Mismatch between manifest and runtime tools.\nOnly in manifest: ' + JSON.stringify(onlyInManifest) + '\nOnly in runtime: ' + JSON.stringify(onlyInRuntime));

  console.log('Declared tools:', JSON.stringify(declared, null, 2));
  console.log('Runtime tools :', JSON.stringify(runtime, null, 2));

  console.log('\nALL TESTS PASSED');
  process.exit(0);
}

main().catch(e => { console.error('TEST FAILED', e); process.exit(1); });
