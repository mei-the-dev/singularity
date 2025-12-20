'use client';
import { Terminal, Cpu, GitBranch, Activity } from 'lucide-react';
import { IssuesProvider } from '../components/IssuesProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ToastProvider } from '../components/Toast';
import KanbanBoard from '../components/KanbanBoard';

export default function SingularityDashboard() {
    return (
        <ToastProvider>
        <IssuesProvider>
            <ErrorBoundary>
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
        
        {/* Main: Kanban Board */}
        <div className="glass-panel rounded-2xl p-6 md:col-span-2 flex flex-col relative overflow-hidden group" role="region" aria-label="Main Kanban">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition"><Cpu size={48} /></div>

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl text-cyan-300 mb-0 flex items-center gap-2"><Activity /> KANBAN BOARD</h2>
                <div className="text-xs text-white/50">Live</div>
            </div>

            <div className="flex-1 min-h-[420px]">
                {/* KanbanBoard component renders columns and issues */}
                <KanbanBoard />
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-sm text-white/40">
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
                    <p>&gt; System initialized...</p>
                    <p>&gt; Visual interface loaded.</p>
                    <p>&gt; Waiting for Copilot...</p>
                </div>
            </div>
        </div>

            </div>
                </div>
            </ErrorBoundary>
        </IssuesProvider>
        </ToastProvider>
    );
}