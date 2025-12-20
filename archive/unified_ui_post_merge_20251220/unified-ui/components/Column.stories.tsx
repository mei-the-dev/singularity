import type { Meta, StoryObj } from '@storybook/react';
import Column from './Column';

const meta: Meta<typeof Column> = {
	title: 'Environment/Column',
	component: Column,
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