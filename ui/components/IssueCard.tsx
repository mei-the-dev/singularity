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
        // Small keyboard shim: Enter to open, Space to open details
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
      <div className="mt-3 text-xs flex justify-between" style={{ color: '#B0B0B0' }}>
        <span>#{issue.id}</span>
        <span>{issue.assignee || 'Unassigned'}</span>
      </div>
    </motion.div>
  );
}
