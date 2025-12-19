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