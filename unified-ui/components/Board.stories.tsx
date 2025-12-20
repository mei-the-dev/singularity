import { Meta, StoryObj } from '@storybook/react-vite';
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