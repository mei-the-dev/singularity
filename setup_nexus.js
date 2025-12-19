#!/usr/bin/env node

/**
 * setup_nexus.js
 * "The Big Bang" - Instantly scaffolds the Singularity Dashboard (V29).
 * Enforces: Void & Gold Theme, MCP Bridge, and Kanban Logic.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const UI_DIR = path.join(process.cwd(), 'ui');

function write(relPath, content) {
    const fullPath = path.join(UI_DIR, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim());
    console.log(`✅ Created: ui/${relPath}`);
}

console.log("\x1b[33m>>> INITIATING NEXUS PROTOCOL <<<\x1b[0m");

// 1. CLEAN SLATE
if (fs.existsSync(UI_DIR)) {
    console.log("...Wiping existing UI timeline...");
    fs.rmSync(UI_DIR, { recursive: true, force: true });
}
fs.mkdirSync(UI_DIR);

// 2. DEPENDENCIES (Package.json)
write('package.json', JSON.stringify({
    name: "singularity-nexus",
    version: "29.0.0",
    private: true,
    scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
    },
    dependencies: {
        "next": "14.1.0",
        "react": "^18",
        "react-dom": "^18",
        "framer-motion": "^11.0.0",
        "lucide-react": "^0.300.0",
        "clsx": "^2.1.0",
        "tailwind-merge": "^2.2.0"
    },
    devDependencies: {
        "typescript": "^5",
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        "autoprefixer": "^10.0.1",
        "postcss": "^8",
        "tailwindcss": "^3.3.0"
    }
}, null, 2));

// 3. THEME CONFIG (Void & Gold)
write('tailwind.config.ts', `
import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: { DEFAULT: "#050505", surface: "#0a0a0a", border: "#1a1a1a" },
        gold: { DEFAULT: "#D4AF37", dim: "rgba(212, 175, 55, 0.4)", glow: "rgba(212, 175, 55, 0.15)" }
      },
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
};
export default config;
`);

write('app/globals.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --background: #050505; --foreground: #ededed; }
body {
  color: var(--foreground);
  background: var(--background);
  overflow-x: hidden;
}
/* Glassmorphism Utilities */
.glass-panel {
    @apply backdrop-blur-xl bg-white/5 border border-white/10;
}
.gold-glow {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
}
`);

// 4. NEXT.JS CONFIG
write('next.config.js', `/** @type {import('next').NextConfig} */
const nextConfig = {}; module.exports = nextConfig;`);

write('tsconfig.json', JSON.stringify({
    compilerOptions: {
        target: "es5", lib: ["dom", "dom.iterable", "esnext"], allowJs: true, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "preserve", incremental: true, plugins: [{ name: "next" }], paths: { "@/*": ["./*"] }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
}, null, 2));

// 5. THE MCP BRIDGE (The Neural Link)
write('app/api/issues/route.ts', `
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

        const send = (m: string, p: any) => proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: id++, method: m, params: p }) + '\\n');

        proc.stdout.on('data', (d) => {
            buffer += d.toString();
            const lines = buffer.split('\\n');
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
`);

// 6. COMPONENTS

// IssueCard.tsx
write('components/IssueCard.tsx', `
'use client';
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { GripVertical, GitPullRequest, Play } from "lucide-react";

export default function IssueCard({ issue, onAction }: any) {
    const isDone = issue.state === 'closed';
    return (
        <motion.div
            layoutId={String(issue.number)}
            className={clsx(
                "glass-panel rounded-xl p-4 w-full mb-3 group relative overflow-hidden",
                "hover:border-gold/50 transition-colors cursor-grab active:cursor-grabbing",
                isDone && "opacity-50 grayscale"
            )}
            whileHover={{ scale: 1.02 }}
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(e, info) => {
                if (info.offset.x > 100) onAction('close', issue.number);
                if (info.offset.x < -100 && !isDone) onAction('plan', issue.number);
            }}
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gold/20 group-hover:bg-gold transition-colors" />
            <div className="flex justify-between items-start mb-2 pl-3">
                <span className="font-mono text-xs text-gold/60">#{issue.number}</span>
                <GripVertical size={16} className="text-white/20" />
            </div>
            <h3 className="text-gold font-medium pl-3 pr-2 text-sm leading-tight mb-2">{issue.title}</h3>
            
            {/* Context Actions Overlay */}
            <div className="flex gap-2 pl-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => onAction('plan', issue.number)} className="p-1 rounded bg-gold/10 hover:bg-gold/30 text-gold" title="Start Task">
                    <Play size={14} />
                 </button>
                 <button onClick={() => onAction('pr', issue.number)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-white" title="Create PR">
                    <GitPullRequest size={14} />
                 </button>
            </div>
        </motion.div>
    );
}
`);

// Board.tsx
write('components/Board.tsx', `
'use client';
import { useState, useEffect } from 'react';
import IssueCard from './IssueCard';
import { AnimatePresence } from 'framer-motion';

export default function Board() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        try {
            const res = await fetch('/api/issues');
            const data = await res.json();
            setIssues(Array.isArray(data) ? data : []);
        } catch(e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { refresh(); const t = setInterval(refresh, 5000); return () => clearInterval(t); }, []);

    const handleAction = async (type: string, id: number) => {
        setLoading(true);
        if (type === 'close') {
            await fetch('/api/issues', { method: 'POST', body: JSON.stringify({ action: 'update', args: { issue_number: id, state: 'closed' } }) });
        } else if (type === 'plan') {
             await fetch('/api/issues', { method: 'POST', body: JSON.stringify({ action: 'plan', args: { issue_id: id } }) });
        }
        refresh();
    };

    if (loading && issues.length === 0) return <div className="text-gold animate-pulse mt-20 text-center font-mono">ESTABLISHING LINK...</div>;

    const openIssues = issues.filter((i: any) => i.state === 'open');
    const closedIssues = issues.filter((i: any) => i.state === 'closed');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
            <div className="glass-panel rounded-2xl p-6 min-h-[60vh]">
                <h2 className="text-gold text-xs font-mono uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-2">Active Protocol</h2>
                <AnimatePresence>
                    {openIssues.map((i: any) => <IssueCard key={i.number} issue={i} onAction={handleAction} />)}
                </AnimatePresence>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 min-h-[60vh] opacity-60">
                <h2 className="text-white/40 text-xs font-mono uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-2">Entropy (Done)</h2>
                 <AnimatePresence>
                    {closedIssues.map((i: any) => <IssueCard key={i.number} issue={i} onAction={handleAction} />)}
                </AnimatePresence>
            </div>
        </div>
    );
}
`);

// 7. PAGES
write('app/layout.tsx', `
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Singularity Nexus", description: "Event Horizon Interface" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-gold/30 selection:text-gold">{children}</body>
    </html>
  );
}
`);

write('app/page.tsx', `
import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
      <div className="z-10 w-full max-w-6xl mb-12 flex justify-between items-end">
        <div>
             <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-white tracking-tighter">NEXUS</h1>
             <p className="text-gold/50 font-mono text-xs mt-2">V29.0.0 // SYSTEM ONLINE</p>
        </div>
        <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-white/50 font-mono">MCP LINK: ACTIVE</span>
        </div>
      </div>
      <Board />
    </main>
  );
}
`);

// 8. INSTALL
console.log("Installing dependencies (this may take 30s)...");
execSync('npm install', { cwd: UI_DIR, stdio: 'inherit' });

console.log("\n\x1b[32m>>> NEXUS DEPLOYED <<<\x1b[0m");
console.log("Run: \x1b[36mnpm run dev --prefix ui\x1b[0m");
