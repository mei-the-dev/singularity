"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Issue } from "./IssuesProvider";

export default function IssueCard({ issue, onOpen }: { issue: Issue; onOpen?: (id: string) => void }) {
  return (
    <motion.div
      layout
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-panel p-4 rounded-lg cursor-grab"
      onDoubleClick={() => onOpen && onOpen(issue.id)}
      style={{ touchAction: 'none' }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-white/60">{issue.type || 'Task'}</div>
          <div className="font-semibold text-white mt-1">{issue.title}</div>
        </div>
        <div className="text-xs text-white/50">{issue.priority || 'Medium'}</div>
      </div>
      <div className="mt-3 text-xs text-white/50 flex justify-between">
        <span>#{issue.id}</span>
        <span>{issue.assignee || 'Unassigned'}</span>
      </div>
    </motion.div>
  );
}
