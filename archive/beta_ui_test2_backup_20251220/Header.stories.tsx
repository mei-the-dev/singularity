import { Meta, StoryObj } from '@storybook/react-vite';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchQuery: '',
    onSearchChange: (query: string) => console.log('Search:', query),
    onNewIssue: () => console.log('New issue'),
  },
};

export const WithSearchQuery: Story = {
  args: {
    searchQuery: 'authentication',
    onSearchChange: (query: string) => console.log('Search:', query),
    onNewIssue: () => console.log('New issue'),
  },
};