"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Issue } from "./IssuesProvider";

export default function IssueCard({ issue, onOpen, onAction }: { issue: Issue; onOpen?: (id: string) => void; onAction?: (type: string, id: number) => void }) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'P' || e.key === 'p') return onAction && onAction('plan', issue.number);
    if (e.key === 'C' || e.key === 'c') return onAction && onAction('close', issue.number);
    if (e.key === 'R' || e.key === 'r') return onAction && onAction('run_tests', issue.number);
  };

  return (
    <motion.div
      layout
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-panel p-4 rounded-lg cursor-grab"
      onDoubleClick={() => onOpen && onOpen(issue.id)}
      onKeyDown={handleKey}
      tabIndex={0}
      role="article"
      aria-labelledby={`issue-${issue.number}-title`}
      data-testid={`issue-${issue.number}`}
      style={{ touchAction: 'none' }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-white/60">{issue.type || 'Task'}</div>
          <div id={`issue-${issue.number}-title`} className="font-semibold text-white mt-1">{issue.title}</div>
        </div>
        <div className="text-xs text-white/50">{issue.priority || 'Medium'}</div>
      </div>
      <div className="mt-3 text-xs text-white/50 flex justify-between items-center">
        <div>
          <span>#{issue.number}</span>
          <span className="ml-4">{issue.assignee || 'Unassigned'}</span>
        </div>
        <div className="flex gap-2">
          <button aria-label="Plan" className="px-2 py-1 bg-white/5 rounded text-xs" onClick={() => onAction && onAction('plan', issue.number)} data-testid={`issue-${issue.number}-plan`}>Plan</button>
          <button aria-label="Run Tests" className="px-2 py-1 bg-white/5 rounded text-xs" onClick={() => onAction && onAction('run_tests', issue.number)} data-testid={`issue-${issue.number}-run`}>Tests</button>
          <button aria-label="Close" className="px-2 py-1 bg-white/5 rounded text-xs" onClick={() => onAction && onAction('close', issue.number)} data-testid={`issue-${issue.number}-close`}>Close</button>
        </div>
      </div>
    </motion.div>
  );
}
