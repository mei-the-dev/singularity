import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import IssueCard from './IssueCard';
import type { Issue } from '../../types';

const sample: Issue = {
  id: 1001,
  title: 'Refactor Gravity Well',
  status: 'todo',
  priority: 'medium',
  points: 5,
  assignee: 'AI',
  type: 'feature'
};

const meta: Meta<typeof IssueCard> = {
  title: 'Molecules/IssueCard',
  component: IssueCard,
  tags: ['autodocs'],
  argTypes: {
    issue: { control: false }
  }
};

export default meta;

type Story = StoryObj<typeof IssueCard>;

export const Default: Story = { args: { issue: sample } };
