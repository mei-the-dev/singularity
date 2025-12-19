'use client';
import { useState, useEffect } from 'react';
import IssueCard from './IssueCard';
import IssueModal from './IssueModal';
import { AnimatePresence } from 'framer-motion';

export default function Board() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<any | null>(null);

    const { issues: ctxIssues, loading: ctxLoading, refresh: ctxRefresh, plan, update: ctxUpdate, runTests: ctxRunTests } = useIssues();

    useEffect(() => { setIssues(ctxIssues); setLoading(ctxLoading); }, [ctxIssues, ctxLoading]);

    const refresh = ctxRefresh;
    const handleAction = async (type: string, id: number) => {
        setLoading(true);
        try {
          if (type === 'close') {
              await ctxUpdate(id, { state: 'closed' });
          } else if (type === 'plan') {
               await plan(id);
          } else if (type === 'run_tests') {
               await ctxRunTests(id);
          }
        } catch(e) { console.error(e); }
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
                    {openIssues.map((i: any) => <IssueCard key={i.number} issue={i} onAction={handleAction} onOpen={(id)=>openById(id)} />)}
                </AnimatePresence>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 min-h-[60vh] opacity-60">
                <h2 className="text-white/40 text-xs font-mono uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-2">Entropy (Done)</h2>
                 <AnimatePresence>
                    {closedIssues.map((i: any) => <IssueCard key={i.number} issue={i} onAction={handleAction} onOpen={(id)=>openById(id)} />)}
                </AnimatePresence>
            </div>

            {selected && <IssueModal issue={selected} onClose={() => { setSelected(null); refresh(); }} onAction={(t)=>handleAction(t, selected.number)} />}
            </div>
        </div>
    );
}