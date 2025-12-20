import React from 'react';
import { AlertCircle, Plus, GitBranch, GitCommit, GitPullRequest, Clock } from 'lucide-react';
import type { Issue } from './types';

interface IssueCardProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'bug': return <AlertCircle className="w-3 h-3" />;
      case 'feature': return <Plus className="w-3 h-3" />;
      case 'enhancement': return <GitBranch className="w-3 h-3" />;
      default: return <GitCommit className="w-3 h-3" />;
    }
  };

  return (
    <div
      onClick={() => onClick(issue)}
      className="bg-gradient-to-br from-amber-950/40 to-amber-900/20 border border-amber-800/30 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:border-amber-600/50 hover:shadow-lg hover:shadow-amber-900/30 hover:-translate-y-1 group"
      data-testid="issue-card"
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(issue.priority)}`} data-testid="priority-badge">
          {issue.priority}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-amber-600" data-testid="type-icon">{getTypeIcon(issue.type)}</span>
          <span className="text-xs text-amber-700" data-testid="issue-id">#{issue.id}</span>
        </div>
      </div>

      <h4 className="text-sm text-amber-100 mb-3 group-hover:text-amber-50 transition-colors" data-testid="issue-title">
        {issue.title}
      </h4>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-[10px] font-medium text-black shadow-md" data-testid="assignee-avatar">
            {issue.assignee}
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-700" data-testid="story-points">
            <Clock className="w-3 h-3" />
            <span>{issue.points}pt</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:bg-amber-900/30 rounded transition-colors">
            <GitCommit className="w-3 h-3 text-amber-600" />
          </button>
          <button className="p-1 hover:bg-amber-900/30 rounded transition-colors">
            <GitPullRequest className="w-3 h-3 text-amber-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;