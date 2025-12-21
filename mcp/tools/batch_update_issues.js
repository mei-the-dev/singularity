#!/usr/bin/env node
/*
Simple CLI to update multiple GitHub issues via the MCP agent's update_issue tool.
Usage:
  node mcp/tools/batch_update_issues.js --state closed 114 113 112
This will call the local MCP agent via the mcp/index.js send helper (if running) or fall back to using the GitHub REST API if GITHUB_TOKEN is present.
*/
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node mcp/tools/batch_update_issues.js --state <state> <issue_number> [<issue_number> ...]');
  process.exit(2);
}

let state = null;
const numbers = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--state') { state = args[i+1]; i++; continue; }
  numbers.push(Number(args[i]));
}
if (!state) { console.error('Missing --state'); process.exit(2); }
if (numbers.length === 0) { console.error('No issue numbers provided'); process.exit(2); }

console.log(`Batch update: issues=[${numbers.join(', ')}] -> ${state}`);

// Try to use the MCP agent CLI 'mcp/tools/close_issue.js' style send to update issues via the running agent.
// We'll shell out to `node mcp/close_issue.js <number>` but that script only closes; to be more generic we call the mcp/index.js tool using a lightweight helper.

// If environment has GH_TOKEN, use the REST API as fallback
const GH_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || null;
const REPO = process.env.GITHUB_REPOSITORY || 'mei-the-dev/singularity';

async function updateViaApi(issueNumber, state) {
  const fetch = (await import('node-fetch')).default;
  const url = `https://api.github.com/repos/${REPO}/issues/${issueNumber}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${GH_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'singularity-agent' },
    body: JSON.stringify({ state })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API update failed ${res.status}: ${txt}`);
  }
  return await res.json();
}

(async () => {
  for (const n of numbers) {
    try {
      if (GH_TOKEN) {
        const out = await updateViaApi(n, state);
        console.log(`Issue ${n} updated -> ${out.state}`);
      } else {
        // fallback: call local MCP tool via node script mcp/close_issue.js (only supports 'closed')
        if (state === 'closed') {
          const r = spawnSync('node', [path.join(process.cwd(), 'mcp', 'close_issue.js'), '--issue', String(n)], { stdio: 'inherit' });
          if (r.status !== 0) throw new Error('close_issue failed');
          console.log(`Issue ${n} closed via agent`);
        } else {
          console.warn(`No GH_TOKEN provided and agent helper not available for state=${state}, skipping ${n}`);
        }
      }
    } catch (e) {
      console.error(`Failed to update ${n}:`, e.message || e);
    }
  }
})();
