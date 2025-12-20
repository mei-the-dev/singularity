import type { Meta, StoryObj } from '@storybook/react';
import Board from './Board';

const meta: Meta<typeof Board> = {
	title: 'Environment/Board',
	component: Board,
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