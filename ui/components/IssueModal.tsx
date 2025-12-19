"use client";
import React, {useState} from 'react';
import type { Issue } from './IssuesProvider';

export default function IssueModal({ issue, onClose, onAction }: { issue: Issue; onClose: () => void; onAction?: (type: string, id: number) => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const callAction = async (type: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/issues', { method: 'POST', body: JSON.stringify({ action: type, args: { issue_number: issue.number, issue_id: issue.id } }) });
      const data = await res.json();
      setMessage(data?.msg || 'OK');
      onAction && onAction(type, issue.number);
    } catch (e: any) {
      setMessage(e?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" data-testid={`issue-modal-${issue.number}`}>
      <div className="bg-[#0b0b0c] rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white">#{issue.number} — {issue.title}</h3>
            <div className="text-xs text-white/50 mt-1">{issue.assignee || 'Unassigned'} • {issue.state}</div>
          </div>
          <button aria-label="Close modal" className="text-white/60" onClick={onClose} data-testid={`issue-modal-${issue.number}-close`}>✕</button>
        </div>

        <div className="mt-4 text-sm text-white/60">
          <div dangerouslySetInnerHTML={{ __html: issue.body || '<em>No description</em>' }} />
        </div>

        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 bg-gold text-black rounded" onClick={() => callAction('plan')} disabled={loading} data-testid={`issue-modal-${issue.number}-plan`}>Start Task</button>
          <button className="px-4 py-2 bg-white/5 text-white rounded" onClick={() => callAction('run_tests')} disabled={loading} data-testid={`issue-modal-${issue.number}-run`}>{loading ? 'Running...' : 'Run Tests'}</button>
          <button className="px-4 py-2 bg-white/5 text-white rounded" onClick={() => callAction('create_pr')} disabled={loading} data-testid={`issue-modal-${issue.number}-pr`}>Create PR</button>
          <button className="px-4 py-2 bg-white/5 text-white rounded" onClick={() => callAction('update_issue')} disabled={loading} data-testid={`issue-modal-${issue.number}-close-issue`}>Close</button>
        </div>

        {message && <div className="mt-4 text-sm text-gold" data-testid={`issue-modal-${issue.number}-msg`}>{message}</div>}
      </div>
    </div>
  );
}
