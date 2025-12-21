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

export type { ViewType as EventHorizonViewType };
