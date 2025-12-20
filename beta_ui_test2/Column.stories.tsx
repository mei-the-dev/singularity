import { Meta, StoryObj } from '@storybook/react-vite';
import Column from './Column';
import type { Issue } from './types';

const meta: Meta<typeof Column> = {
  title: 'Organisms/Column',
  component: Column,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleIssues: Issue[] = [
  {
    id: 1,
    title: 'Implement authentication module',
    status: 'inprogress',
    assignee: 'JD',
    priority: 'high',
    points: 8,
    type: 'feature',
  },
  {
    id: 2,
    title: 'Fix memory leak in data service',
    status: 'inprogress',
    assignee: 'AS',
    priority: 'critical',
    points: 5,
    type: 'bug',
  },
];

const sampleColumn = {
  id: 'inprogress',
  title: 'In Progress',
  color: 'from-amber-600/30 to-amber-500/20',
};

export const Default: Story = {
  args: {
    column: sampleColumn,
    issues: sampleIssues,
    onIssueClick: (issue: Issue) => console.log('Issue clicked:', issue),
  },
};

export const Empty: Story = {
  args: {
    column: sampleColumn,
    issues: [],
    onIssueClick: (issue: Issue) => console.log('Issue clicked:', issue),
  },
};