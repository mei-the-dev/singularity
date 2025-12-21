import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import DashboardHeader from './DashboardHeader'

const meta: Meta<typeof DashboardHeader> = {
  title: 'EventHorizon/DashboardHeader',
  component: DashboardHeader,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof DashboardHeader>

export const Default: Story = {
  args: { title: 'EventHorizon', openCount: 12, activeView: 'board' },
}
