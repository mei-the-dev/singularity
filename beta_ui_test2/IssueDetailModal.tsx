import React from 'react';
import type { Issue } from './types';

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
}

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, onClose }) => {
  if (!issue) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-amber-950/90 to-black border border-amber-700/50 rounded-2xl max-w-3xl w-full p-6 shadow-2xl shadow-amber-900/50 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-amber-700">#{issue.id}</span>
            <h2 className="text-xl font-light text-amber-100">{issue.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-amber-600 hover:text-amber-400 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="flex-1 bg-amber-950/40 border border-amber-900/30 rounded-lg p-4">
              <div className="text-xs text-amber-700 mb-1">Status</div>
              <div className="text-amber-100 capitalize">{issue.status}</div>
            </div>
            <div className="flex-1 bg-amber-950/40 border border-amber-900/30 rounded-lg p-4">
              <div className="text-xs text-amber-700 mb-1">Priority</div>
              <div className="text-amber-100 capitalize">{issue.priority}</div>
            </div>
            <div className="flex-1 bg-amber-950/40 border border-amber-900/30 rounded-lg p-4">
              <div className="text-xs text-amber-700 mb-1">Story Points</div>
              <div className="text-amber-100">{issue.points}</div>
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-900/30 rounded-lg p-4">
            <div className="text-xs text-amber-700 mb-2">Description</div>
            <p className="text-amber-200/80 text-sm leading-relaxed">
              This component requires careful implementation to ensure scalability and maintainability across the system.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-lg transition-all duration-300 shadow-lg shadow-amber-900/50 text-black font-medium">
              Start Development
            </button>
            <button className="px-4 py-3 bg-amber-950/40 border border-amber-900/30 hover:bg-amber-950/60 rounded-lg transition-all text-amber-400">
              View in GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;