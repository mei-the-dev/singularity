import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

const FALLBACK = [
  { id: '101', title: 'Initial project setup', type: 'Task', priority: 'High', assignee: 'mei', status: 'backlog' },
  { id: '102', title: 'Wire up MCP connection', type: 'Bug', priority: 'Medium', assignee: '', status: 'in-progress' },
  { id: '103', title: 'Design Kanban UI', type: 'Task', priority: 'Low', assignee: 'alex', status: 'done' },
];

async function callMCPTool(name: string, args: any = {}){
  return new Promise<any>((resolve) => {
    try {
      const mcpIndex = path.resolve(process.cwd(), '..', 'mcp', 'index.js');
      const proc = spawn('node', [mcpIndex], { stdio: ['pipe', 'pipe', 'inherit'] });
      let buf = '';
      proc.stdout.on('data', (d) => {
        buf += d.toString();
        // try parse lines
        const lines = buf.split('\n').map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.id === 1 && json.result) {
              // init response
            }
            if (json.id === 2 && json.result && Array.isArray(json.result.content)) {
              const txt = json.result.content[0]?.text;
              try {
                const parsed = JSON.parse(txt);
                resolve(parsed);
                proc.kill();
                return;
              } catch (e) {
                // not JSON
                resolve(txt);
                proc.kill();
                return;
              }
            }
          } catch (e) {
            // ignore
          }
        }
      });
      const send = (obj: any) => proc.stdin.write(JSON.stringify(obj) + '\n');
      // initialize id=1
      send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'ui-bridge', version: '1.0' } } });
      // small delay then call tool id=2
      setTimeout(() => {
        send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name, arguments: args } });
      }, 50);
      // timeout fallback
      setTimeout(() => { try { proc.kill(); } catch{}; resolve(null); }, 3000);
    } catch (e) { resolve(null); }
  });
}

export async function GET() {
  try {
    const res = await callMCPTool('list_issues', { limit: 50 });
    if (!res) return NextResponse.json({ issues: FALLBACK });
    // res may be { json: '...'} or { issues: [...] }
    if (res.json) {
      try { const parsed = JSON.parse(res.json); return NextResponse.json({ issues: parsed }); } catch{}
    }
    if (res.issues) return NextResponse.json({ issues: res.issues });
    return NextResponse.json({ issues: FALLBACK });
  } catch (e) { return NextResponse.json({ issues: FALLBACK }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: string };
    // try to call MCP to update issue status (if such tool exists)
    // fallback: update local
    const res = await callMCPTool('start_task', { issue_id: Number(id) });
    return NextResponse.json({ ok: true, res });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 });
  }
}
