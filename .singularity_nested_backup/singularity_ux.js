/**
 * 3. SETUP_SINGULARITY_UI.JS
 * The Face.
 * Scaffolds: Next.js 14, Tailwind, "Event Horizon" Animation Theme.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const UI_ROOT = path.join(ROOT, 'ui');
const log = (m) => console.log(`[UI] ${m}`);

function write(relPath, content) {
    const p = path.join(UI_ROOT, relPath);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content.trim());
    log(`Generated: ${relPath}`);
}

console.log(">>> CONSTRUCTING SINGULARITY INTERFACE...");

// 1. SCAFFOLDING
if (!fs.existsSync(UI_ROOT)) fs.mkdirSync(UI_ROOT);

write('package.json', JSON.stringify({
  "name": "singularity-ui",
  "version": "20.0.0",
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": { "next": "14.1.0", "react": "^18", "react-dom": "^18", "lucide-react": "latest", "framer-motion": "latest" },
  "devDependencies": { "autoprefixer": "^10", "postcss": "^8", "tailwindcss": "^3", "typescript": "^5" }
}, null, 2));

write('tailwind.config.ts', `
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: { 
    extend: { 
      colors: { space: "#030014", starlight: "#e2e8f0", void: "#000000" },
      animation: { 'spin-slow': 'spin 20s linear infinite' }
    } 
  },
  plugins: [],
};
export default config;
`);

write('postcss.config.js', `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };`);
write('tsconfig.json', JSON.stringify({ "compilerOptions": { "lib": ["dom", "esnext"], "allowJs": true, "skipLibCheck": true, "strict": true, "noEmit": true, "esModuleInterop": true, "module": "esnext", "moduleResolution": "bundler", "resolveJsonModule": true, "isolatedModules": true, "jsx": "preserve", "incremental": true, "plugins": [{ "name": "next" }], "paths": { "@/*": ["./*"] } }, "include": ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], "exclude": ["node_modules"] }, null, 2));

// 2. THE BLACK HOLE STYLING
write('app/globals.css', `
@tailwind base; @tailwind components; @tailwind utilities;

:root { --accent: #00f0ff; --accent-dim: #00f0ff20; }
body { background: #000; color: #fff; overflow: hidden; }

/* The Event Horizon */
.black-hole-container {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw; height: 80vw;
    z-index: -1; pointer-events: none;
    opacity: 0.6;
}
.accretion-disk {
    position: absolute; inset: 0;
    background: radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(100,0,255,0.2) 45%, rgba(0,240,255,0.4) 50%, transparent 70%);
    filter: blur(40px);
    animation: pulse 10s infinite alternate;
}
.singularity {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 20%; height: 20%;
    background: #000;
    border-radius: 50%;
    box-shadow: 0 0 50px 20px rgba(0, 150, 255, 0.3);
}

@keyframes pulse { 0% { opacity: 0.5; transform: scale(1); } 100% { opacity: 0.8; transform: scale(1.1); } }

.glass-panel {
    background: rgba(10, 10, 15, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
}
`);

// 3. THE LAYOUT & PAGE
write('app/layout.tsx', `
import "./globals.css";
export default function Root({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <div className="black-hole-container">
            <div className="accretion-disk"></div>
            <div className="singularity"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
`);

write('app/page.tsx', `
'use client';
import { Terminal, Cpu, GitBranch, Activity } from 'lucide-react';

export default function SingularityDashboard() {
  return (
    <div className="h-screen w-full flex flex-col p-8 font-mono">
      {/* Header */}
      <header className="flex justify-between items-end border-b border-white/10 pb-4 mb-8">
        <div>
            <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                SINGULARITY
            </h1>
            <p className="text-cyan-400/60 text-sm mt-1 tracking-widest">EVENT HORIZON // V20.0</p>
        </div>
        <div className="flex gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> SYSTEM ONLINE</span>
            <span>CPU: OPTIMAL</span>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        
        {/* Active Task */}
        <div className="glass-panel rounded-2xl p-6 md:col-span-2 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition"><Cpu size={48} /></div>
            <h2 className="text-xl text-cyan-300 mb-6 flex items-center gap-2"><Activity /> ACTIVE SEQUENCE</h2>
            
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-4xl font-light text-white">AWAITING INPUT</p>
                    <p className="text-sm text-cyan-400/50">Listening on Secure Channel /nexus</p>
                </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/5 flex gap-4 text-sm text-white/40">
                <span>TaskID: NULL</span>
                <span>Context: IDLE</span>
            </div>
        </div>

        {/* Side Panel (Repo Status) */}
        <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 h-1/2">
                <h2 className="text-lg text-purple-300 mb-4 flex items-center gap-2"><GitBranch /> REPOSITORY</h2>
                <ul className="space-y-3 text-sm text-white/70">
                    <li className="flex justify-between"><span>Branch</span> <span className="text-white">main</span></li>
                    <li className="flex justify-between"><span>Status</span> <span className="text-green-400">Clean</span></li>
                    <li className="flex justify-between"><span>Issues</span> <span>Fetching...</span></li>
                </ul>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 h-[45%]">
                <h2 className="text-lg text-emerald-300 mb-4 flex items-center gap-2"><Terminal /> LOG FEED</h2>
                <div className="text-xs font-mono text-emerald-500/80 space-y-1">
                    <p>> System initialized...</p>
                    <p>> Visual interface loaded.</p>
                    <p>> Waiting for Copilot...</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
`);

// 4. INSTALLATION
console.log("[UI] Installing dependencies (this may take a minute)...");
try {
    execSync('npm install', { cwd: UI_ROOT, stdio: 'inherit' });
    console.log("[UI] Done. To launch manually: cd ui && npm run dev");
} catch (e) {
    console.log("[UI] Auto-install failed. Please run 'cd ui && npm install' manually.");
}