export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type IssueStatus = 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';

export interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
  priority: Priority;
  points: number;
  assignee: string;
  type: string;
}
