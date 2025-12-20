import { Meta, StoryObj } from '@storybook/react-vite';
import IssueCard from './IssueCard';

const meta: Meta<typeof IssueCard> = {
	title: 'Environment/IssueCard',
	component: IssueCard,
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