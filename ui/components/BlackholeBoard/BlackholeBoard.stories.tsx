import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import BlackholeBoard from './BlackholeBoard';

const meta: Meta<typeof BlackholeBoard> = {
  title: 'Board/BlackholeBoard',
  component: BlackholeBoard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof BlackholeBoard>;

export const Default: Story = {};
