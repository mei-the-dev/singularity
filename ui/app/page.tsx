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