"use client";
import { Layout, GitPullRequest, Settings, Activity, Search } from 'lucide-react';
import React from 'react';
import { useIssues } from './IssuesProvider';

export default function Sidebar() {
  const { filters, setFilters } = useIssues();
  const navItem = (Icon: any, active?: boolean) => (
    <div className={`p-3 rounded-xl mb-4 transition-all ${active ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-gray-500 hover:text-gray-200'}`}>
      <Icon size={20} />
    </div>
  );
  return (
    <aside className="w-20 border-r border-white/5 flex flex-col items-center py-6 glass-panel z-50" aria-label="Sidebar Navigation">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-yellow-700 mb-8 shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
      {navItem(Layout, true)}
      {navItem(GitPullRequest)}
      {navItem(Activity)}
      <form className="flex flex-col gap-2 mt-8 w-full px-2" aria-label="Filter and Search">
        <div className="flex items-center gap-2 bg-black/30 rounded px-2">
          <Search size={16} />
          <input
            className="bg-transparent text-xs text-white py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
            placeholder="Search..."
            value={filters.text || ''}
            onChange={e => setFilters({ ...filters, text: e.target.value })}
            aria-label="Search issues"
          />
        </div>
        <input
          className="bg-black/30 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Assignee"
          value={filters.assignee || ''}
          onChange={e => setFilters({ ...filters, assignee: e.target.value })}
          aria-label="Filter by assignee"
        />
        <input
          className="bg-black/30 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Label"
          value={filters.label || ''}
          onChange={e => setFilters({ ...filters, label: e.target.value })}
          aria-label="Filter by label"
        />
        <select
          className="bg-black/30 rounded px-2 py-1 text-xs text-white"
          value={filters.status || ''}
          onChange={e => setFilters({ ...filters, status: e.target.value as any })}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="backlog">Backlog</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </form>
      <div className="mt-auto">{navItem(Settings)}</div>
    </aside>
  );
}