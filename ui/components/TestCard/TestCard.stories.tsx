import type { Meta, StoryObj } from '@storybook/react';
import { TestCard } from './TestCard';

const meta: Meta<typeof TestCard> = {
  title: 'Test/TestCard',
  component: TestCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Revenue', value: '$45k' },
};
