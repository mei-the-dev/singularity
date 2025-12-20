import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

async function callMCPTool(name: string, args: any = {}){
  return new Promise<any>((resolve) => {
    try {
      const mcpIndex = path.resolve(process.cwd(), '..', 'mcp', 'index.js');
      const proc = spawn('node', [mcpIndex], { stdio: ['pipe', 'pipe', 'inherit'] });
      let buf = '';
      proc.stdout.on('data', (d) => {
        buf += d.toString();
        const lines = buf.split('\n').map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.id === 2 && json.result && Array.isArray(json.result.content)) {
              const txt = json.result.content[0]?.text;
              try { const parsed = JSON.parse(txt); resolve(parsed); proc.kill(); return; } catch (e) { resolve(txt); proc.kill(); return; }
            }
          } catch (e) {}
        }
      });
      const send = (obj: any) => proc.stdin.write(JSON.stringify(obj) + '\n');
      send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'ui-bridge', version: '1.0' } } });
      setTimeout(() => send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name, arguments: args } }), 50);
      setTimeout(() => { try { proc.kill(); } catch{}; resolve(null); }, 30000);
    } catch (e) { resolve(null); }
  });
}

export async function GET() {
  try {
    const res = await callMCPTool('check_pipeline', {});
    if (!res) return NextResponse.json({ status: 'unknown' });
    return NextResponse.json(res);
  } catch (e) { return NextResponse.json({ status: 'error' }); }
}

export async function POST() {
  try {
    const res = await callMCPTool('check_pipeline', { run: true });
    return NextResponse.json({ ok: true, res });
  } catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 400 }); }
}
