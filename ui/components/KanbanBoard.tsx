"use client";
import React, { useRef, useState, useMemo } from "react";
import IssueCard from "./IssueCard";
import { useIssues } from "./IssuesProvider";
import { Issue } from "./IssuesProvider";

const COLUMNS: { key: Issue['status']; title: string; style?: string }[] = [
  { key: 'backlog', title: 'Backlog' },
  { key: 'in-progress', title: 'In Progress' },
  { key: 'done', title: 'Done' },
];

export default function KanbanBoard() {

  const { filteredIssues, updateIssueStatus } = useIssues();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // Handlers for HTML5 DnD
  const onDragStart = (e: React.DragEvent, issue: Issue) => {
    setDraggedId(issue.id);
    // JSDOM does not implement dataTransfer; guard for tests
    if (e.dataTransfer) {
      try {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/issue-id", issue.id);
      } catch {}
    }
  };

  const onDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  const onDragOverColHandler = (colKey: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverCol(colKey);
  };

  const onDropColHandler = (colKey: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverCol(null);
    const id = e.dataTransfer.getData("text/issue-id");
    if (!id) return;
    const issue = filteredIssues.find(i => i.id === id);
    if (issue && issue.status !== colKey) {
      updateIssueStatus(issue.id, colKey as Issue['status']);
    }
    setDraggedId(null);
  };

  // Responsive: use grid-cols-1 on mobile, grid-cols-2 on tablet, grid-cols-3 on desktop
  return (
    <div className="kanban-board grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" role="list" aria-label="Kanban Board Columns">
      {COLUMNS.map((col) => (
        <div
          key={col.key}
          className={`flex flex-col transition-all min-w-[260px] ${dragOverCol === col.key ? 'ring-2 ring-cyan-400' : ''}`}
          onDragOver={onDragOverColHandler(col.key)}
          onDrop={onDropColHandler(col.key)}
          role="listitem"
          aria-label={col.title}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">{col.title}</h3>
            <div className="text-sm text-white/50">{filteredIssues.filter(i => i.status === col.key).length}</div>
          </div>
          <div className="space-y-3 min-h-[120px] md:min-h-[200px]">
            {filteredIssues
              .filter((i) => i.status === col.key)
              .map((issue) => (
                <div
                  key={issue.id}
                  draggable
                  onDragStart={e => onDragStart(e, issue)}
                  onDragEnd={onDragEnd}
                  style={{ opacity: draggedId === issue.id ? 0.5 : 1 }}
                  tabIndex={0}
                  aria-label={`Issue ${issue.title}`}
                >
                  <IssueCard issue={issue} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
