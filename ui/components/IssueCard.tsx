"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Issue } from "./IssuesProvider";

export default function IssueCard({ issue, onOpen }: { issue: Issue; onOpen?: (id: string) => void }) {
  // ARIA: role, tabIndex, aria-label, color contrast
  return (
    <motion.div
      layout
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-panel p-4 rounded-lg cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/60 transition-shadow duration-150 ease-in-out hover:shadow-lg"
      onDoubleClick={() => onOpen && onOpen(issue.id)}
      style={{ touchAction: 'none', color: '#fff', background: 'rgba(20,20,20,0.7)' }}
      role="button"
      tabIndex={0}
      aria-label={`Issue card: ${issue.title}`}
      // TODO: Keyboard DnD handlers (future)
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-semibold" style={{ color: '#FFD700' }}>{issue.type || 'Task'}</div>
          <div className="font-semibold mt-1" style={{ color: '#fff' }}>{issue.title}</div>
        </div>
        <div className="text-xs" style={{ color: '#00BFFF' }}>{issue.priority || 'Medium'}</div>
      </div>
      <div className="mt-3 text-xs flex justify-between" style={{ color: '#B0B0B0' }}>
        <span>#{issue.id}</span>
        <span>{issue.assignee || 'Unassigned'}</span>
      </div>
    </motion.div>
  );
}
