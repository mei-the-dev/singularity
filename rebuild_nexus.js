#!/usr/bin/env node

/**
 * rebuild_nexus.js
 * Autonomous scaffold for the Dashboard UI (Next.js + Tailwind + Core Components)
 * * Run: node rebuild_nexus.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Utility: Write file, creating dirs as needed
function writeFileRecursive(filePath, content) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content);
}

// Utility: Run shell command
function run(cmd, opts = {}) {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit', ...opts });
}

// 1. Create ui directory and package.json
const uiDir = path.join(process.cwd(), 'ui');
if (fs.existsSync(uiDir)) {
    console.log("Cleaning existing ui directory...");
    fs.rmSync(uiDir, { recursive: true, force: true });
}
fs.mkdirSync(uiDir);

console.log("Scaffolding package.json...");
const pkgJson = {
    name: "dashboard-ui",
    version: "0.1.0",
    private: true,
    scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start"
    },
    dependencies: {
        next: "^14.0.0",
        react: "^18.0.0",
        "react-dom": "^18.0.0",
        tailwindcss: "^3.4.0",
        "lucide-react": "^0.284.0",
        "framer-motion": "^11.0.0",
        clsx: "^2.1.0",
        "tailwind-merge": "^2.2.0"
    },
    devDependencies: {
        typescript: "^5.0.0",
        "@types/react": "^18.0.0",
        "@types/node": "^20.0.0",
        "autoprefixer": "^10.0.0",
        "postcss": "^8.0.0"
    }
};
writeFileRecursive(path.join(uiDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

// 2. Create Tailwind config (tailwind.config.ts)
const tailwindConfig = `import type { Config } from 'tailwindcss'
const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                void: "#050505",
                gold: "#D4AF37"
            }
        }
    },
    plugins: []
}
export default config
`;
writeFileRecursive(path.join(uiDir, 'tailwind.config.ts'), tailwindConfig);

// 3. Create minimal next.config.js and tsconfig.json
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
`;
writeFileRecursive(path.join(uiDir, 'next.config.js'), nextConfig);

const tsConfig = `{
    "compilerOptions": {
        "target": "ESNext",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [
            {
                "name": "next"
            }
        ],
        "paths": {
            "@/*": ["./*"]
        }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}
`;
writeFileRecursive(path.join(uiDir, 'tsconfig.json'), tsConfig);

// 4. Create Tailwind CSS globals (globals.css)
const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
    background: theme('colors.void');
    color: theme('colors.gold');
}
`;
writeFileRecursive(path.join(uiDir, 'app/globals.css'), globalsCss);

// 5. Create API Bridge (app/api/status/route.ts)
// Note: We move up two levels from ui/app/api/status to reach .task-context
const apiRoute = `import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
    try {
        // Adjust path to reach root from .next/server/app/api/status/...
        // But for local dev, process.cwd() is usually 'ui' folder
        const filePath = path.resolve(process.cwd(), '../.task-context/active.json')
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8')
            return NextResponse.json(JSON.parse(data))
        }
        return NextResponse.json({ status: 'idle', task: null })
    } catch (e) {
        return NextResponse.json({ error: 'Agent context unavailable' }, { status: 404 })
    }
}
`;
writeFileRecursive(path.join(uiDir, 'app/api/status/route.ts'), apiRoute);

// 6. Create Core Components

// components/Board.tsx
const boardTsx = `import React, { useState, useEffect } from "react";
import IssueCard from "./IssueCard";
import { motion, AnimatePresence } from "framer-motion";

type Issue = {
    id: string;
    title: string;
    description: string;
};

export default function Board() {
    const [issues, setIssues] = useState<Issue[]>([
        { id: "1", title: "Genesis", description: "The Dashboard is Online." }
    ]);
    const [status, setStatus] = useState<any>(null);

    // Poll Agent Context
    useEffect(() => {
        const fetchStatus = async () => {
             try {
                 const res = await fetch('/api/status');
                 const data = await res.json();
                 setStatus(data);
                 if(data.currentTask) {
                     setIssues(prev => {
                        if(prev.find(i => i.id === "task")) return prev;
                        return [...prev, { id: "task", title: "Active Task", description: "Issue #" + data.currentTask }]
                     });
                 }
             } catch(e) {}
        };
        const timer = setInterval(fetchStatus, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full max-w-5xl min-h-[60vh] bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-wrap gap-6">
            <AnimatePresence>
                {issues.map(issue => (
                    <motion.div key={issue.id} layout initial={{opacity:0}} animate={{opacity:1}}>
                        <IssueCard {...issue} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
`;
writeFileRecursive(path.join(uiDir, 'components/Board.tsx'), boardTsx);

// components/IssueCard.tsx
const issueCardTsx = `import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { Move } from "lucide-react";

type Props = {
    id: string;
    title: string;
    description: string;
};

export default function IssueCard({ id, title, description }: Props) {
    return (
        <motion.div
            className={clsx(
                "backdrop-blur-lg bg-black/40 border border-[#D4AF37]/30 rounded-2xl shadow-lg p-6 min-w-[250px] max-w-xs",
                "hover:shadow-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-colors relative group cursor-grab active:cursor-grabbing"
            )}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            layout
        >
            <div className="absolute top-3 right-3 text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors">
                <Move size={16} />
            </div>
            <h3 className="text-[#D4AF37] text-lg font-bold mb-2 tracking-wide">{title}</h3>
            <p className="text-[#D4AF37]/70 text-sm font-light leading-relaxed">{description}</p>
        </motion.div>
    );
}
`;
writeFileRecursive(path.join(uiDir, 'components/IssueCard.tsx'), issueCardTsx);

// 7. Create Main Page (app/page.tsx)
const pageTsx = `import Board from "../components/Board";

export default function Page() {
    return (
        <main className="min-h-screen bg-void flex flex-col items-center justify-center p-10 bg-[#050505] text-[#D4AF37]">
            <div className="text-center mb-12">
                 <h1 className="text-5xl font-extrabold mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFE5B4]">
                    SINGULARITY
                 </h1>
                 <p className="text-[#D4AF37]/50 uppercase tracking-[0.3em] text-xs">Autonomous DevOps Interface</p>
            </div>
            <Board />
        </main>
    );
}
`;
writeFileRecursive(path.join(uiDir, 'app/page.tsx'), pageTsx);

// 8. Create app/layout.tsx for Next.js root layout
const layoutTsx = `import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Singularity Dashboard',
  description: 'Event Horizon Interface',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased bg-void selection:bg-gold/30 selection:text-gold">{children}</body>
        </html>
    );
}
`;
writeFileRecursive(path.join(uiDir, 'app/layout.tsx'), layoutTsx);

// 9. Post-process: Install dependencies
console.log("Installing dependencies in ./ui (this may take a minute)...");
run('npm install', { cwd: uiDir });

console.log("\n✅ SUCCESS: Dashboard scaffolded in ./ui");
console.log("👉 To launch: cd ui && npm run dev");