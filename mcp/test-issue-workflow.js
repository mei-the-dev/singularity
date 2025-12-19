#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = spawn('node', [join(__dirname, 'index.js')], { stdio: ['pipe', 'pipe', 'inherit'], cwd: path.join(__dirname, '..', '..') });
let id = 1;
function send(method, params = {}){
  const req = { jsonrpc: '2.0', id: id++, method, params };
  console.log('Sending:', JSON.stringify(req));
  server.stdin.write(JSON.stringify(req) + '\n');
}

let buffer = '';
server.stdout.on('data', (d) => {
  buffer += d.toString();
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || '';
  for (const line of lines){
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      console.log('Received:', JSON.stringify(msg));
    } catch (err){
      console.log('RAW:', line);
    }
  }
});

// init
send('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test-issue-workflow', version: '1.0' } });
setTimeout(() => { send('tools/call', { name: 'create_issue', arguments: { title: 'MCP workflow test', body: 'Created by automated smoke test\nMultiline body' } }); }, 200);
setTimeout(() => { send('tools/call', { name: 'list_issues', arguments: { limit: 20 } }); }, 900);
setTimeout(() => { send('tools/call', { name: 'start_task', arguments: { issue_id: 2 } }); }, 1700);
setTimeout(() => { send('tools/call', { name: 'update_issue', arguments: { issue_number: 2, state: 'closed' } }); }, 2400);
setTimeout(() => { send('tools/call', { name: 'check_pipeline', arguments: {} }); }, 3100);
setTimeout(() => { server.kill(); }, 3800);
