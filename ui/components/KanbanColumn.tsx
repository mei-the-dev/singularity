"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import IssueCard from './IssueCard';

type SimpleIssue = { id: string; title: string; type?: string; assignee?: string };

const statusFromTitle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('backlog')) return 'backlog';
  if (t.includes('progress') || t.includes('in progress')) return 'in-progress';
  if (t.includes('done')) return 'done';
  return 'backlog';
};

export default function KanbanColumn({ title, issues }: { title: string; issues: SimpleIssue[] }) {
  const status = title.toLowerCase().includes('progress') ? 'in-progress' : title.toLowerCase().includes('done') ? 'done' : 'backlog';

  const [isDragOver, setIsDragOver] = useState(false);

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer?.getData('text/issue-id');
    if (!id) return;
    try {
      await fetch('/api/issues', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      if (typeof window !== 'undefined') window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="min-w-[320px]" data-testid="kanban-column" aria-label={title} role="listitem">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <div className="text-xs text-white/50">{issues.length}</div>
      </div>
      <motion.div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        className={`space-y-3 min-h-[300px] transition-all rounded-md p-2 hover:bg-white/5 ${isDragOver ? 'drop-highlight' : ''}`}
        animate={isDragOver ? { scale: 1.02, boxShadow: '0 18px 60px rgba(212,175,55,0.10)', filter: 'drop-shadow(0 12px 30px rgba(212,175,55,0.06))' } : { scale: 1, boxShadow: '0 0px 0 rgba(0,0,0,0)' }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        aria-label={`${title} issues`}
        role="list"
      >
        {issues.map((i) => (
          <div
            key={i.id}
            draggable
            onDragStart={(e) => e.dataTransfer?.setData('text/issue-id', i.id)}
            tabIndex={0}
            onKeyDown={async (e: React.KeyboardEvent) => {
              const order = ['backlog', 'in-progress', 'done'];
              const currentIndex = order.indexOf(status);
              let targetStatus: string | null = null;
              if (e.key === 'ArrowRight') {
                if (currentIndex < order.length - 1) targetStatus = order[currentIndex + 1];
              } else if (e.key === 'ArrowLeft') {
                if (currentIndex > 0) targetStatus = order[currentIndex - 1];
              } else if (e.key === 'Enter') {
                // Enter opens details (placeholder) — future: focus behavior or modal
                return;
              }
              if (!targetStatus) return;
              e.preventDefault();
              try {
                await fetch('/api/issues', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: i.id, status: targetStatus }) });
                if (typeof window !== 'undefined' && !process.env.JEST_WORKER_ID) window.location.reload();
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <IssueCard issue={{ id: i.id, title: i.title, status: statusFromTitle(title) as any, assignee: i.assignee }} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}