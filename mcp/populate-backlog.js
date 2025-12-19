#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_INDEX = path.join(__dirname, 'index.js');
const POSSIBLE_BACKLOGS = [
  path.join(__dirname, '..', 'ui', 'UX_BACKLOG.md'),
  path.join(__dirname, '..', '..', 'ui', 'UX_BACKLOG.md'),
  path.join(__dirname, '..', '..', '..', 'ui', 'UX_BACKLOG.md'),
];
const BACKLOG = POSSIBLE_BACKLOGS.find(p => fs.existsSync(p));

function parseBacklog(md) {
  // Very small parser: split on numbered headings (1., 2., 3.) and extract title + description lines
  const lines = md.split(/\r?\n/);
  const items = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^\s*(\d+)\.\s*(.+)$/);
    if (m) {
      const num = m[1];
      const title = m[2].trim();
      i++;
      const bodyLines = [];
      while (i < lines.length && !lines[i].match(/^\s*\d+\./)) {
        bodyLines.push(lines[i]);
        i++;
      }
      const body = bodyLines.join('\n').trim();
      items.push({ num: Number(num), title, body });
    } else {
      i++;
    }
  }
  return items;
}

function send(req, proc) {
  proc.stdin.write(JSON.stringify(req) + '\n');
}

(async function main(){
  if (!fs.existsSync(MCP_INDEX)) {
    console.error('MCP index not found at', MCP_INDEX); process.exit(1);
  }
  if (!fs.existsSync(BACKLOG)) {
    console.error('Backlog not found at', BACKLOG); process.exit(1);
  }

  const md = fs.readFileSync(BACKLOG, 'utf8');
  const items = parseBacklog(md).slice(0,10); // limit
  if (!items.length) {
    console.log('No backlog items found.'); process.exit(0);
  }

  const proc = spawn('node', [MCP_INDEX], { cwd: path.resolve(__dirname, '..'), stdio: ['pipe', 'pipe', 'inherit'] });
  let buffer = '';

  proc.stdout.on('data', (d) => {
    buffer += d.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        // noop: we don't need tool responses here except for create_issue responses later
        if (msg.id && msg.result) {
          // print for visibility
          console.log('RESPONSE:', JSON.stringify(msg.result));
        }
      } catch (e) {
        // ignore
      }
    }
  });

  // initialize
  send({ jsonrpc: '2.0', id: 0, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities:{}, clientInfo: { name: 'backlog-populator', version: '1.0' } } }, proc);
  send({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, proc);

  // Wait briefly then create issues sequentially, spacing requests to avoid rate issues
  for (let idx = 0; idx < items.length; idx++) {
    const it = items[idx];
    const title = `[UI][Backlog][${it.num}] ${it.title}`;
    const body = `Automated backlog creation from UX backlog.\n\n${it.body}\n\nRef: UX_BACKLOG.md`;
    const req = { jsonrpc: '2.0', id: 100 + idx, method: 'tools/call', params: { name: 'create_issue', arguments: { title, body } } };
    console.log('Creating:', title);
    send(req, proc);
    // Wait 1s between calls to let GH CLI and server settle
    await new Promise(r => setTimeout(r, 1000));
  }

  // Give server some time to respond then kill
  await new Promise(r => setTimeout(r, 2000));
  try { proc.kill(); } catch(e) {}

  console.log('Done.');
})();
