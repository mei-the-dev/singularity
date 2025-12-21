// ============================================================================
// FILE: ui/components/EventHorizonDashboard/types/index.ts
// ============================================================================

export type ViewType = 'board' | 'tools' | 'status';

export type IssueStatus = 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueType = 'bug' | 'feature' | 'enhancement' | 'docs' | 'test' | 'infrastructure' | 'design';

export interface Issue {
  id: number;
  title: string;
  body?: string;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  assignee?: string;
  points?: number;
  mcp_tool?: string;
  labels?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  status: 'ready' | 'running' | 'error' | 'disabled';
  category: string;
}

export interface ServiceStatus {
  name: string;
  port: number;
  status: 'running' | 'stopped' | 'starting' | 'error';
  health: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  uptime?: string;
  url?: string;
}

export interface EnvironmentCheck {
  name: string;
  ok: boolean;
  version?: string;
}

export interface RecentOperation {
  action: string;
  component?: string;
  scope?: string;
  issue?: string;
  time: string;
  status: 'success' | 'failure';
}

// ============================================================================
// FILE: ui/components/EventHorizonDashboard/hooks/useMCPStatus.ts
// ============================================================================

import { useQuery } from '@tanstack/react-query';
import type { MCPTool, ServiceStatus } from '../types';

// Mock MCP client - replace with actual implementation
const mcpClient = {
  checkStorybookStatus: async () => ({
    running: true,
    healthy: true,
    components: 12,
    url: 'http://localhost:6006'
  }),
  
  checkServices: async (ports: number[]) => {
    const status: Record<number, boolean> = {};
    ports.forEach(port => status[port] = true);
    return status;
  },
  
  listTools: async (): Promise<MCPTool[]> => [
    { name: 'scaffold_component', description: 'Generate component', status: 'ready', category: 'Components' },
    { name: 'run_visual_tests', description: 'Visual tests', status: 'ready', category: 'Testing' },
  ],
};

export function useMCPStatus() {
  const tools = useQuery({
    queryKey: ['mcp', 'tools'],
    queryFn: mcpClient.listTools,
    refetchInterval: 10000,
  });
  
  const services = useQuery({
    queryKey: ['mcp', 'services'],
    queryFn: async (): Promise<ServiceStatus[]> => {
      const ports = await mcpClient.checkServices([6006, 3000, 8080]);
      return [
        { name: 'Storybook', port: 6006, status: ports[6006] ? 'running' : 'stopped', health: 'healthy' },
        { name: 'Next.js', port: 3000, status: ports[3000] ? 'running' : 'stopped', health: 'healthy' },
        { name: 'MCP Server', port: 8080, status: ports[8080] ? 'running' : 'stopped', health: 'healthy' },
      ];
    },
    refetchInterval: 5000,
  });
  
  return {
    tools: tools.data ?? [],
    services: services.data ?? [],
    isLoading: tools.isLoading || services.isLoading,
    error: tools.error || services.error,
  };
}

// ============================================================================
// FILE: ui/components/EventHorizonDashboard/hooks/useGitHubIssues.ts
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Issue } from '../types';

// Mock GitHub API - replace with actual implementation
const githubAPI = {
  listIssues: async (limit: number = 50): Promise<Issue[]> => [
    {
      id: 1,
      title: 'Implement authentication module',
      status: 'inprogress',
      priority: 'high',
      type: 'feature',
      assignee: 'JD',
      points: 8,
      mcp_tool: 'scaffold_component',
    },
    {
      id: 2,
      title: 'Fix memory leak in data service',
      status: 'review',
      priority: 'critical',
      type: 'bug',
      assignee: 'AS',
      points: 5,
      mcp_tool: 'run_tests',
    },
  ],
  
  updateIssue: async (id: number, data: Partial<Issue>) => {
    return { ...data, id };
  },
  
  createIssue: async (data: { title: string; body: string }) => {
    return { id: Date.now(), ...data, status: 'backlog' as const };
  },
};

export function useGitHubIssues() {
  const queryClient = useQueryClient();
  
  const issues = useQuery({
    queryKey: ['github', 'issues'],
    queryFn: () => githubAPI.listIssues(50),
    refetchInterval: 30000,
  });
  
  const updateIssue = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Issue> }) =>
      githubAPI.updateIssue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github', 'issues'] });
    },
  });
  
  const createIssue = useMutation({
    mutationFn: githubAPI.createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github', 'issues'] });
    },
  });
  
  return {
    issues: issues.data ?? [],
    isLoading: issues.isLoading,
    error: issues.error,
    updateIssue: updateIssue.mutate,
    createIssue: createIssue.mutate,
  };
}

// ============================================================================
// FILE: ui/components/EventHorizonDashboard/components/BlackHoleBackground.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';

export const BlackHoleBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const transform = `translate(calc(-50% + ${(mousePosition.x - window.innerWidth / 2) / 100}px), calc(-50% + ${(mousePosition.y - window.innerHeight / 2) / 100}px))`;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-[#0a0a0f] to-purple-950/20" />
      
      <div className="absolute top-1/2 left-1/2 w-[550px] h-[550px]" style={{ transform }}>
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-indigo-500/10 via-violet-600/5 to-transparent animate-pulse" />
        
        {/* Accretion rings */}
        {[12, 16, 20].map((inset, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-indigo-400/5"
            style={{
              inset: `${inset * 4}px`,
              animation: `spin ${25 + i * 5}s linear infinite`,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
        
        {/* Event horizon */}
        <div className="absolute inset-28 rounded-full bg-[#0a0a0f] shadow-[0_0_100px_rgba(99,102,241,0.2)] border border-indigo-500/10" />
        
        {/* Singularity */}
        <div className="absolute inset-[47%] rounded-full bg-gradient-to-br from-indigo-400/30 to-violet-400/30 blur-sm animate-pulse" />
      </div>

      {/* Stars */}
      {[...Array(80)].map((_, i) => (
        <div
          key={i}
          className="absolute w-px h-px bg-slate-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1,
            animation: `pulse ${4 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// FILE: ui/components/EventHorizonDashboard/components/DashboardHeader.tsx
// ============================================================================

import React from 'react';
import { Plus, Search, Filter, GitBranch } from 'lucide-react';
import type { ViewType } from '../types';

interface DashboardHeaderProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewIssue: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onNewIssue,
}) => {
  const views: Array<{ id: ViewType; label: string; icon: string }> = [
    { id: 'board', label: 'Board', icon: '📊' },
    { id: 'tools', label: 'MCP Tools', icon: '🔧' },
    { id: 'status', label: 'Status', icon: '📡' },
  ];

  return (
    <header className="border-b border-slate-800/40 bg-[#0a0a0f]/70 backdrop-blur-md">
      <div className="px-6 py-4">
        {/* Title and navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-light bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                Event Horizon
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MCP Development Dashboard v21.5
              </p>
            </div>
          </div>
          
          {/* View tabs */}
          <div className="flex gap-2 bg-slate-900/30 border border-slate-800/40 rounded-xl p-1.5">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                  activeView === view.id
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span>{view.icon}</span>
                <span className="font-medium">{view.label}</span>
              </button>
            ))}
          </div>
          
          {/* New issue button */}
          <button
            onClick={onNewIssue}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:scale-105 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="text-sm font-medium text-white">New Issue</span>
          </button>
        </div>
        
        {/* Search bar (only on board view) */}
        {activeView === 'board' && (
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-900/30 border border-slate-800/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <button className="px-4 py-2.5 bg-slate-900/30 border border-slate-800/40 rounded-xl flex items-center gap-2 hover:bg-slate-800/40 transition-all group">
              <Filter className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-slate-300">Filters</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

// ============================================================================
// FILE: ui/components/EventHorizonDashboard/components/IssueCard.tsx
// ============================================================================

import React from 'react';
import { Clock, Zap, AlertCircle, Sparkles, GitBranch, GitCommit } from 'lucide-react';
import type { Issue } from '../types';

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const priorityColors = {
    critical: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    high: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    medium: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    low: 'bg-slate-500/10 text-slate-400 border-slate-600/30',
  };

  const typeIcons = {
    bug: <AlertCircle className="w-3 h-3" />,
    feature: <Sparkles className="w-3 h-3" />,
    enhancement: <GitBranch className="w-3 h-3" />,
  };

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700/40 rounded-xl p-3.5 cursor-pointer transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] group"
    >
      {/* Priority badge and type */}
      <div className="flex items-start justify-between mb-2.5">
        <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${priorityColors[issue.priority]}`}>
          {issue.priority}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">
            {typeIcons[issue.type as keyof typeof typeIcons] || <GitCommit className="w-3 h-3" />}
          </span>
          <span className="text-xs text-slate-600 font-mono">#{issue.id}</span>
        </div>
      </div>
      
      {/* Title */}
      <h4 className="text-sm text-slate-200 mb-3 group-hover:text-slate-100 transition-colors leading-relaxed">
        {issue.title}
      </h4>
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {issue.assignee && (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
              {issue.assignee}
            </div>
          )}
          {issue.points && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span className="font-medium">{issue.points}pt</span>
            </div>
          )}
        </div>
        
        {issue.mcp_tool && (
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] text-slate-500 font-mono">{issue.mcp_tool}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// FILE: ui/components/EventHorizonDashboard/EventHorizonDashboard.tsx
// ============================================================================

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BlackHoleBackground } from './components/BlackHoleBackground';
import { DashboardHeader } from './components/DashboardHeader';
import { IssueCard } from './components/IssueCard';
import { useMCPStatus } from './hooks/useMCPStatus';
import { useGitHubIssues } from './hooks/useGitHubIssues';
import type { ViewType, Issue, IssueStatus } from './types';

const queryClient = new QueryClient();

const EventHorizonDashboardInner: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const { tools, services } = useMCPStatus();
  const { issues } = useGitHubIssues();

  const columns: Array<{ id: IssueStatus; title: string; icon: string }> = [
    { id: 'backlog', title: 'Backlog', icon: '📋' },
    { id: 'todo', title: 'To Do', icon: '📝' },
    { id: 'inprogress', title: 'In Progress', icon: '⚡' },
    { id: 'review', title: 'Review', icon: '👀' },
    { id: 'done', title: 'Done', icon: '✅' },
  ];

  const filteredIssues = issues.filter((issue) =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 relative">
      <BlackHoleBackground />
      
      <div className="relative z-10">
        <DashboardHeader
          activeView={activeView}
          onViewChange={setActiveView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewIssue={() => console.log('New issue')}
        />

        {/* Board View */}
        {activeView === 'board' && (
          <div className="p-6">
            <div className="grid grid-cols-5 gap-4">
              {columns.map((column) => (
                <div key={column.id} className="flex flex-col">
                  <div className="bg-slate-900/40 border border-slate-700/30 rounded-t-2xl px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{column.icon}</span>
                        <h3 className="text-sm font-medium text-slate-200">{column.title}</h3>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-900/50 px-2.5 py-1 rounded-full">
                        {filteredIssues.filter((i) => i.status === column.id).length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950/30 border-x border-b border-slate-700/30 rounded-b-2xl p-3 space-y-3 min-h-[600px]">
                    {filteredIssues
                      .filter((issue) => issue.status === column.id)
                      .map((issue) => (
                        <IssueCard
                          key={issue.id}
                          issue={issue}
                          onClick={() => setSelectedIssue(issue)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools View - Placeholder */}
        {activeView === 'tools' && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {tools.map((tool) => (
                <div key={tool.name} className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-slate-200 mb-2">{tool.name}</h3>
                  <p className="text-xs text-slate-400">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status View - Placeholder */}
        {activeView === 'status' && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {services.map((service) => (
                <div key={service.name} className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">{service.name}</span>
                    <span className={`w-2 h-2 rounded-full ${service.status === 'running' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  </div>
                  <div className="text-xs text-slate-500">Port {service.port}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const EventHorizonDashboard: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <EventHorizonDashboardInner />
  </QueryClientProvider>
);

export default EventHorizonDashboard;