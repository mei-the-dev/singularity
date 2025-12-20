import React from 'react';
import type { Issue } from '../types/types';

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
      data-testid="issue-modal-overlay"
    >
      <div
        className="bg-gradient-to-br from-amber-950/90 to-black border border-amber-700/50 rounded-2xl max-w-3xl w-full p-6 shadow-2xl shadow-amber-900/50 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        data-testid="issue-modal-content"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-amber-700" data-testid="modal-issue-id">#{issue.id}</span>
            <h2 className="text-xl font-light text-amber-100" data-testid="modal-issue-title">{issue.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-amber-600 hover:text-amber-400 transition-colors"
            data-testid="modal-close-button"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <div className="flex-1 bg-amber-950/40 border border-amber-900/30 rounded-lg p-4" data-testid="modal-status-field">
              <div className="text-xs text-amber-700 mb-1">Status</div>
              <div className="text-amber-100 capitalize">{issue.status}</div>
            </div>
            <div className="flex-1 bg-amber-950/40 border border-amber-900/30 rounded-lg p-4" data-testid="modal-priority-field">
              <div className="text-xs text-amber-700 mb-1">Priority</div>
              <div className="text-amber-100 capitalize">{issue.priority}</div>
            </div>
            <div className="flex-1 bg-amber-950/40 border border-amber-900/30 rounded-lg p-4" data-testid="modal-points-field">
              <div className="text-xs text-amber-700 mb-1">Story Points</div>
              <div className="text-amber-100">{issue.points}</div>
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-900/30 rounded-lg p-4" data-testid="modal-description-field">
            <div className="text-xs text-amber-700 mb-2">Description</div>
            <p className="text-amber-200/80 text-sm leading-relaxed">
              {issue.body || 'No description provided.'}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-lg transition-all duration-300 shadow-lg shadow-amber-900/50 text-black font-medium" data-testid="start-development-button">
              Start Development
            </button>
            {issue.url && (
              <a
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-amber-950/40 border border-amber-900/30 hover:bg-amber-950/60 rounded-lg transition-all text-amber-400 flex items-center justify-center"
                data-testid="github-link"
              >
                View in GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;