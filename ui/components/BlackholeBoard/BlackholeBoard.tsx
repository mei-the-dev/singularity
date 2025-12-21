import React, { useRef, useState, useEffect } from 'react';
import { Plus, Search, Filter, GitBranch } from 'lucide-react';
import BlackholeBackground from '../BlackholeBackground/BlackholeBackground';
import IssueCard from '../IssueCard/IssueCard';
import type { Issue } from '../../types';

const BlackholeBoard: React.FC = () => {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  // PERFORMANCE: use CSS vars on container instead of React state for mouse position
  useEffect(() => {
    const el = containerRef.current || document.documentElement;
    const handleMouseMove = (e: MouseEvent) => {
      try {
        el.style.setProperty('--mouse-x', `${e.clientX}px`);
        el.style.setProperty('--mouse-y', `${e.clientY}px`);
      } catch (err) {
        // best-effort, ignore
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'from-amber-900/30 to-amber-800/20' },
    { id: 'todo', title: 'To Do', color: 'from-amber-800/30 to-amber-700/20' },
    { id: 'inprogress', title: 'In Progress', color: 'from-amber-600/30 to-amber-500/20' },
    { id: 'review', title: 'Review', color: 'from-amber-500/30 to-amber-400/20' },
    { id: 'done', title: 'Done', color: 'from-amber-400/30 to-amber-300/20' }
  ];

  const issues: Issue[] = [
    { id: 1, title: 'Implement authentication module', status: 'inprogress', assignee: 'JD', priority: 'high', points: 8, type: 'feature' },
    { id: 2, title: 'Fix memory leak in data service', status: 'review', assignee: 'AS', priority: 'critical', points: 5, type: 'bug' },
    { id: 3, title: 'Design new dashboard layout', status: 'todo', assignee: 'MK', priority: 'medium', points: 3, type: 'design' },
    { id: 4, title: 'Update API documentation', status: 'backlog', assignee: 'LW', priority: 'low', points: 2, type: 'docs' },
    { id: 5, title: 'Optimize database queries', status: 'inprogress', assignee: 'JD', priority: 'high', points: 13, type: 'enhancement' },
    { id: 6, title: 'Add unit tests for components', status: 'todo', assignee: 'AS', priority: 'medium', points: 5, type: 'test' },
    { id: 7, title: 'Migrate to new CI/CD pipeline', status: 'done', assignee: 'MK', priority: 'high', points: 8, type: 'infrastructure' },
  ];



  return (
    <div className="min-h-screen bg-black text-amber-100 overflow-hidden relative" data-testid="blackhole-board">
      {/* Reuse the shared BlackholeBackground component */}
      <BlackholeBackground />


      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-amber-900/30 bg-black/80 backdrop-blur-xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/50">
                  <GitBranch className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-amber-100">Event Horizon</h1>
                  <p className="text-xs text-amber-700">Component Development Lifecycle</p>
                </div>
              </div>
              
              <button className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-amber-900/50 hover:shadow-amber-800/70 hover:scale-105">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium text-black">New Issue</span>
              </button>
            </div>

            {/* Search & Filters */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                  className="w-full bg-amber-950/30 border border-amber-900/30 rounded-lg pl-10 pr-4 py-2 text-sm text-amber-100 placeholder-amber-800 focus:outline-none focus:border-amber-700/50 focus:bg-amber-950/50 transition-all"
                />
              </div>
              <button className="px-4 py-2 bg-amber-950/30 border border-amber-900/30 rounded-lg flex items-center gap-2 hover:bg-amber-950/50 transition-all">
                <Filter className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-400">Filters</span>
              </button>
            </div>
          </div>
        </header>

        {/* Board Columns */}
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col">
                <ColumnHeader title={column.title} count={issues.filter(i => i.status === column.id).length} />

                <div className="bg-black/40 border-x border-b border-amber-900/30 rounded-b-xl p-3 space-y-3 min-h-[600px] backdrop-blur-sm">
                  {issues
                    .filter(issue => issue.status === column.id)
                    .map((issue) => (
                      <IssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn"
          onClick={() => setSelectedIssue(null)}
        >
          <div 
            className="bg-gradient-to-br from-amber-950/90 to-black border border-amber-700/50 rounded-2xl max-w-3xl w-full p-6 shadow-2xl shadow-amber-900/50 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-amber-700">#{selectedIssue.id}</span>
                <h2 className="text-xl font-light text-amber-100">{selectedIssue.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="text-amber-600 hover:text-amber-400 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-4">
                <div className="flex-1 bg-amber-950/40 border border-amber-900/30 rounded-lg p-4">
                  <div className="text-xs text-amber-700 mb-1">Status</div>
                  <div className="text-amber-100 capitalize">{selectedIssue.status}</div>
                </div>
                <div className="flex-1 bg-amber-950/40 border border-amber-900/30 rounded-lg p-4">
                  <div className="text-xs text-amber-700 mb-1">Priority</div>
                  <div className="text-amber-100 capitalize">{selectedIssue.priority}</div>
                </div>
                <div className="flex-1 bg-amber-950/40 border border-amber-900/30 rounded-lg p-4">
                  <div className="text-xs text-amber-700 mb-1">Story Points</div>
                  <div className="text-amber-100">{selectedIssue.points}</div>
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
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BlackholeBoard;
