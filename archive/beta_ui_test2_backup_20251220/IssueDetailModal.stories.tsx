import { Meta, StoryObj } from '@storybook/react-vite';
import IssueDetailModal from './IssueDetailModal';
import type { Issue } from './types';

const meta: Meta<typeof IssueDetailModal> = {
  title: 'Organisms/IssueDetailModal',
  component: IssueDetailModal,
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
    onClose: () => console.log('Modal closed'),
  },
};

export const CriticalIssue: Story = {
  args: {
    issue: { ...sampleIssue, priority: 'critical', type: 'bug' },
    onClose: () => console.log('Modal closed'),
  },
};

export const Closed: Story = {
  args: {
    issue: null,
    onClose: () => console.log('Modal closed'),
  },
};