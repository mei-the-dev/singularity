import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// POINT TO THE MCP SERVER
const SERVER_PATH = path.resolve(process.cwd(), '../mcp/index.js');

async function callMcp(tool: string, args: any = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn('node', [SERVER_PATH], { stdio: ['pipe', 'pipe', 'inherit'] });
        let buffer = '';
        let result = null;
        let id = 1;

        const send = (m: string, p: any) => proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: id++, method: m, params: p }) + '\n');

        proc.stdout.on('data', (d) => {
            buffer += d.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                if(!line.trim()) continue;
                try {
                    const msg = JSON.parse(line);
                    if (msg.id === 2 && msg.result) {
                        result = JSON.parse(msg.result.content[0].text);
                        proc.kill();
                        resolve(result);
                    }
                } catch (e) {}
            }
        });

        send('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'nexus-ui', version: '1.0' } });
        setTimeout(() => send('tools/call', { name: tool, arguments: args }), 200);
        setTimeout(() => { proc.kill(); reject("MCP Timeout"); }, 5000);
    });
}

export async function GET() {
    try {
        const data: any = await callMcp('list_issues', { limit: 50 });
        return NextResponse.json(data.json || data || []);
    } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const tool = body.action === 'create' ? 'create_issue' : (body.action === 'plan' ? 'start_task' : 'update_issue');
        const data = await callMcp(tool, body.args);
        return NextResponse.json(data);
    } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}