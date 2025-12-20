import React, { useState, useEffect } from 'react';
import BlackholeBackground from './BlackholeBackground';
import Header from './Header';
import Board from './Board';
import IssueDetailModal from './IssueDetailModal';
// import { fetchGitHubIssues } from './githubApi';
import type { Issue } from './types';

const BlackholeBoard: React.FC = () => {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        // const fetchedIssues = await fetchGitHubIssues();
        // setIssues(fetchedIssues);
        // Fallback to sample data
        setIssues([
          { id: 1, title: 'Implement authentication module', status: 'inprogress', assignee: 'JD', priority: 'high', points: 8, type: 'feature' },
          { id: 2, title: 'Fix memory leak in data service', status: 'review', assignee: 'AS', priority: 'critical', points: 5, type: 'bug' },
          { id: 3, title: 'Design new dashboard layout', status: 'todo', assignee: 'MK', priority: 'medium', points: 3, type: 'design' },
          { id: 4, title: 'Update API documentation', status: 'backlog', assignee: 'LW', priority: 'low', points: 2, type: 'docs' },
          { id: 5, title: 'Optimize database queries', status: 'inprogress', assignee: 'JD', priority: 'high', points: 13, type: 'enhancement' },
          { id: 6, title: 'Add unit tests for components', status: 'todo', assignee: 'AS', priority: 'medium', points: 5, type: 'test' },
          { id: 7, title: 'Migrate to new CI/CD pipeline', status: 'done', assignee: 'MK', priority: 'high', points: 8, type: 'infrastructure' },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load issues');
        // Fallback to sample data
        setIssues([
          { id: 1, title: 'Implement authentication module', status: 'inprogress', assignee: 'JD', priority: 'high', points: 8, type: 'feature' },
          { id: 2, title: 'Fix memory leak in data service', status: 'review', assignee: 'AS', priority: 'critical', points: 5, type: 'bug' },
          { id: 3, title: 'Design new dashboard layout', status: 'todo', assignee: 'MK', priority: 'medium', points: 3, type: 'design' },
          { id: 4, title: 'Update API documentation', status: 'backlog', assignee: 'LW', priority: 'low', points: 2, type: 'docs' },
          { id: 5, title: 'Optimize database queries', status: 'inprogress', assignee: 'JD', priority: 'high', points: 13, type: 'enhancement' },
          { id: 6, title: 'Add unit tests for components', status: 'todo', assignee: 'AS', priority: 'medium', points: 5, type: 'test' },
          { id: 7, title: 'Migrate to new CI/CD pipeline', status: 'done', assignee: 'MK', priority: 'high', points: 8, type: 'infrastructure' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'from-amber-900/30 to-amber-800/20' },
    { id: 'todo', title: 'To Do', color: 'from-amber-800/30 to-amber-700/20' },
    { id: 'inprogress', title: 'In Progress', color: 'from-amber-600/30 to-amber-500/20' },
    { id: 'review', title: 'Review', color: 'from-amber-500/30 to-amber-400/20' },
    { id: 'done', title: 'Done', color: 'from-amber-400/30 to-amber-300/20' }
  ];

  const handleNewIssue = () => {
    // Handle new issue creation
    console.log('New issue');
  };

  return (
    <div className="min-h-screen bg-black text-amber-100 overflow-hidden relative" data-testid="blackhole-board">
      <BlackholeBackground mousePosition={mousePosition} />

      {/* Main Content */}
      <div className="relative z-10">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewIssue={handleNewIssue}
        />

        {loading ? (
          <div className="flex items-center justify-center p-8" data-testid="loading-state">
            <div className="text-amber-400 text-lg">Loading GitHub issues...</div>
          </div>
        ) : error ? (
          <div className="p-6" data-testid="error-state">
            <div className="bg-red-950/40 border border-red-700/50 rounded-lg p-4 text-red-300">
              <h3 className="font-medium mb-2">Error loading issues</h3>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2 text-red-400">
                Setup: Install GitHub CLI (<code>gh auth login</code>) then set REACT_APP_GITHUB_TOKEN
              </p>
            </div>
          </div>
        ) : (
          <Board
            columns={columns}
            issues={issues}
            onIssueClick={setSelectedIssue}
          />
        )}
      </div>

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

    </div>
  );
};

export default BlackholeBoard;