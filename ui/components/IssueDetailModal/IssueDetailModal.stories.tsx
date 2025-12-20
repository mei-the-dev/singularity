import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import IssueDetailModal from './IssueDetailModal';
import type { Issue } from '../../types';

const sample: Issue = {
  id: 2001,
  title: 'Sample Issue',
  status: 'todo',
  priority: 'medium',
  points: 3,
  assignee: 'AI',
  type: 'feature',
  body: 'This is a sample issue for modal preview.',
  url: 'https://example.com'
};

const meta: Meta<typeof IssueDetailModal> = {
  title: 'Molecules/IssueDetailModal',
  component: IssueDetailModal,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof IssueDetailModal>;

export const Default: Story = { args: { issue: sample, onClose: () => {} } };
