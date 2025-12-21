# Component Development Guide

## Creating a New Component

Use the AI agent or manually scaffold:

1. Create `ui/components/YourComponent/YourComponent.tsx`
2. Create `ui/components/YourComponent/YourComponent.stories.tsx`
3. Create `ui/components/YourComponent/index.ts`

## Component Template

Example TypeScript component:

import React from 'react';

export interface YourComponentProps {
  title: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export const YourComponent: React.FC<YourComponentProps> = ({
  title,
  variant = 'default'
}) => {
  return (
    <div className="rounded-lg p-4">
      <h3>{title}</h3>
    </div>
  );
};

## Story Template

import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Hello World' },
};

## Visual Test Template

import { test, expect } from '@playwright/test';

test('YourComponent - Default', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=components-yourcomponent--default');
  await page.waitForSelector('[class*="rounded-lg"]');
  await expect(page).toHaveScreenshot('yourcomponent-default.png');
});
