import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import BlackholeBackground from './BlackholeBackground';

const meta: Meta<typeof BlackholeBackground> = {
  title: 'Environment/BlackholeBackground',
  component: BlackholeBackground,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' }
};
export default meta;

type Story = StoryObj<typeof BlackholeBackground>;

export const Idle: Story = {};
export const Interactive: Story = { args: { className: 'interactive' } };
