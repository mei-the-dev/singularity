"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Issue } from "./IssuesProvider";

const IssueCardInner = ({ issue, onOpen }: { issue: Issue; onOpen?: (id: string) => void }) => {
  return (
    <motion.div
      layout
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      whileDrag={{ scale: 0.98, opacity: 0.92, boxShadow: '0 18px 50px rgba(212,175,55,0.08)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="glass-panel p-4 rounded-lg cursor-grab active:cursor-grabbing focus:outline-none focus-gold transition-shadow duration-[var(--motion-duration-short)] ease-[var(--motion-easing)] hover:shadow-2xl"
      onDoubleClick={() => onOpen && onOpen(issue.id)}
      style={{ touchAction: 'none', background: 'linear-gradient(180deg, rgba(20,20,20,0.8), rgba(8,8,10,0.7))', filter: 'drop-shadow(0 8px 24px var(--gold-subtle))' }}
      role="button"
      tabIndex={0}
      aria-label={`Issue card: ${issue.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen && onOpen(issue.id); }
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>{issue.type || 'Task'}</div>
          <div className="font-semibold mt-1" style={{ color: 'var(--panel-contrast)' }}>{issue.title}</div>
        </div>
        <div className="text-xs" style={{ color: 'var(--accent)' }}>{issue.priority || 'Medium'}</div>
      </div>
      <div className="mt-3 text-xs flex justify-between items-center" style={{ color: 'var(--muted)' }}>
        <span>#{issue.id}</span>
        <div className="flex items-center gap-2">
          <span>{issue.assignee || 'Unassigned'}</span>
          <PipelineBadge issueId={issue.id} />
        </div>
      </div>
    </motion.div>
  );
};

const PipelineBadge: React.FC<{ issueId: string }> = ({ issueId }) => {
  const [status, setStatus] = React.useState<string | null>(null);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/pipeline?issueId=${issueId}`);
        if (!res.ok) return;
        const d = await res.json();
        if (mounted) setStatus(d.status);
      } catch (e) {}
    })();
    return () => { mounted = false; };
  }, [issueId]);
  if (!status) return null;
  const color = status === 'success' ? 'var(--success)' : status === 'failure' ? 'var(--danger)' : 'var(--muted)';
  return <span style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, color, fontSize: 11 }}>{status}</span>;
};

export default React.memo(IssueCardInner);
