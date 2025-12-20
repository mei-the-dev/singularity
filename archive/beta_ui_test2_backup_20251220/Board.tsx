import React from 'react';
import Column from './Column';
import type { Issue } from './types';

interface BoardProps {
  columns: Array<{
    id: string;
    title: string;
    color: string;
  }>;
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
}

const Board: React.FC<BoardProps> = ({ columns, issues, onIssueClick }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-5 gap-4" data-testid="kanban-board">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            issues={issues.filter(issue => issue.status === column.id)}
            onIssueClick={onIssueClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;