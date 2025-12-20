import React from 'react';
import IssueCard from './IssueCard';
import type { Issue } from './types';

interface ColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
  };
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
}

const Column: React.FC<ColumnProps> = ({ column, issues, onIssueClick }) => {
  return (
    <div className="flex flex-col">
      <div className={`bg-gradient-to-br ${column.color} border border-amber-900/30 rounded-t-xl px-4 py-3 backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-amber-100">{column.title}</h3>
          <span className="text-xs text-amber-600 bg-amber-950/50 px-2 py-1 rounded-full">
            {issues.length}
          </span>
        </div>
      </div>

      <div className="bg-black/40 border-x border-b border-amber-900/30 rounded-b-xl p-3 space-y-3 min-h-[600px] backdrop-blur-sm">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} onClick={onIssueClick} />
        ))}
      </div>
    </div>
  );
};

export default Column;