export interface Issue {
  id: number;
  title: string;
  status: string;
  assignee: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  points: number;
  type: 'bug' | 'feature' | 'enhancement' | 'design' | 'docs' | 'test' | 'infrastructure';
}