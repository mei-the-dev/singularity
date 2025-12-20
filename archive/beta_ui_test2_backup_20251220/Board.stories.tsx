import { Meta, StoryObj } from '@storybook/react-vite';
import Board from './Board';
import type { Issue } from './types';

const meta: Meta<typeof Board> = {
  title: 'Templates/Board',
  component: Board,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleColumns = [
  { id: 'backlog', title: 'Backlog', color: 'from-amber-900/30 to-amber-800/20' },
  { id: 'todo', title: 'To Do', color: 'from-amber-800/30 to-amber-700/20' },
  { id: 'inprogress', title: 'In Progress', color: 'from-amber-600/30 to-amber-500/20' },
  { id: 'review', title: 'Review', color: 'from-amber-500/30 to-amber-400/20' },
  { id: 'done', title: 'Done', color: 'from-amber-400/30 to-amber-300/20' }
];

const sampleIssues: Issue[] = [
  { id: 1, title: 'Implement authentication module', status: 'inprogress', assignee: 'JD', priority: 'high', points: 8, type: 'feature' },
  { id: 2, title: 'Fix memory leak in data service', status: 'review', assignee: 'AS', priority: 'critical', points: 5, type: 'bug' },
  { id: 3, title: 'Design new dashboard layout', status: 'todo', assignee: 'MK', priority: 'medium', points: 3, type: 'design' },
  { id: 4, title: 'Update API documentation', status: 'backlog', assignee: 'LW', priority: 'low', points: 2, type: 'docs' },
  { id: 5, title: 'Optimize database queries', status: 'inprogress', assignee: 'JD', priority: 'high', points: 13, type: 'enhancement' },
  { id: 6, title: 'Add unit tests for components', status: 'todo', assignee: 'AS', priority: 'medium', points: 5, type: 'test' },
  { id: 7, title: 'Migrate to new CI/CD pipeline', status: 'done', assignee: 'MK', priority: 'high', points: 8, type: 'infrastructure' },
];

export const Default: Story = {
  args: {
    columns: sampleColumns,
    issues: sampleIssues,
    onIssueClick: (issue: Issue) => console.log('Issue clicked:', issue),
  },
};