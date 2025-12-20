import type { Meta, StoryObj } from '@storybook/react';
import IssueDetailModal from './IssueDetailModal';

const meta: Meta<typeof IssueDetailModal> = {
	title: 'Environment/IssueDetailModal',
	component: IssueDetailModal,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};