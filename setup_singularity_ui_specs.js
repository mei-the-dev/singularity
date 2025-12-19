/**
 * 3. SETUP_SINGULARITY_UI_SPEC.JS
 * The "Event Horizon Gold" Edition.
 * * SCAFFOLDS:
 * - Next.js 14 App Router Structure
 * - 'Void & Gold' Tailwind Theme
 * - Skeleton Components: KanbanBoard, IssueCard, Sidebar
 * - SPECIFICATION.md (The "Brain" for the Agent to finish the code)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const UI_ROOT = path.join(ROOT, 'ui');

function log(m) { console.log(`[UI-V22] ${m}`); }

function write(relPath, content) {
    const p = path.join(UI_ROOT, relPath);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content.trim());
    log(`Scaffolded: ${relPath}`);
}

console.log(">>> INITIALIZING SINGULARITY UI V22 (SCAFFOLD & SPEC)...");

// ==============================================================================
// 1. THE ARCHITECTURE (Next.js + Tailwind)
// ==============================================================================

if (!fs.existsSync(UI_ROOT)) fs.mkdirSync(UI_ROOT);

write('package.json', JSON.stringify({
  "name": "singularity-board",
  "version": "22.0.0",
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": { 
      "next": "14.1.0", "react": "^18", "react-dom": "^18", 
      "lucide-react": "latest", "clsx": "latest", "tailwind-merge": "latest", 
      "framer-motion": "latest" // Essential for the drag/drop interactions
  },
  "devDependencies": { "autoprefixer": "^10", "postcss": "^8", "tailwindcss": "^3", "typescript": "^5" }
}, null, 2));

write('tailwind.config.ts', `
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { 
    extend: { 
      colors: { 
        void: "#050505", 
        gold: { 400: "#FCD34D", 500: "#D4AF37", 600: "#B4941F" },
        glass: "rgba(20, 20, 20, 0.6)"
      },
      fontFamily: { mono: ['JetBrains Mono', 'monospace'] }
    } 
  },
  plugins: [],
};
export default config;
`);

write('postcss.config.js', `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };`);
write('tsconfig.json', JSON.stringify({ "compilerOptions": { "lib": ["dom", "esnext"], "allowJs": true, "skipLibCheck": true, "strict": true, "noEmit": true, "esModuleInterop": true, "module": "esnext", "moduleResolution": "bundler", "resolveJsonModule": true, "isolatedModules": true, "jsx": "preserve", "incremental": true, "plugins": [{ "name": "next" }], "paths": { "@/*": ["./*"] } }, "include": ["**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], "exclude": ["node_modules"] }, null, 2));

// ==============================================================================
// 2. THE VISUALS (Black Hole & Gold CSS)
// ==============================================================================

write('app/globals.css', `
@tailwind base; @tailwind components; @tailwind utilities;

:root {
  --gold-glow: 0 0 15px rgba(212, 175, 55, 0.2);
  --void-bg: #020202;
}

body { background: var(--void-bg); color: #e2e8f0; overflow: hidden; }

/* The Singularity Background */
.singularity-bg {
    position: fixed; inset: 0; z-index: -1;
    background: radial-gradient(circle at 50% 120%, #1a1a00 0%, #000 60%);
}
.accretion-disk {
    position: absolute; bottom: -40vh; left: 50%; transform: translateX(-50%);
    width: 150vw; height: 60vh;
    background: radial-gradient(ellipse, rgba(212,175,55,0.15) 0%, transparent 70%);
    filter: blur(60px);
    opacity: 0.6;
}

/* Glassmorphism Cards */
.card-glass {
    background: rgba(10, 10, 10, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
}
.card-glass:hover {
    border-color: rgba(212, 175, 55, 0.5); /* Gold hover */
    box-shadow: var(--gold-glow);
}
`);

// ==============================================================================
// 3. THE SKELETON COMPONENTS (Jira-Style)
// ==============================================================================

// A. Issue Card Component (The "Atom")
write('components/IssueCard.tsx', `
import { MoreHorizontal, GitBranch } from 'lucide-react';

interface IssueProps { title: string; id: string; type: 'bug'|'feat'; assignee?: string; }

export default function IssueCard({ title, id, type, assignee }: IssueProps) {
  // TODO FOR AGENT: Implement DragEvent handlers here
  return (
    <div className="card-glass p-3 rounded-md mb-3 cursor-grab active:cursor-grabbing group transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-gray-500 group-hover:text-gold-500 transition-colors">{id}</span>
        <button className="text-gray-600 hover:text-white"><MoreHorizontal size={14}/></button>
      </div>
      <h4 className="text-sm font-medium text-gray-200 mb-3 leading-tight">{title}</h4>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-2">
            {/* Type Indicator */}
            <span className={\`w-2 h-2 rounded-full \${type==='bug'?'bg-red-500':'bg-gold-500'}\`}/>
        </div>
        {assignee && <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-[10px]">{assignee[0]}</div>}
      </div>
    </div>
  );
}
`);

// B. Column Component (The "Container")
write('components/KanbanColumn.tsx', `
import IssueCard from './IssueCard';
import { Plus } from 'lucide-react';

export default function KanbanColumn({ title, issues }: { title: string, issues: any[] }) {
  return (
    <div className="min-w-[280px] w-[280px] flex flex-col h-full mx-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400 font-bold">{title} <span className="text-gray-600 ml-2">{issues.length}</span></h3>
        <button className="text-gray-500 hover:text-gold-400"><Plus size={16}/></button>
      </div>
      
      {/* Drop Zone */}
      <div className="flex-1 bg-white/5 rounded-lg p-2 overflow-y-auto custom-scrollbar">
        {issues.map(i => <IssueCard key={i.id} {...i} />)}
        {issues.length === 0 && (
            <div className="h-24 border-2 border-dashed border-white/5 rounded-md flex items-center justify-center text-xs text-gray-700">
                Drop Zone
            </div>
        )}
      </div>
    </div>
  );
}
`);

// C. Sidebar (Navigation)
write('components/Sidebar.tsx', `
import { Layout, GitPullRequest, Settings, Activity } from 'lucide-react';
export default function Sidebar() {
    const navItem = (Icon: any, active?: boolean) => (
        <div className={\`p-3 rounded-xl mb-4 transition-all \${active ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-gray-500 hover:text-gray-200'}\`}>
            <Icon size={20} />
        </div>
    );
    return (
        <aside className="w-16 border-r border-white/5 flex flex-col items-center py-6 glass-panel z-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-yellow-700 mb-8 shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
            {navItem(Layout, true)}
            {navItem(GitPullRequest)}
            {navItem(Activity)}
            <div className="mt-auto">{navItem(Settings)}</div>
        </aside>
    );
}
`);

// ==============================================================================
// 4. THE MAIN LAYOUT (Bringing it together)
// ==============================================================================

write('app/layout.tsx', `
import "./globals.css";
export default function Root({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="flex h-screen w-screen text-sm">
        <div className="singularity-bg"><div className="accretion-disk"/></div>
        {children}
      </body>
    </html>
  );
}
`);

write('app/page.tsx', `
'use client';
import Sidebar from '@/components/Sidebar';
import KanbanColumn from '@/components/KanbanColumn';

export default function SingularityBoard() {
  // MOCK DATA - Agent must replace this with real MCP calls
  const backlog = [{id:'ISS-101', title:'Refactor Auth Middleware', type:'feat'}, {id:'ISS-104', title:'Fix Race Condition', type:'bug'}];
  const inProg = [{id:'ISS-99', title:'Singularity UI Spec', type:'feat', assignee:'Agent'}];

  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/5 flex items-center px-6 justify-between backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <h1 className="text-lg font-medium text-white tracking-tight">Project Olympus</h1>
                <span className="px-2 py-0.5 rounded border border-gold-500/30 text-gold-500 text-[10px] bg-gold-500/5">SPRINT 21</span>
            </div>
            <div className="flex items-center gap-4">
               {/* Search Bar Placeholder */}
               <div className="w-64 h-8 bg-white/5 rounded border border-white/10" />
            </div>
        </header>

        {/* Board Canvas */}
        <div className="flex-1 overflow-x-auto p-6 flex gap-2">
            <KanbanColumn title="Backlog" issues={backlog} />
            <KanbanColumn title="In Progress" issues={inProg} />
            <KanbanColumn title="Review" issues={[]} />
            <KanbanColumn title="Done" issues={[]} />
        </div>
      </main>
    </>
  );
}
`);

// ==============================================================================
// 5. THE SPECIFICATION (The Brain for the AI)
// ==============================================================================

write('SPECIFICATION.md', `
# 🌌 SINGULARITY UI SPECIFICATION (V22)

## 🎯 OBJECTIVE
Transform this scaffold into a fully functional **Jira-Clone** connected to the Local MCP Agent.

## 🎨 DESIGN SYSTEM ("Void & Gold")
- **Backgrounds:** Never pure black. Use gradients of \`#050505\` to \`#101010\`.
- **Accents:** Gold (\`#D4AF37\`) is reserved for:
  - Active states.
  - Borders on hover.
  - "In Progress" indicators.
- **Glassmorphism:** All cards/panels must use \`backdrop-filter: blur(12px)\` and \`bg-opacity-10\`.

## 🛠️ COMPONENT REQUIREMENTS

### 1. \`KanbanBoard.tsx\` (The Grid)
- **Drag & Drop:** Must implement \`framer-motion\` or \`@dnd-kit/core\`.
- **Columns:**
  - Backlog (Gray)
  - In Progress (Gold Pulse Animation)
  - Done (Green Dimmed)

### 2. \`IssueCard.tsx\` (The Atom)
- **Props:** \`{ id, title, type, priority, assignee }\`
- **Interactions:**
  - Clicking opens a Modal (Overlay).
  - Hovering creates a "Gold Glow" effect (Shadow).

### 3. \`AgentConnection.tsx\` (The Brain)
- **Function:** Polls \`http://localhost:3000/api/status\` (or similar) to get real issues via MCP.
- **Logic:**
  - On Mount -> Call \`list_issues\`.
  - On Drop -> Call \`update_issue_status\`.

## 🚀 IMPLEMENTATION STEPS FOR AGENT
1. Run \`npm install\`.
2. Connect \`page.tsx\` state to a \`useContext\` hook.
3. Replace Mock Data with a \`useEffect\` that fetches from the file system or MCP server.
`);

console.log("[UI-V22] Scaffold Complete.");
console.log("---------------------------------------------------");
console.log("1. Run `node setup_singularity_ui_spec.js`");
console.log("2. Run `cd ui && npm install`");
console.log("3. Run `npm run dev` to see the 'Black & Gold' Jira skeleton.");
console.log("4. **NEXT:** Ask the Agent: 'Read SPECIFICATION.md and implement the Drag & Drop logic'.");
console.log("---------------------------------------------------");