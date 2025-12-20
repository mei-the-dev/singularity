import { Meta, StoryObj } from '@storybook/react-vite';
import BlackholeBoard from './BlackholeBoard';

const meta: Meta<typeof BlackholeBoard> = {
	title: 'Environment/BlackholeBoard',
	component: BlackholeBoard,
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