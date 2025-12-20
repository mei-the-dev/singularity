"use client";
import React, { useEffect, useState } from 'react';

export default function PipelineWidget() {
  const [state, setState] = useState<{ status?: string; lastRun?: string; duration?: string; running?: boolean }>({});
  const fetchState = async () => {
    try {
      const res = await fetch('/api/pipeline');
      if (!res.ok) throw new Error('Failed to fetch pipeline');
      const data = await res.json();
      setState(data);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => { fetchState(); const iv = setInterval(fetchState, 15000); return () => clearInterval(iv); }, []);
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white">Pipeline</h3>
        <div className="text-xs text-white/50">{state.status || 'idle'}</div>
      </div>
      <div className="text-xs text-muted text-white/60 mb-3">Last run: {state.lastRun || '—'}</div>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-white/6 text-white/90" onClick={async () => { setState(s => ({ ...s, running: true })); try { await fetch('/api/pipeline', { method: 'POST' }); } catch {} finally { setState(s => ({ ...s, running: false })); fetchState(); } }}>{state.running ? 'Running…' : 'Run'}</button>
        <a className="px-3 py-1 rounded border border-white/6 text-xs text-white/70" href="/pipeline/logs">Details</a>
      </div>
    </div>
  );
}
