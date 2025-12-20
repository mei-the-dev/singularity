import { Meta, StoryObj } from '@storybook/react-vite';
import IssueCard from './IssueCard';
import type { Issue } from './types';

const meta: Meta<typeof IssueCard> = {
  title: 'Molecules/IssueCard',
  component: IssueCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleIssue: Issue = {
  id: 1,
  title: 'Implement authentication module',
  status: 'inprogress',
  assignee: 'JD',
  priority: 'high',
  points: 8,
  type: 'feature',
};

export const Default: Story = {
  args: {
    issue: sampleIssue,
    onClick: (issue: Issue) => console.log('Issue clicked:', issue),
  },
};

export const CriticalPriority: Story = {
  args: {
    issue: { ...sampleIssue, priority: 'critical', type: 'bug' },
    onClick: (issue: Issue) => console.log('Issue clicked:', issue),
  },
};

export const LowPriority: Story = {
  args: {
    issue: { ...sampleIssue, priority: 'low', type: 'docs' },
    onClick: (issue: Issue) => console.log('Issue clicked:', issue),
  },
};