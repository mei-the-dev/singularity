#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = spawn('node', [join(__dirname, 'index.js')], { stdio: ['pipe', 'pipe', 'inherit'] });
let id = 1;
function send(method, params = {}){
  const req = { jsonrpc: '2.0', id: id++, method, params };
  console.log('Sending:', JSON.stringify(req));
  server.stdin.write(JSON.stringify(req) + '\n');
}

server.stdout.on('data', (d) => {
  try { console.log(JSON.stringify(JSON.parse(d.toString()), null, 2)); } catch { console.log(d.toString()); }
});

send('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'create-pr-caller', version: '1.0' } });
setTimeout(() => { send('tools/call', { name: 'create_pr', arguments: { title: 'WIP: task/issue-32 work' } }); }, 200);
setTimeout(() => server.kill(), 5000);
