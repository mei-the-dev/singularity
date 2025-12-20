import { Meta, StoryObj } from '@storybook/react-vite';
import BlackholeBackground from './BlackholeBackground';

const meta: Meta<typeof BlackholeBackground> = {
	title: 'Environment/BlackholeBackground',
	component: BlackholeBackground,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		mousePosition: { x: 0, y: 0 },
	},
};