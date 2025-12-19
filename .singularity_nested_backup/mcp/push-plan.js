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
  server.stdin.write(JSON.stringify(req) + '\n');
}
server.stdout.on('data', (d) => { try { console.log(JSON.stringify(JSON.parse(d.toString()), null, 2)); } catch { console.log(d.toString()); } });

const planTitle = 'UI: Kanban components & Agent integration plan';
const planBody = `Overview:\n- Implement Kanban board connected to local MCP agent to fetch and update issues.\n\nComponents:\n1) KanbanBoard.tsx - renders three columns, provides pointer-based drop detection and renders IssueCard instances.\n2) KanbanColumn.tsx - column wrapper, HTML5 drag/drop receiver, posts status updates to /api/issues.\n3) IssueCard.tsx - draggable card (framer-motion), opens modal on click, shows metadata.\n4) IssuesProvider.tsx - React Context, polls /api/issues and exposes updateIssueStatus().\n5) AgentConnection (API route and client) - server-side route /api/issues bridges MCP 'list_issues' and 'update' operations.\n\nDevelopment lifecycle per component:\n- Spec: write prop types, inputs/outputs, UX interactions.\n- Tests: unit tests for render + drag logic (Jest/React Testing Library), integration test for API POST.\n- Implement: create UI, wire events, call context hooks.\n- Verify: build + run dev, manually drag a card and confirm API update.\n- Polish: accessibility, styling, animations, performance.\n- Docs: README with run steps and API contract.\n\nNext steps:\n- Add real MCP integration: on mount call 'list_issues' via MCP and on update call 'create_issue' or POST to MCP bridge.\n- Add E2E test for DnD.\n`;

// initialize and then create issue
send('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'plan-pusher', version: '1.0' } });
setTimeout(() => {
  send('tools/call', { name: 'create_issue', arguments: { title: planTitle, body: planBody } });
}, 150);

setTimeout(() => server.kill(), 3000);
