"use client";
import React, { useRef } from "react";
import IssueCard from "./IssueCard";
import { useIssues } from "./IssuesProvider";
import { Issue } from "./IssuesProvider";

const COLUMNS: { key: Issue['status']; title: string; style?: string }[] = [
  { key: 'backlog', title: 'Backlog' },
  { key: 'in-progress', title: 'In Progress' },
  { key: 'done', title: 'Done' },
];

export default function KanbanBoard() {
  const { issues, updateIssueStatus } = useIssues();
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const onDragEnd = (e: any, issue: Issue) => {
    // e is pointer event; compute center and check which column contains it
    try {
      const x = e.clientX;
      const y = e.clientY;
      for (const col of COLUMNS) {
        const el = columnRefs.current[col.key];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          if (issue.status !== col.key) updateIssueStatus(issue.id, col.key);
          break;
        }
      }
    } catch (err) {
      // fallback: do nothing
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map((col) => (
        <div key={col.key} className="flex flex-col" ref={(el) => { columnRefs.current[col.key] = el; }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">{col.title}</h3>
            <div className="text-sm text-white/50">{issues.filter(i => i.status === col.key).length}</div>
          </div>
          <div className="space-y-3 min-h-[200px]">
            {issues
              .filter((i) => i.status === col.key)
              .map((issue) => (
                <div key={issue.id} onPointerUp={(e) => onDragEnd(e as any, issue)}>
                  <IssueCard issue={issue} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
