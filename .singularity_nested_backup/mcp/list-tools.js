#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = spawn('node', [join(__dirname, 'index.js')], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let id = 1;
function send(method, params = {}){
  const req = { jsonrpc: '2.0', id: id++, method, params };
  server.stdin.write(JSON.stringify(req) + '\n');
}

let buffer = '';
server.stdout.on('data', (d) => {
  buffer += d.toString();
  // try to split lines
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || '';
  for (const line of lines){
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id === 2 && msg.result && msg.result.tools){
        console.log('TOOLS LIST:');
        console.log(JSON.stringify(msg.result.tools, null, 2));
        server.kill();
        process.exit(0);
      } else {
        console.log('RECV:', JSON.stringify(msg));
      }
    } catch (err){
      console.log('RAW:', line);
    }
  }
});

// initialize then ask for tools
send('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'list-tools', version: '1.0' } });
setTimeout(() => { send('tools/list'); }, 100);
