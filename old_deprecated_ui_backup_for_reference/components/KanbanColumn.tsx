"use client";
import React from 'react';
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

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/issue-id');
    if (!id) return;
    try {
      await fetch('/api/issues', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      if (typeof window !== 'undefined') window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="min-w-[320px]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <div className="text-xs text-white/50">{issues.length}</div>
      </div>
      <div onDrop={onDrop} onDragOver={onDragOver} className="space-y-3 min-h-[300px]">
        {issues.map((i) => (
          <div key={i.id} draggable onDragStart={(e) => e.dataTransfer.setData('text/issue-id', i.id)}>
            <IssueCard issue={{ id: i.id, title: i.title, status: statusFromTitle(title) as any, assignee: i.assignee }} />
          </div>
        ))}
      </div>
    </div>
  );
}