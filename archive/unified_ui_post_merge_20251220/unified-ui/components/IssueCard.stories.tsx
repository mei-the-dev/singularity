import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import IssueCard from './IssueCard';
import type { Issue } from '../types/types';

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
  parameters: {
    docs: {
      description: {
        component: 'Compact issue card used on boards; supports `onClick` to open details.'
      }
    }
  },
  argTypes: {
    issue: { control: false },
    onClick: { action: 'clicked' }
  }
};

export default meta;

type Story = StoryObj<typeof IssueCard>;

export const Default: Story = { args: { issue: sample } };
export const Interactive: Story = { args: { issue: sample } };
