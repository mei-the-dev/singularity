import React from 'react';
import { Plus, Search, Filter, GitBranch } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewIssue: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onNewIssue }) => {
  return (
    <header className="border-b border-amber-900/30 bg-black/80 backdrop-blur-xl">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4" data-testid="header-brand">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/50">
              <GitBranch className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-amber-100">Event Horizon</h1>
              <p className="text-xs text-amber-700">Component Development Lifecycle</p>
            </div>
          </div>

          <button
            onClick={onNewIssue}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-amber-900/50 hover:shadow-amber-800/70 hover:scale-105"
            data-testid="new-issue-button"
          >
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-amber-950/30 border border-amber-900/30 rounded-lg pl-10 pr-4 py-2 text-sm text-amber-100 placeholder-amber-800 focus:outline-none focus:border-amber-700/50 focus:bg-amber-950/50 transition-all"
              data-testid="search-input"
            />
          </div>
          <button className="px-4 py-2 bg-amber-950/30 border border-amber-900/30 rounded-lg flex items-center gap-2 hover:bg-amber-950/50 transition-all" data-testid="filters-button">
            <Filter className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-400">Filters</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;